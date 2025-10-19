'use server';

import { z } from 'zod';
import { checkCustomerEligibility } from '@/ai/flows/check-customer-eligibility';
import { generateLoanEvaluationReport } from '@/ai/flows/generate-loan-evaluation-report';
import type { Applicant } from '@/lib/types';

const checkEligibilitySchema = z.object({
  creditScore: z.coerce.number().min(300).max(850),
  annualIncome: z.coerce.number().min(10000, "Annual income must be at least 10,000"),
  monthlyEmi: z.coerce.number().min(0, "Monthly EMI cannot be negative"),
  loanAmount: z.coerce.number().min(1000),
  loanTenure: z.coerce.number().min(6),
});

type EligibilityResult = {
  success: boolean;
  data?: {
    eligibilityPercentage: number;
    reasons: string[];
  };
  error?: string;
};

export async function handleCheckEligibility(
  _prevState: EligibilityResult | null,
  formData: FormData
): Promise<EligibilityResult | null> {
  const validatedFields = checkEligibilitySchema.safeParse({
    creditScore: formData.get('creditScore'),
    annualIncome: formData.get('annualIncome'),
    monthlyEmi: formData.get('monthlyEmi'),
    loanAmount: formData.get('loanAmount'),
    loanTenure: formData.get('loanTenure'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid input. Please check the values you entered.',
    };
  }

  try {
    const result = await checkCustomerEligibility(validatedFields.data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'An unexpected error occurred while checking eligibility.',
    };
  }
}

const generateReportSchema = z.object({
  applicantId: z.string(),
});

type ReportResult = {
  success: boolean;
  data?: {
    report: string;
  };
  error?: string;
};

export async function handleGenerateReport(applicant: Applicant): Promise<ReportResult> {
  
  const applicantDetails = `
    Name: ${applicant.name}
    Email: ${applicant.email}
    Branch: ${applicant.branch}
    Loan Type: ${applicant.loanType}
    Loan Amount: $${applicant.loanAmount.toLocaleString()}
    Loan Tenure: ${applicant.loanTenure} months
    Application Date: ${applicant.applicationDate}
  `;

  const criteriaBreakdown = `
    Credit Score: ${applicant.creditScore}
    Income-to-EMI Ratio: ${applicant.incomeToEmiRatio}
  `;
  
  const input = {
    applicantDetails,
    eligibilityScore: applicant.eligibilityScore,
    decision: applicant.status,
    rejectionReasons: applicant.status === 'Rejected' ? 'Eligibility score below threshold, high income-to-EMI ratio.' : 'N/A',
    criteriaBreakdown,
  };

  try {
    const result = await generateLoanEvaluationReport(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'An unexpected error occurred while generating the report.',
    };
  }
}
