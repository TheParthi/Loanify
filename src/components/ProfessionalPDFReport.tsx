'use client';

import { generateProfessionalReport } from '@/lib/pdf-generator';

interface ReportData {
  referenceId?: string;
  name: string;
  email?: string;
  mobile?: string;
  age?: string;
  employmentType?: string;
  income?: number;
  loanAmount?: number;
  creditScore?: number;
  status: string;
  eligibilityPercentage?: number;
  recommendedAmount?: number;
  interestRate?: number;
  emi?: number;
  aiReport?: string;
  applicationDate?: string;
  loanType?: string;
  tenure?: string;
  [key: string]: any;
}

interface ProfessionalPDFReportProps {
  data: ReportData;
  children: React.ReactNode;
  className?: string;
}

export default function ProfessionalPDFReport({ data, children, className }: ProfessionalPDFReportProps) {
  const handleDownload = async () => {
    try {
      // Try backend first if reference ID exists
      if (data.referenceId) {
        const response = await fetch(`http://localhost:8081/report/${data.referenceId}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Loanify_Report_${data.referenceId}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, generating professional PDF');
    }

    // Generate professional PDF using our enhanced generator
    const applicantData = {
      referenceId: data.referenceId || `LF${Date.now().toString().slice(-8)}`,
      name: data.name,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      mobile: data.mobile || 'Not Provided',
      age: data.age || '30',
      employmentType: data.employmentType || 'salaried',
      income: data.income || 50000,
      loanAmount: data.loanAmount || data.recommendedAmount || 500000,
      requestedAmount: (data.loanAmount || data.recommendedAmount || 500000).toString(),
      creditScore: data.creditScore || 650,
      status: data.status.toLowerCase(),
      eligibilityPercentage: data.eligibilityPercentage || 75,
      recommendedAmount: data.recommendedAmount || data.loanAmount || 500000,
      interestRate: data.interestRate || 12.5,
      emi: data.emi || Math.round(((data.loanAmount || 500000) * 12.5 / 12 / 100 * Math.pow(1 + 12.5 / 12 / 100, 36)) / (Math.pow(1 + 12.5 / 12 / 100, 36) - 1)),
      aiReport: data.aiReport || `Professional loan assessment completed for ${data.name}. Credit evaluation shows ${data.status} status based on comprehensive analysis.`,
      applicationDate: data.applicationDate || new Date().toISOString(),
      loanType: data.loanType || 'Personal Loan',
      tenure: data.tenure || '36',
      riskCategory: data.creditScore >= 750 ? 'Low Risk' : data.creditScore >= 650 ? 'Medium Risk' : 'High Risk',
      branch: data.branch || 'Mumbai Central',
      officer: data.officer || 'Loan Officer',
      priority: data.priority || 'Normal',
      processingTime: data.processingTime || 24,
      documents: data.documents || ['Aadhaar', 'PAN', 'Salary Slip']
    };

    generateProfessionalReport(applicantData);
  };

  return (
    <div className={className} onClick={handleDownload}>
      {children}
    </div>
  );
}

// Utility function for easy PDF generation
export const downloadProfessionalReport = (data: ReportData) => {
  const applicantData = {
    referenceId: data.referenceId || `LF${Date.now().toString().slice(-8)}`,
    name: data.name,
    email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    mobile: data.mobile || 'Not Provided',
    age: data.age || '30',
    employmentType: data.employmentType || 'salaried',
    income: data.income || 50000,
    loanAmount: data.loanAmount || data.recommendedAmount || 500000,
    requestedAmount: (data.loanAmount || data.recommendedAmount || 500000).toString(),
    creditScore: data.creditScore || 650,
    status: data.status.toLowerCase(),
    eligibilityPercentage: data.eligibilityPercentage || 75,
    recommendedAmount: data.recommendedAmount || data.loanAmount || 500000,
    interestRate: data.interestRate || 12.5,
    emi: data.emi || Math.round(((data.loanAmount || 500000) * 12.5 / 12 / 100 * Math.pow(1 + 12.5 / 12 / 100, 36)) / (Math.pow(1 + 12.5 / 12 / 100, 36) - 1)),
    aiReport: data.aiReport || `Professional loan assessment completed for ${data.name}. Credit evaluation shows ${data.status} status based on comprehensive analysis.`,
    applicationDate: data.applicationDate || new Date().toISOString(),
    loanType: data.loanType || 'Personal Loan',
    tenure: data.tenure || '36',
    riskCategory: data.creditScore >= 750 ? 'Low Risk' : data.creditScore >= 650 ? 'Medium Risk' : 'High Risk',
    branch: data.branch || 'Mumbai Central',
    officer: data.officer || 'Loan Officer',
    priority: data.priority || 'Normal',
    processingTime: data.processingTime || 24,
    documents: data.documents || ['Aadhaar', 'PAN', 'Salary Slip']
  };

  generateProfessionalReport(applicantData);
};