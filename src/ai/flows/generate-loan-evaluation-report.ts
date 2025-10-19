'use server';

/**
 * @fileOverview Generates a Loan Evaluation Report summarizing applicant details,
 * eligibility score, and reasons for approval/rejection.
 *
 * - generateLoanEvaluationReport - A function that generates the loan evaluation report.
 * - LoanEvaluationReportInput - The input type for the generateLoanEvaluationReport function.
 * - LoanEvaluationReportOutput - The return type for the generateLoanEvaluationReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LoanEvaluationReportInputSchema = z.object({
  applicantDetails: z
    .string()
    .describe('Detailed information about the loan applicant.'),
  eligibilityScore: z.number().describe('The calculated eligibility score for the applicant.'),
  decision: z.string().describe('The final loan decision (approved/rejected).'),
  rejectionReasons: z
    .string()
    .optional()
    .describe('Reasons for rejection, if the loan is rejected.'),
  criteriaBreakdown: z
    .string()
    .describe(
      'A breakdown of the criteria used to determine the eligibility score, including credit score, income-to-EMI ratio, etc.'
    ),
});
export type LoanEvaluationReportInput = z.infer<typeof LoanEvaluationReportInputSchema>;

const LoanEvaluationReportOutputSchema = z.object({
  report: z.string().describe('The generated Loan Evaluation Report.'),
});
export type LoanEvaluationReportOutput = z.infer<typeof LoanEvaluationReportOutputSchema>;

export async function generateLoanEvaluationReport(
  input: LoanEvaluationReportInput
): Promise<LoanEvaluationReportOutput> {
  return generateLoanEvaluationReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'loanEvaluationReportPrompt',
  input: {schema: LoanEvaluationReportInputSchema},
  output: {schema: LoanEvaluationReportOutputSchema},
  prompt: `You are an AI assistant specialized in generating Loan Evaluation Reports.
  Based on the applicant details, eligibility score, decision, rejection reasons (if any), and criteria breakdown, generate a comprehensive and informative Loan Evaluation Report.

  Applicant Details: {{{applicantDetails}}}
  Eligibility Score: {{{eligibilityScore}}}
  Decision: {{{decision}}}
  Rejection Reasons: {{{rejectionReasons}}}
  Criteria Breakdown: {{{criteriaBreakdown}}}

  Generate a Loan Evaluation Report with the above information.  The report should include the following sections:

  - Applicant Information
  - Eligibility Assessment
  - Loan Decision
  - Justification
  `,
});

const generateLoanEvaluationReportFlow = ai.defineFlow(
  {
    name: 'generateLoanEvaluationReportFlow',
    inputSchema: LoanEvaluationReportInputSchema,
    outputSchema: LoanEvaluationReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
