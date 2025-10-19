'use server';
/**
 * @fileOverview Customer eligibility check AI agent.
 *
 * - checkCustomerEligibility - A function that handles the customer eligibility check process.
 * - CheckCustomerEligibilityInput - The input type for the checkCustomerEligibility function.
 * - CheckCustomerEligibilityOutput - The return type for the checkCustomerEligibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckCustomerEligibilityInputSchema = z.object({
  creditScore: z.number().describe('The credit score of the customer.'),
  annualIncome: z.number().describe('The annual income of the customer.'),
  monthlyEmi: z
    .number()
    .describe('The current total monthly EMI of the customer.'),
  loanAmount: z.number().describe('The loan amount requested by the customer.'),
  loanTenure: z.number().describe('The loan tenure in months.'),
});
export type CheckCustomerEligibilityInput = z.infer<typeof CheckCustomerEligibilityInputSchema>;

const CheckCustomerEligibilityOutputSchema = z.object({
  eligibilityPercentage: z
    .number()
    .describe('The estimated eligibility percentage for the loan.'),
  reasons: z
    .array(z.string())
    .describe('The reasons for the eligibility percentage.'),
});
export type CheckCustomerEligibilityOutput = z.infer<typeof CheckCustomerEligibilityOutputSchema>;

export async function checkCustomerEligibility(input: CheckCustomerEligibilityInput): Promise<CheckCustomerEligibilityOutput> {
  return checkCustomerEligibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkCustomerEligibilityPrompt',
  input: {schema: CheckCustomerEligibilityInputSchema},
  output: {schema: CheckCustomerEligibilityOutputSchema},
  prompt: `You are an AI assistant that helps determine the eligibility of a customer for a loan.

  Based on the following information, determine the eligibility percentage for the loan:

  Credit Score: {{{creditScore}}}
  Annual Income: {{{annualIncome}}}
  Current Monthly EMI: {{{monthlyEmi}}}
  Loan Amount: {{{loanAmount}}}
  Loan Tenure: {{{loanTenure}}}

  Consider the following factors when determining the eligibility percentage. The monthly income is annualIncome / 12. Calculate the income to EMI ratio which is (current monthly EMI + proposed monthly EMI) / monthly income. The proposed monthly EMI can be estimated.

  - A higher credit score indicates a higher eligibility percentage.
  - A lower income to EMI ratio indicates a higher eligibility percentage.
  - A higher annual income indicates a higher eligibility percentage.
  - A lower loan amount indicates a higher eligibility percentage.
  - A shorter loan tenure indicates a higher eligibility percentage.

  Return the eligibility percentage and the reasons for the eligibility percentage.
  `,
});

const checkCustomerEligibilityFlow = ai.defineFlow(
  {
    name: 'checkCustomerEligibilityFlow',
    inputSchema: CheckCustomerEligibilityInputSchema,
    outputSchema: CheckCustomerEligibilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
