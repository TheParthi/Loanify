interface LoanApplication {
  name: string;
  income: number;
  existingLoans: number;
  city: string;
  purpose: string;
  amount: number;
  creditScore?: number;
}

interface AgentResponse {
  message: string;
  nextAgent?: string;
  action?: string;
  data?: any;
}

export class MasterAgent {
  async processConversation(message: string, context: any): Promise<AgentResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Direct loan application requests
    if ((lowerMessage.includes('apply') || lowerMessage.includes('need') || lowerMessage.includes('want')) && lowerMessage.includes('loan')) {
      return {
        message: "Great! Let's get your loan application started right away! 🚀\n\nI need just 3 quick details:\n\n💰 **Loan Amount**: How much do you need?\n📊 **Monthly Income**: What's your monthly salary?\n🏠 **Loan Type**: Personal/Home/Business/Vehicle?\n\nOnce you share these, I'll instantly check your eligibility and guide you to apply!",
        data: { stage: 'collecting_info' }
      };
    }
    
    // Eligibility queries
    if (lowerMessage.includes('eligibility') || lowerMessage.includes('qualify') || lowerMessage.includes('eligible')) {
      return {
        message: "Let me check your eligibility instantly! 🔍\n\n**Just tell me:**\n💵 Monthly income?\n💼 Job type? (Salaried/Business)\n💳 Any existing EMIs?\n🎯 Desired loan amount?\n\n**You'll get:**\n✅ Instant eligibility result\n✅ Maximum loan amount\n✅ Best interest rate\n✅ EMI calculator",
        data: { stage: 'eligibility_check' }
      };
    }
    
    // Interest rate queries
    if (lowerMessage.includes('interest') || lowerMessage.includes('rate') || lowerMessage.includes('emi')) {
      return {
        message: "🔥 **Best Interest Rates Starting From:**\n\n🏠 **Home Loans**: 8.5% onwards\n👤 **Personal Loans**: 10.5% onwards\n🚗 **Vehicle Loans**: 9.5% onwards\n🏢 **Business Loans**: 12% onwards\n\n**Special Offers:**\n🎉 0% processing fee this month\n🎉 Instant approval in 2 minutes\n\nWant to know your exact rate? Share your income details!",
        data: { stage: 'rate_inquiry' }
      };
    }
    
    // Document queries
    if (lowerMessage.includes('document') || lowerMessage.includes('papers') || lowerMessage.includes('upload')) {
      return {
        message: "📄 **Document Upload Made Easy!**\n\n**Required Documents:**\n🆔 Aadhar + PAN Card\n💰 Last 2 salary slips\n🏦 3 months bank statement\n📋 Employment certificate\n\n**Upload Steps:**\n1️⃣ Click 'Upload Documents'\n2️⃣ Take clear photos\n3️⃣ Upload instantly\n4️⃣ Get verified in 2 hours!\n\n🚀 **Ready to upload?** I can guide you step by step!",
        data: { stage: 'document_help' }
      };
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        message: "Hello! 👋 Welcome to Loanify!\n\n**I can help you with:**\n🚀 **Instant loan application**\n💰 **Check eligibility in 2 minutes**\n📊 **Calculate EMI**\n📞 **Connect with loan expert**\n\nWhat would you like to do today?",
        data: { stage: 'greeting' }
      };
    }
    
    // Default helpful response
    return {
      message: "Hi! I'm here to help you get the perfect loan! 😊\n\n**Popular options:**\n🚀 Apply for loan now\n💰 Check my eligibility\n📊 Calculate EMI\n💬 Speak to expert\n\nWhat interests you most?",
      data: { stage: 'default' }
    };
  }
}

export class SalesAgent {
  async processLoanInquiry(application: LoanApplication): Promise<AgentResponse> {
    const loanProducts = this.recommendLoanProducts(application);
    
    return {
      message: `Based on your requirements, I recommend these loan options:\n\n${loanProducts}\n\nWould you like to proceed with any of these options?`,
      nextAgent: 'verification',
      data: { stage: 'sales_complete' }
    };
  }

  private recommendLoanProducts(app: LoanApplication): string {
    let recommendations = '';
    
    if (app.purpose.toLowerCase().includes('home')) {
      recommendations += '🏠 Home Loan: 7.5% - 9.5% p.a., up to ₹5 Cr\n';
    }
    if (app.purpose.toLowerCase().includes('personal')) {
      recommendations += '👤 Personal Loan: 8.99% - 24% p.a., up to ₹40 Lakh\n';
    }
    if (app.purpose.toLowerCase().includes('vehicle') || app.purpose.toLowerCase().includes('car')) {
      recommendations += '🚗 Vehicle Loan: 9.5% - 15% p.a., up to ₹1 Cr\n';
    }
    
    return recommendations || '💼 Personal Loan: 8.99% - 24% p.a., up to ₹40 Lakh\n';
  }
}

export class VerificationAgent {
  async verifyKYC(application: LoanApplication): Promise<AgentResponse> {
    const isVerified = Math.random() > 0.2;
    
    if (isVerified) {
      return {
        message: "Great! Your KYC verification is complete. Now let me check your loan eligibility with our underwriting team.",
        nextAgent: 'underwriting',
        data: { kycVerified: true }
      };
    } else {
      return {
        message: "I need some additional documents for KYC verification. Please provide:\n\n• PAN Card\n• Aadhaar Card\n• Latest Salary Slip\n\nOnce verified, we can proceed with your application.",
        data: { kycVerified: false }
      };
    }
  }
}

export class UnderwritingAgent {
  async evaluateEligibility(application: LoanApplication): Promise<AgentResponse> {
    const creditScore = application.creditScore || this.generateMockCreditScore();
    const emiRatio = this.calculateEMIRatio(application);
    
    const decision = this.makeDecision(creditScore, emiRatio, application);
    
    return {
      message: decision.message,
      nextAgent: decision.approved ? 'sanction' : null,
      data: { 
        decision: decision.approved ? 'approved' : 'rejected',
        creditScore,
        emiRatio,
        reason: decision.reason
      }
    };
  }

  private generateMockCreditScore(): number {
    return Math.floor(Math.random() * 300) + 600;
  }

  private calculateEMIRatio(app: LoanApplication): number {
    const estimatedEMI = app.amount / 60;
    return ((app.existingLoans + estimatedEMI) / app.income) * 100;
  }

  private makeDecision(creditScore: number, emiRatio: number, app: LoanApplication) {
    if (creditScore < 700) {
      return {
        approved: false,
        message: `I'm sorry, but your application cannot be approved at this time. Your credit score (${creditScore}) is below our minimum requirement of 700.`,
        reason: 'Low credit score'
      };
    }

    if (emiRatio > 65) {
      return {
        approved: false,
        message: `Unfortunately, your EMI-to-income ratio (${emiRatio.toFixed(1)}%) exceeds our maximum limit of 65%. This indicates high financial stress.`,
        reason: 'High EMI ratio'
      };
    }

    if (emiRatio > 50) {
      return {
        approved: true,
        message: `Congratulations! Your loan is approved with conditions. Your EMI-to-income ratio is ${emiRatio.toFixed(1)}%, which requires additional income verification.`,
        reason: 'Conditional approval'
      };
    }

    return {
      approved: true,
      message: `Excellent news! Your loan application is approved! With a credit score of ${creditScore} and EMI ratio of ${emiRatio.toFixed(1)}%, you qualify for our best rates.`,
      reason: 'Full approval'
    };
  }
}

export class SanctionAgent {
  async generateSanctionLetter(application: LoanApplication, decision: any): Promise<AgentResponse> {
    const sanctionDetails = {
      applicantName: application.name,
      loanAmount: application.amount,
      interestRate: this.calculateInterestRate(decision.creditScore),
      tenure: 60,
      emi: Math.round(application.amount / 60),
      sanctionDate: new Date().toLocaleDateString(),
    };

    return {
      message: `🎉 Congratulations ${application.name}!\n\nYour loan has been sanctioned with the following details:\n\n💰 Loan Amount: ₹${application.amount.toLocaleString()}\n📊 Interest Rate: ${sanctionDetails.interestRate}% p.a.\n⏰ Tenure: ${sanctionDetails.tenure} months\n💳 Monthly EMI: ₹${sanctionDetails.emi.toLocaleString()}\n\nYour sanction letter is being prepared. You'll receive it shortly via email.`,
      action: 'generate_pdf',
      data: sanctionDetails
    };
  }

  private calculateInterestRate(creditScore: number): number {
    if (creditScore >= 800) return 8.99;
    if (creditScore >= 750) return 10.5;
    if (creditScore >= 700) return 12.0;
    return 15.0;
  }
}