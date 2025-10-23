const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class AIAgents {
  constructor(database) {
    this.db = database;
    this.learningThreshold = 700; // Dynamic threshold
  }

  async masterAgent(customerId, loanAmount, loanType) {
    try {
      const customer = await this.db.getCustomer(customerId);
      if (!customer) {
        return { error: 'Customer not found', page_transition: 'stay_chat' };
      }

      const loanId = await this.db.createLoanRequest(customerId, loanAmount, loanType);
      
      // Start orchestration
      const verificationResult = await this.verificationAgent(customer, loanId);
      if (!verificationResult.success) {
        return {
          status: 'rejected',
          reason: verificationResult.reason,
          page_transition: 'go_to_rejection_page',
          loanId
        };
      }

      const salesResult = await this.salesAgent(customer, loanAmount, loanId);
      const underwritingResult = await this.underwritingAgent(customer, loanAmount, loanId);

      if (underwritingResult.status === 'approved') {
        const sanctionResult = await this.sanctionLetterAgent(customer, loanAmount, loanId);
        return {
          ...underwritingResult,
          sanction_letter_url: sanctionResult.url,
          page_transition: 'go_to_sanction_letter',
          loanId
        };
      } else if (underwritingResult.status === 'needs_salary_slip') {
        return {
          message: 'Please upload your latest salary slip for verification.',
          page_transition: 'go_to_upload_page',
          loanId
        };
      } else {
        const rejectionResult = await this.rejectionAgent(customer, loanAmount, loanId, underwritingResult.reason);
        return {
          status: 'rejected',
          reason: underwritingResult.reason,
          rejection_report_url: rejectionResult.url,
          page_transition: 'go_to_rejection_page',
          loanId
        };
      }
    } catch (error) {
      return { error: error.message, page_transition: 'stay_chat' };
    }
  }

  async verificationAgent(customer, loanId) {
    const result = {
      success: customer.email && customer.phone && customer.name,
      reason: customer.email && customer.phone && customer.name ? null : 'Incomplete KYC details'
    };

    await this.db.logAgentAction(loanId, 'Verification Agent', 'KYC Check', result);
    return result;
  }

  async salesAgent(customer, loanAmount, loanId) {
    const negotiationResult = {
      recommended_amount: Math.min(loanAmount, customer.preapproved_limit),
      message: loanAmount <= customer.preapproved_limit 
        ? `We can proceed with your ₹${loanAmount.toLocaleString()} loan request.`
        : `We recommend ₹${customer.preapproved_limit.toLocaleString()} based on your profile.`
    };

    await this.db.logAgentAction(loanId, 'Sales Agent', 'Loan Negotiation', negotiationResult);
    return negotiationResult;
  }

  async underwritingAgent(customer, loanAmount, loanId) {
    const creditScore = customer.credit_score;
    const preapprovedLimit = customer.preapproved_limit;
    
    let eligibilityScore = 0;
    let status = 'rejected';
    let reason = '';

    // Calculate eligibility score
    if (creditScore >= 750) eligibilityScore += 40;
    else if (creditScore >= 700) eligibilityScore += 30;
    else if (creditScore >= 650) eligibilityScore += 20;
    else eligibilityScore += 10;

    const incomeRatio = loanAmount / (customer.salary * 12);
    if (incomeRatio <= 3) eligibilityScore += 30;
    else if (incomeRatio <= 5) eligibilityScore += 20;
    else eligibilityScore += 10;

    if (customer.salary >= 50000) eligibilityScore += 20;
    else if (customer.salary >= 30000) eligibilityScore += 15;
    else eligibilityScore += 10;

    eligibilityScore = Math.min(100, eligibilityScore);

    // Decision logic
    if (creditScore >= this.learningThreshold && loanAmount <= preapprovedLimit) {
      status = 'approved';
    } else if (creditScore >= this.learningThreshold && loanAmount <= 2 * preapprovedLimit) {
      status = 'needs_salary_slip';
      reason = 'Salary slip required for higher loan amount';
    } else {
      status = 'rejected';
      reason = creditScore < this.learningThreshold 
        ? `Credit score ${creditScore} below threshold ${this.learningThreshold}`
        : 'Requested amount exceeds eligibility limit';
    }

    const result = { eligibilityScore, status, reason };
    
    await this.db.updateLoanRequest(loanId, {
      eligibility_score: eligibilityScore,
      status: status,
      agent_decision: JSON.stringify(result)
    });

    await this.db.logAgentAction(loanId, 'Underwriting Agent', 'Credit Assessment', result);
    
    // Update learning threshold
    await this.updateLearningThreshold();
    
    return result;
  }

  async uploadAgent(loanId, filePath) {
    try {
      await this.db.updateLoanRequest(loanId, { salary_slip_url: filePath });
      
      const loan = await this.db.getLoanRequest(loanId);
      const customer = {
        salary: loan.salary,
        credit_score: loan.credit_score,
        preapproved_limit: loan.preapproved_limit
      };

      // Re-run underwriting with salary slip
      const underwritingResult = await this.underwritingAgent(customer, loan.requested_amount, loanId);
      
      if (underwritingResult.status === 'approved') {
        const sanctionResult = await this.sanctionLetterAgent(loan, loan.requested_amount, loanId);
        return {
          status: 'approved',
          sanction_letter_url: sanctionResult.url,
          page_transition: 'go_to_sanction_letter'
        };
      } else {
        const rejectionResult = await this.rejectionAgent(loan, loan.requested_amount, loanId, underwritingResult.reason);
        return {
          status: 'rejected',
          reason: underwritingResult.reason,
          rejection_report_url: rejectionResult.url,
          page_transition: 'go_to_rejection_page'
        };
      }
    } catch (error) {
      return { error: error.message, page_transition: 'stay_chat' };
    }
  }

  async sanctionLetterAgent(customer, loanAmount, loanId) {
    const filename = `sanction_${loanId}.pdf`;
    const filepath = path.join('uploads', filename);
    
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filepath));
    
    // Header
    doc.fontSize(20).text('LOANIFY NBFC LIMITED', 50, 50);
    doc.fontSize(16).text('LOAN SANCTION LETTER', 50, 80);
    doc.text('Generated by AI Decision Engine', 50, 100, { opacity: 0.5 });
    
    // Content
    doc.fontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 140);
    doc.text(`Reference ID: ${loanId}`, 50, 160);
    doc.text(`Dear ${customer.name || 'Valued Customer'},`, 50, 200);
    doc.text(`We are pleased to inform you that your loan application has been approved.`, 50, 230);
    doc.text(`Sanctioned Amount: ₹${loanAmount.toLocaleString()}`, 50, 260);
    doc.text(`Interest Rate: 10.5% per annum`, 50, 280);
    doc.text(`Processing Fee: ₹${Math.floor(loanAmount * 0.01).toLocaleString()}`, 50, 300);
    
    doc.text('Terms and Conditions:', 50, 340);
    doc.text('1. This sanction is valid for 30 days from the date of issue.', 50, 360);
    doc.text('2. Final disbursement subject to documentation verification.', 50, 380);
    doc.text('3. EMI will be auto-debited from your registered account.', 50, 400);
    
    doc.text('Authorized Signatory', 50, 500);
    doc.text('Loanify NBFC Limited', 50, 520);
    
    doc.end();
    
    await this.db.updateLoanRequest(loanId, { 
      sanction_letter_url: filepath,
      status: 'approved'
    });
    
    await this.db.logAgentAction(loanId, 'Sanction Letter Agent', 'PDF Generation', { filepath });
    
    return { url: filepath };
  }

  async rejectionAgent(customer, loanAmount, loanId, reason) {
    const filename = `rejection_${loanId}.pdf`;
    const filepath = path.join('uploads', filename);
    
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filepath));
    
    // Header
    doc.fontSize(20).text('LOANIFY NBFC LIMITED', 50, 50);
    doc.fontSize(16).text('LOAN APPLICATION STATUS', 50, 80);
    doc.text('Generated by AI Decision Engine', 50, 100, { opacity: 0.5 });
    
    // Content
    doc.fontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 140);
    doc.text(`Reference ID: ${loanId}`, 50, 160);
    doc.text(`Dear ${customer.name || 'Valued Customer'},`, 50, 200);
    doc.text(`We regret to inform you that your loan application could not be approved at this time.`, 50, 230);
    doc.text(`Reason: ${reason}`, 50, 260);
    
    doc.text('Recommendations for future applications:', 50, 300);
    doc.text('1. Improve your credit score by timely bill payments.', 50, 320);
    doc.text('2. Consider applying for a lower loan amount.', 50, 340);
    doc.text('3. Increase your monthly income documentation.', 50, 360);
    
    doc.text('You may reapply after 3 months.', 50, 400);
    doc.text('For queries, contact: support@loanify.com', 50, 420);
    
    doc.text('Loanify NBFC Limited', 50, 500);
    
    doc.end();
    
    await this.db.updateLoanRequest(loanId, { 
      rejection_reason: reason,
      status: 'rejected'
    });
    
    await this.db.logAgentAction(loanId, 'Rejection Agent', 'PDF Generation', { filepath, reason });
    
    return { url: filepath };
  }

  async updateLearningThreshold() {
    // Simple learning mechanism - adjust threshold based on recent approvals
    const applications = await this.db.getAllApplications();
    const recentApprovals = applications
      .filter(app => app.status === 'approved')
      .slice(0, 20);
    
    if (recentApprovals.length >= 10) {
      const avgCreditScore = recentApprovals.reduce((sum, app) => sum + app.credit_score, 0) / recentApprovals.length;
      this.learningThreshold = Math.max(650, Math.floor(avgCreditScore - 10));
    }
  }
}

module.exports = AIAgents;