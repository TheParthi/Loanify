const { invokeBedrockModel } = require('../../config/bedrock');
const logger = require('../utils/logger');

class AIEvaluationService {
  
  async evaluateLoanApplication(applicationData) {
    try {
      const prompt = this.buildEvaluationPrompt(applicationData);
      const aiResponse = await invokeBedrockModel(prompt);
      const evaluation = this.parseAIResponse(aiResponse);
      
      // Log the evaluation for audit
      logger.info('AI Evaluation completed', {
        applicationId: applicationData.applicationId,
        score: evaluation.loan_eligibility_score,
        decision: evaluation.approval_status
      });
      
      return evaluation;
    } catch (error) {
      logger.error('AI Evaluation failed', { error: error.message, applicationId: applicationData.applicationId });
      throw error;
    }
  }

  buildEvaluationPrompt(data) {
    const debtToIncomeRatio = ((data.existingDebt + this.calculateEMI(data)) / data.monthlyIncome) * 100;
    
    return `
You are an AI loan evaluation system for an Indian bank following RBI guidelines. Evaluate this loan application and provide a JSON response.

RBI-Based Criteria:
- Minimum CIBIL Score: 700
- Debt-to-Income Ratio: ≤ 40%
- Monthly Income ≥ ₹25,000
- KYC Documents Verified
- Employment stability ≥ 1 year
- No loan default history

Application Data:
{
  "applicant_name": "${data.applicantName}",
  "cibil_score": ${data.cibilScore},
  "monthly_income": ${data.monthlyIncome},
  "loan_amount": ${data.loanAmount},
  "existing_debt": ${data.existingDebt},
  "employment_years": ${data.employmentYears},
  "employment_type": "${data.employmentType}",
  "kyc_verified": ${data.kycVerified},
  "loan_purpose": "${data.loanPurpose}",
  "loan_tenure": ${data.loanTenure},
  "debt_to_income_ratio": ${debtToIncomeRatio.toFixed(2)},
  "collateral_value": ${data.collateralValue}
}

Provide response in this exact JSON format:
{
  "loan_eligibility_score": <number 0-100>,
  "approval_status": "<Approved|Rejected|Needs Review>",
  "remarks": "<detailed explanation>",
  "risk_factors": ["<factor1>", "<factor2>"],
  "recommendations": ["<recommendation1>", "<recommendation2>"]
}

Consider all RBI norms and provide a fair assessment.`;
  }

  calculateEMI(data) {
    const principal = data.loanAmount;
    const rate = this.getInterestRate(data.loanPurpose, data.cibilScore) / 12 / 100;
    const tenure = data.loanTenure;
    
    if (rate === 0) return principal / tenure;
    
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  }

  getInterestRate(loanPurpose, cibilScore) {
    const baseRates = {
      home: 8.5,
      personal: 12.0,
      vehicle: 9.5,
      education: 10.0,
      business: 11.5
    };
    
    let rate = baseRates[loanPurpose] || 12.0;
    
    // Adjust based on CIBIL score
    if (cibilScore >= 800) rate -= 0.5;
    else if (cibilScore >= 750) rate -= 0.25;
    else if (cibilScore < 700) rate += 1.0;
    
    return rate;
  }

  parseAIResponse(response) {
    try {
      // Extract JSON from response if it contains additional text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      const evaluation = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!evaluation.loan_eligibility_score || !evaluation.approval_status || !evaluation.remarks) {
        throw new Error('Invalid AI response format');
      }
      
      // Ensure score is within valid range
      evaluation.loan_eligibility_score = Math.max(0, Math.min(100, evaluation.loan_eligibility_score));
      
      return evaluation;
    } catch (error) {
      logger.error('Failed to parse AI response', { error: error.message, response });
      
      // Fallback evaluation
      return {
        loan_eligibility_score: 50,
        approval_status: 'Needs Review',
        remarks: 'AI evaluation failed, manual review required',
        risk_factors: ['AI processing error'],
        recommendations: ['Manual verification required']
      };
    }
  }

  async validateRBICriteria(applicationData) {
    const issues = [];
    
    if (applicationData.cibilScore < 700) {
      issues.push('CIBIL score below minimum requirement (700)');
    }
    
    if (applicationData.monthlyIncome < 25000) {
      issues.push('Monthly income below minimum requirement (₹25,000)');
    }
    
    if (applicationData.employmentYears < 1) {
      issues.push('Employment stability less than 1 year');
    }
    
    if (!applicationData.kycVerified) {
      issues.push('KYC documents not verified');
    }
    
    const debtToIncomeRatio = ((applicationData.existingDebt + this.calculateEMI(applicationData)) / applicationData.monthlyIncome) * 100;
    if (debtToIncomeRatio > 40) {
      issues.push(`Debt-to-income ratio (${debtToIncomeRatio.toFixed(1)}%) exceeds 40%`);
    }
    
    return {
      isCompliant: issues.length === 0,
      issues,
      debtToIncomeRatio: debtToIncomeRatio.toFixed(2)
    };
  }
}

module.exports = new AIEvaluationService();