import jsPDF from 'jspdf';

interface ApplicantData {
  id?: string;
  referenceId?: string;
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  location?: string;
  loanType?: string;
  amount?: number;
  loanAmount?: number;
  creditScore?: number;
  score?: number;
  eligibilityScore?: number;
  eligibilityPercentage?: number;
  status: string;
  applicationDate?: string;
  appliedDate?: string;
  monthlyIncome?: number;
  income?: number;
  employment?: string;
  employmentType?: string;
  experience?: string;
  age?: string;
  requestedAmount?: string;
  tenure?: string;
  interestRate?: number;
  emi?: number;
  recommendedAmount?: number;
  aiReport?: string;
  riskCategory?: string;
  branch?: string;
  officer?: string;
  priority?: string;
  processingTime?: number;
  documents?: string[];
  evaluation?: {
    loan_eligibility_score: number;
    approval_status: string;
    remarks: string;
    risk_factors?: string[];
    recommendations?: string[];
    interestRate?: number;
    tenure?: number;
    emi?: number;
    processingFee?: number;
    totalAmount?: number;
    disbursementDate?: string;
    maturityDate?: string;
  };
}

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 15;
  private currentPage: number = 1;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  generateLoanReport(applicant: ApplicantData, t?: (key: string) => string): void {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.currentPage = 1;
    
    // Page 1: Cover & Summary
    this.addCoverPage(applicant);
    
    // Page 2: Detailed Analysis
    this.doc.addPage();
    this.currentPage = 2;
    let yPos = this.addPageHeader();
    yPos = this.addApplicantProfile(applicant, yPos);
    yPos = this.checkPageBreak(yPos, 40);
    yPos = this.addCreditAssessment(applicant, yPos);
    yPos = this.checkPageBreak(yPos, 50);
    yPos = this.addRiskAnalysis(applicant, yPos);
    
    // Page 3: Loan Terms & Decision
    this.doc.addPage();
    this.currentPage = 3;
    yPos = this.addPageHeader();
    yPos = this.addDecisionDetails(applicant, yPos);
    yPos = this.checkPageBreak(yPos, 60);
    yPos = this.addLoanTerms(applicant, yPos);
    yPos = this.checkPageBreak(yPos, 40);
    yPos = this.addRepaymentSchedule(applicant, yPos);
    
    // Page 4: Compliance & Footer
    if (yPos > this.pageHeight - 80) {
      this.doc.addPage();
      this.currentPage++;
      yPos = this.addPageHeader();
    }
    yPos = this.addRegulatoryCompliance(applicant, yPos);
    
    this.addPageNumbers();
    const refId = applicant.referenceId || applicant.id || 'UNKNOWN';
    this.doc.save(`LOANIFY_Professional_Report_${refId}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private checkPageBreak(currentY: number, requiredSpace: number): number {
    if (currentY + requiredSpace > this.pageHeight - 25) {
      this.doc.addPage();
      this.currentPage++;
      return this.addPageHeader();
    }
    return currentY;
  }

  private addCoverPage(applicant: ApplicantData): void {
    // Header with gradient effect
    this.doc.setFillColor(13, 71, 161);
    this.doc.rect(0, 0, this.pageWidth, 60, 'F');
    
    // Company logo area - Professional logo placement
    this.doc.setFillColor(255, 255, 255);
    this.doc.roundedRect(15, 18, 24, 24, 3, 3, 'F');
    
    // Logo design
    this.doc.setTextColor(13, 71, 161);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('L', 24, 32);
    
    // Logo accent
    this.doc.setDrawColor(34, 197, 94);
    this.doc.setLineWidth(2);
    this.doc.circle(27, 30, 8, 'S');
    
    // Company name and title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(28);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('LOANIFY NBFC LIMITED', 45, 25);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('RBI Licensed Non-Banking Financial Company', 45, 35);
    this.doc.text('CIN: U65923MH2020PTC123456 | NBFC License: N-14.03268', 45, 42);
    
    // Report title section
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CREDIT EVALUATION REPORT', this.pageWidth / 2, 90, { align: 'center' });
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Comprehensive Loan Assessment & Risk Analysis', this.pageWidth / 2, 105, { align: 'center' });
    
    // Applicant summary box
    this.doc.setDrawColor(13, 71, 161);
    this.doc.setLineWidth(1);
    this.doc.rect(30, 130, this.pageWidth - 60, 80);
    
    this.doc.setFillColor(248, 250, 252);
    this.doc.rect(30, 130, this.pageWidth - 60, 25, 'F');
    
    this.doc.setTextColor(13, 71, 161);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('APPLICANT SUMMARY', 35, 145);
    
    // Applicant details
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Reference ID:', 35, 165);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(applicant.referenceId || applicant.id || 'N/A', 70, 165);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Applicant Name:', 35, 175);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(applicant.name, 75, 175);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Loan Amount:', 35, 185);
    this.doc.setFont('helvetica', 'normal');
    const loanAmt = applicant.amount || applicant.loanAmount || applicant.recommendedAmount || parseInt(applicant.requestedAmount || '0') || 0;
    this.doc.text(`₹${loanAmt.toLocaleString()}`, 70, 185);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Application Date:', 35, 195);
    this.doc.setFont('helvetica', 'normal');
    const appDate = applicant.appliedDate || applicant.applicationDate || new Date().toISOString();
    this.doc.text(new Date(appDate).toLocaleDateString('en-IN'), 80, 195);
    
    // Status badge
    const status = applicant.status.toUpperCase();
    const statusColor: [number, number, number] = status === 'APPROVED' ? [34, 197, 94] : status === 'PENDING' ? [251, 191, 36] : [239, 68, 68];
    this.doc.setFillColor(...statusColor);
    this.doc.roundedRect(120, 160, 50, 15, 3, 3, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(status, 145, 170, { align: 'center' });
    
    // Report metadata
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Report Generated: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, this.pageWidth / 2, 240, { align: 'center' });
    this.doc.text('This report is generated in compliance with RBI guidelines for NBFC operations', this.pageWidth / 2, 250, { align: 'center' });
    
    // Confidentiality notice
    this.doc.setFillColor(254, 242, 242);
    this.doc.rect(20, 260, this.pageWidth - 40, 20, 'F');
    this.doc.setTextColor(185, 28, 28);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CONFIDENTIAL DOCUMENT', this.pageWidth / 2, 268, { align: 'center' });
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('This document contains sensitive financial information and is intended solely for authorized personnel.', this.pageWidth / 2, 275, { align: 'center' });
  }

  private addPageHeader(): number {
    this.doc.setFillColor(13, 71, 161);
    this.doc.rect(0, 0, this.pageWidth, 25, 'F');
    
    // Mini logo in header
    this.doc.setFillColor(255, 255, 255);
    this.doc.roundedRect(8, 8, 12, 12, 2, 2, 'F');
    this.doc.setTextColor(13, 71, 161);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('L', 13, 16);
    
    // Header text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('LOANIFY NBFC', 25, 15);
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Credit Evaluation Report', this.pageWidth - this.margin - 40, 15);
    
    this.doc.setTextColor(0, 0, 0);
    return 35;
  }

  private addApplicantProfile(applicant: ApplicantData, yPos: number): number {
    // Section header with professional styling
    this.doc.setFillColor(239, 246, 255);
    this.doc.rect(this.margin, yPos - 3, this.pageWidth - 2 * this.margin, 15, 'F');
    this.doc.setDrawColor(13, 71, 161);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, yPos + 12, this.pageWidth - this.margin, yPos + 12);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(13, 71, 161);
    this.doc.text('1. APPLICANT PROFILE & VERIFICATION', this.margin + 3, yPos + 7);
    
    yPos += 20;
    this.doc.setTextColor(0, 0, 0);
    
    // Professional table layout
    const tableData = [
      ['Personal Information', ''],
      ['Full Name', applicant.name],
      ['Reference ID', applicant.referenceId || applicant.id || 'N/A'],
      ['Email Address', applicant.email || 'Not Provided'],
      ['Phone Number', applicant.phone || applicant.mobile || 'Not Provided'],
      ['Age', applicant.age ? `${applicant.age} years` : 'Not Provided'],
      ['Residential Address', applicant.location || 'Not Provided'],
      ['', ''],
      ['Employment Details', ''],
      ['Employment Type', applicant.employment || applicant.employmentType || 'Not Specified'],
      ['Work Experience', applicant.experience || 'Not Specified'],
      ['Monthly Income', (applicant.monthlyIncome || applicant.income) ? `₹${(applicant.monthlyIncome || applicant.income || 0).toLocaleString()}` : 'Not Disclosed'],
      ['', ''],
      ['Application Details', ''],
      ['Application Date', new Date(applicant.appliedDate || applicant.applicationDate || new Date()).toLocaleDateString('en-IN')],
      ['Loan Product', applicant.loanType || 'Personal Loan'],
      ['Requested Amount', `₹${(applicant.amount || applicant.loanAmount || applicant.recommendedAmount || parseInt(applicant.requestedAmount || '0') || 0).toLocaleString()}`],
      ['Loan Tenure', applicant.tenure ? `${applicant.tenure} months` : 'Not Specified'],
      ['Current Status', applicant.status.toUpperCase()]
    ];
    
    this.doc.setFontSize(9);
    
    tableData.forEach((row, index) => {
      if (row[0] === '' && row[1] === '') {
        yPos += 3;
        return;
      }
      
      if (row[1] === '') {
        // Section header
        this.doc.setFillColor(248, 250, 252);
        this.doc.rect(this.margin, yPos - 2, this.pageWidth - 2 * this.margin, 8, 'F');
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(75, 85, 99);
        this.doc.text(row[0], this.margin + 2, yPos + 3);
      } else {
        // Data row
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(55, 65, 81);
        this.doc.text(row[0], this.margin + 5, yPos + 3);
        
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(0, 0, 0);
        this.doc.text(row[1], this.margin + 60, yPos + 3);
        
        // Subtle line separator
        this.doc.setDrawColor(229, 231, 235);
        this.doc.setLineWidth(0.1);
        this.doc.line(this.margin, yPos + 5, this.pageWidth - this.margin, yPos + 5);
      }
      
      yPos += 6;
    });
    
    return yPos + 10;
  }

  private addCreditAssessment(applicant: ApplicantData, yPos: number): number {
    // Section header
    this.doc.setFillColor(240, 253, 244);
    this.doc.rect(this.margin, yPos - 3, this.pageWidth - 2 * this.margin, 15, 'F');
    this.doc.setDrawColor(34, 197, 94);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, yPos + 12, this.pageWidth - this.margin, yPos + 12);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(21, 128, 61);
    this.doc.text('2. CREDIT ASSESSMENT & SCORING', this.margin + 3, yPos + 7);
    
    yPos += 25;
    this.doc.setTextColor(0, 0, 0);
    
    const creditScore = applicant.score || applicant.creditScore || 650;
    const eligibilityScore = applicant.evaluation?.loan_eligibility_score || applicant.eligibilityScore || applicant.eligibilityPercentage || 0;
    
    // Credit score visualization
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Credit Bureau Score Analysis:', this.margin, yPos);
    
    yPos += 10;
    
    // Score gauge representation
    const scoreColor: [number, number, number] = creditScore >= 750 ? [34, 197, 94] : creditScore >= 650 ? [251, 191, 36] : [239, 68, 68];
    const scoreRating = creditScore >= 750 ? 'EXCELLENT' : creditScore >= 650 ? 'GOOD' : creditScore >= 550 ? 'FAIR' : 'POOR';
    
    this.doc.setDrawColor(...scoreColor);
    this.doc.setLineWidth(3);
    this.doc.rect(this.margin, yPos, 60, 20);
    
    this.doc.setTextColor(...scoreColor);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(creditScore.toString(), this.margin + 30, yPos + 12, { align: 'center' });
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(9);
    this.doc.text(`Rating: ${scoreRating}`, this.margin + 70, yPos + 8);
    this.doc.text(`Percentile: ${Math.min(95, Math.floor(creditScore / 9))}th`, this.margin + 70, yPos + 16);
    
    yPos += 30;
    
    // Detailed credit factors
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Credit Factors Analysis:', this.margin, yPos);
    
    yPos += 8;
    
    const creditFactors = [
      ['Payment History', creditScore >= 700 ? 'Excellent' : creditScore >= 600 ? 'Good' : 'Needs Improvement'],
      ['Credit Utilization', creditScore >= 700 ? 'Low (< 30%)' : 'Moderate'],
      ['Credit Age', 'Established'],
      ['Credit Mix', 'Diversified'],
      ['Recent Inquiries', 'Minimal']
    ];
    
    this.doc.setFontSize(9);
    creditFactors.forEach(([factor, status]) => {
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`• ${factor}:`, this.margin + 5, yPos);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(status, this.margin + 60, yPos);
      yPos += 6;
    });
    
    return yPos + 10;
  }

  private addRiskAnalysis(applicant: ApplicantData, yPos: number): number {
    // Ensure we have enough space
    yPos = this.checkPageBreak(yPos, 60);
    
    // Section header with proper spacing
    this.doc.setFillColor(254, 242, 242);
    this.doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, 10, 'F');
    this.doc.setDrawColor(185, 28, 28);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, yPos + 10, this.pageWidth - this.margin, yPos + 10);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(185, 28, 28);
    this.doc.text('3. RISK ASSESSMENT AND AI EVALUATION', this.margin + 2, yPos + 7);
    
    yPos += 18;
    this.doc.setTextColor(0, 0, 0);
    
    // AI Score with professional presentation
    const score = applicant.evaluation?.loan_eligibility_score || applicant.eligibilityScore || applicant.eligibilityPercentage || 0;
    const riskLevel = score >= 80 ? 'LOW RISK' : score >= 60 ? 'MODERATE RISK' : score >= 40 ? 'HIGH RISK' : 'VERY HIGH RISK';
    const scoreColor: [number, number, number] = score >= 80 ? [34, 197, 94] : score >= 60 ? [251, 191, 36] : score >= 40 ? [249, 115, 22] : [239, 68, 68];
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('AI-Powered Eligibility Assessment:', this.margin, yPos);
    
    yPos += 8;
    
    // Professional score display with proper boundaries
    this.doc.setDrawColor(...scoreColor);
    this.doc.setLineWidth(1);
    this.doc.rect(this.margin, yPos, 60, 18);
    
    this.doc.setTextColor(...scoreColor);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${score}%`, this.margin + 30, yPos + 11, { align: 'center' });
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(8);
    this.doc.text(`Risk Category: ${riskLevel}`, this.margin + 70, yPos + 6);
    this.doc.text(`Approval Probability: ${score}%`, this.margin + 70, yPos + 12);
    
    yPos += 25;
    
    // AI Remarks with proper text wrapping
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('AI Evaluation Summary:', this.margin, yPos);
    
    yPos += 6;
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    const maxWidth = this.pageWidth - 2 * this.margin;
    const remarks = this.doc.splitTextToSize(applicant.evaluation?.remarks || applicant.aiReport || 'AI assessment completed successfully', maxWidth);
    
    remarks.forEach((line: string) => {
      this.doc.text(line, this.margin, yPos);
      yPos += 4;
    });
    
    return yPos + 8;
  }

  private addDecisionDetails(applicant: ApplicantData, yPos: number): number {
    // Ensure we have enough space
    yPos = this.checkPageBreak(yPos, 80);
    
    // Section header with proper spacing
    this.doc.setFillColor(239, 246, 255);
    this.doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, 10, 'F');
    this.doc.setDrawColor(13, 71, 161);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, yPos + 10, this.pageWidth - this.margin, yPos + 10);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(13, 71, 161);
    this.doc.text('4. DECISION ANALYSIS AND RECOMMENDATIONS', this.margin + 2, yPos + 7);
    
    yPos += 18;
    this.doc.setTextColor(0, 0, 0);
    
    // Decision stamp
    const status = applicant.status.toLowerCase();
    const isApproved = status === 'approved';
    const isPending = status === 'pending';
    
    const stampColor: [number, number, number] = isApproved ? [34, 197, 94] : isPending ? [251, 191, 36] : [239, 68, 68];
    const stampText = isApproved ? 'APPROVED' : isPending ? 'PENDING' : 'REJECTED';
    
    this.doc.setDrawColor(...stampColor);
    this.doc.setLineWidth(2);
    this.doc.rect(this.margin, yPos, 80, 20);
    
    this.doc.setTextColor(...stampColor);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(stampText, this.margin + 40, yPos + 13, { align: 'center' });
    
    yPos += 30;
    this.doc.setTextColor(0, 0, 0);
    
    // Detailed decision reasoning
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    
    if (isApproved) {
      this.doc.text('APPROVAL REASONS:', this.margin, yPos);
      yPos += 8;
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      const creditScr = applicant.score || applicant.creditScore || 650;
      const monthlyInc = applicant.monthlyIncome || applicant.income || 0;
      const approvalReasons = [
        `• Credit score of ${creditScr} meets eligibility criteria`,
        `• Stable employment with verified income of ₹${monthlyInc.toLocaleString()}/month`,
        '• Debt-to-income ratio within acceptable limits (<40%)',
        '• No adverse credit history or defaults identified',
        '• All KYC and documentation requirements satisfied',
        '• AI risk assessment indicates acceptable default probability'
      ];
      approvalReasons.forEach(reason => {
        this.doc.text(reason, this.margin, yPos);
        yPos += 5;
      });
    } else {
      this.doc.text('REJECTION REASONS:', this.margin, yPos);
      yPos += 8;
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      const rejectionReasons = [
        `• Credit score of ${applicant.score || applicant.creditScore || 'N/A'} below minimum requirement (650)`,
        '• Debt-to-income ratio exceeds acceptable limit (>50%)',
        '• Insufficient income to support requested loan amount',
        '• Recent defaults or adverse credit history identified',
        '• Employment stability concerns (frequent job changes)',
        '• Incomplete or inconsistent documentation provided'
      ];
      rejectionReasons.forEach(reason => {
        this.doc.text(reason, this.margin, yPos);
        yPos += 5;
      });
    }
    
    return yPos + 10;
  }

  private addLoanTerms(applicant: ApplicantData, yPos: number): number {
    const isApproved = applicant.status.toLowerCase() === 'approved';
    
    if (!isApproved && !applicant.recommendedAmount && !applicant.interestRate) {
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('Loan terms will be finalized upon approval.', this.margin, yPos);
      return yPos + 12;
    }
    
    // Ensure we have enough space
    yPos = this.checkPageBreak(yPos, 50);
    
    // Section header with proper spacing
    this.doc.setFillColor(254, 249, 195);
    this.doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, 10, 'F');
    this.doc.setDrawColor(146, 64, 14);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, yPos + 10, this.pageWidth - this.margin, yPos + 10);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(146, 64, 14);
    this.doc.text('5. APPROVED LOAN TERMS AND CONDITIONS', this.margin + 2, yPos + 7);
    
    yPos += 18;
    this.doc.setTextColor(0, 0, 0);
    
    const loanAmount = applicant.amount || applicant.loanAmount || applicant.recommendedAmount || parseInt(applicant.requestedAmount || '0') || 0;
    const interestRate = applicant.evaluation?.interestRate || applicant.interestRate || 12.5;
    const tenure = applicant.evaluation?.tenure || parseInt(applicant.tenure || '36') || 36;
    const emi = applicant.evaluation?.emi || applicant.emi || this.calculateEMI(loanAmount, tenure, interestRate);
    const processingFee = applicant.evaluation?.processingFee || Math.floor(loanAmount * 0.02);
    const totalAmount = applicant.evaluation?.totalAmount || (emi * tenure);
    
    // Professional loan terms table with proper spacing
    this.doc.setDrawColor(146, 64, 14);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, 50);
    
    // Header
    this.doc.setFillColor(254, 249, 195);
    this.doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, 10, 'F');
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(146, 64, 14);
    this.doc.text(isApproved ? 'SANCTIONED LOAN DETAILS' : 'PROPOSED LOAN TERMS', this.margin + 3, yPos + 7);
    
    yPos += 15;
    this.doc.setTextColor(0, 0, 0);
    
    const loanTerms = [
      ['Principal Amount', `₹${loanAmount.toLocaleString()}`],
      ['Interest Rate', `${interestRate}% per annum (Fixed)`],
      ['Loan Tenure', `${tenure} months`],
      ['Monthly EMI', `₹${emi.toLocaleString()}`],
      ['Processing Fee', `₹${processingFee.toLocaleString()}`],
      ['Total Payable Amount', `₹${totalAmount.toLocaleString()}`]
    ];
    
    this.doc.setFontSize(8);
    loanTerms.forEach(([term, value]) => {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(term + ':', this.margin + 3, yPos);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(value, this.margin + 60, yPos);
      yPos += 6;
    });
    
    return yPos + 10;
  }

  private addRepaymentSchedule(applicant: ApplicantData, yPos: number): number {
    const emi = applicant.evaluation?.emi || applicant.emi;
    if (!emi && applicant.status.toLowerCase() !== 'approved') return yPos;
    
    // Ensure we have enough space
    yPos = this.checkPageBreak(yPos, 70);
    
    // Section header with proper spacing
    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, 10, 'F');
    this.doc.setDrawColor(75, 85, 99);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, yPos + 10, this.pageWidth - this.margin, yPos + 10);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(75, 85, 99);
    this.doc.text('6. REPAYMENT SCHEDULE', this.margin + 2, yPos + 7);
    
    yPos += 18;
    this.doc.setTextColor(0, 0, 0);
    
    if (applicant.status.toLowerCase() !== 'approved') {
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'italic');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('Repayment schedule will be generated upon loan approval.', this.margin, yPos);
      return yPos + 15;
    }
    
    // Professional table with proper spacing
    const tableWidth = this.pageWidth - 2 * this.margin;
    const colWidths = [12, 22, 28, 28, 28, 27];
    const headers = ['#', 'Due Date', 'EMI (₹)', 'Principal (₹)', 'Interest (₹)', 'Balance (₹)'];
    
    // Table header with proper alignment
    this.doc.setFillColor(75, 85, 99);
    this.doc.rect(this.margin, yPos, tableWidth, 8, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'bold');
    
    let xPos = this.margin;
    headers.forEach((header, index) => {
      this.doc.text(header, xPos + 1, yPos + 5);
      xPos += colWidths[index];
    });
    
    yPos += 10;
    
    // Calculate amortization schedule
    const loanAmount = applicant.amount || applicant.loanAmount || applicant.recommendedAmount || parseInt(applicant.requestedAmount || '0') || 0;
    const interestRate = applicant.evaluation?.interestRate || applicant.interestRate || 12.5;
    const monthlyRate = interestRate / 12 / 100;
    const monthlyEmi = emi || this.calculateEMI(loanAmount, parseInt(applicant.tenure || '36'), interestRate);
    let balance = loanAmount;
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(6);
    this.doc.setFont('helvetica', 'normal');
    
    // Show first 10 months to fit properly
    const tenureMonths = applicant.evaluation?.tenure || parseInt(applicant.tenure || '36') || 36;
    for (let month = 1; month <= Math.min(10, tenureMonths); month++) {
      const interestAmount = balance * monthlyRate;
      const principalAmount = monthlyEmi - interestAmount;
      balance = Math.max(0, balance - principalAmount);
      
      const emiDate = new Date();
      emiDate.setMonth(emiDate.getMonth() + month);
      
      // Alternate row coloring
      if (month % 2 === 0) {
        this.doc.setFillColor(248, 250, 252);
        this.doc.rect(this.margin, yPos - 1, tableWidth, 6, 'F');
      }
      
      xPos = this.margin;
      const rowData = [
        month.toString(),
        emiDate.toLocaleDateString('en-IN'),
        monthlyEmi.toLocaleString(),
        Math.round(principalAmount).toLocaleString(),
        Math.round(interestAmount).toLocaleString(),
        Math.round(balance).toLocaleString()
      ];
      
      rowData.forEach((data, index) => {
        this.doc.text(data, xPos + 1, yPos + 3);
        xPos += colWidths[index];
      });
      
      yPos += 6;
    }
    
    // Summary note with proper spacing
    yPos += 5;
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'italic');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Note: First 10 installments shown. Complete ${tenureMonths}-month schedule available upon disbursement.`, this.margin, yPos);
    
    return yPos + 10;
  }

  private addRegulatoryCompliance(applicant: ApplicantData, yPos: number): number {
    // Ensure we have enough space
    yPos = this.checkPageBreak(yPos, 60);
    
    // Section header with proper spacing
    this.doc.setFillColor(239, 246, 255);
    this.doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, 10, 'F');
    this.doc.setDrawColor(13, 71, 161);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, yPos + 10, this.pageWidth - this.margin, yPos + 10);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(13, 71, 161);
    this.doc.text('7. REGULATORY COMPLIANCE AND DISCLOSURES', this.margin + 2, yPos + 7);
    
    yPos += 18;
    this.doc.setTextColor(0, 0, 0);
    
    const complianceItems = [
      'Assessment conducted per RBI Master Directions on NBFC operations',
      'Credit evaluation follows RBI Fair Practices Code guidelines',
      'Interest rates determined as per RBI interest rate policy',
      'Customer data processed per RBI data localization requirements',
      'KYC/AML compliance as per RBI guidelines maintained',
      'AI systems audited for bias and fairness in decision making',
      'Grievance redressal available through Banking Ombudsman'
    ];
    
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'normal');
    
    complianceItems.forEach((item, index) => {
      this.doc.text(`${index + 1}. ${item}`, this.margin, yPos);
      yPos += 4;
    });
    
    yPos += 8;
    
    // Important notice box with proper spacing
    const noticeHeight = 20;
    this.doc.setFillColor(254, 242, 242);
    this.doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, noticeHeight, 'F');
    this.doc.setDrawColor(239, 68, 68);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, noticeHeight);
    
    this.doc.setTextColor(185, 28, 28);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CONFIDENTIALITY NOTICE', this.margin + 3, yPos + 6);
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(6);
    this.doc.setFont('helvetica', 'normal');
    const notice = 'This credit assessment report is confidential and intended solely for the applicant and authorized personnel. Loan approval is subject to final document verification and compliance with all terms. Interest rates subject to RBI guidelines.';
    const noticeLines = this.doc.splitTextToSize(notice, this.pageWidth - 2 * this.margin - 6);
    this.doc.text(noticeLines, this.margin + 3, yPos + 12);
    
    // Footer information
    yPos += noticeHeight + 8;
    this.doc.setFontSize(6);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Report ID: LF-${applicant.id}-${Date.now().toString().slice(-6)} | Generated: ${new Date().toLocaleDateString('en-IN')}`, this.margin, yPos);
    this.doc.text('Loanify NBFC Pvt Ltd | RBI License: N-14.03268 | CIN: U65923MH2020PTC123456', this.margin, yPos + 4);
    
    return yPos + 10;
  }

  private addPageNumbers(): void {
    const totalPages = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(7);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin - 15, this.pageHeight - 8);
    }
  }

  private calculateEMI(principal: number, tenure: number, rate: number): number {
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  }
}

export const downloadLoanReport = (applicant: ApplicantData, t?: (key: string) => string) => {
  const generator = new PDFGenerator();
  generator.generateLoanReport(applicant, t);
};

export const generateProfessionalReport = (applicant: ApplicantData) => {
  const generator = new PDFGenerator();
  generator.generateLoanReport(applicant);
};