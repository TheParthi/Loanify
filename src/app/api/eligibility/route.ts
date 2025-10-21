import { NextRequest, NextResponse } from 'next/server';
import { checkCustomerEligibility } from '@/ai/flows/check-customer-eligibility';
import { z } from 'zod';

const eligibilitySchema = z.object({
  creditScore: z.number().min(300).max(850),
  annualIncome: z.number().min(10000),
  monthlyEmi: z.number().min(0),
  loanAmount: z.number().min(1000),
  loanTenure: z.number().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = eligibilitySchema.parse(body);
    
    const result = await checkCustomerEligibility(validatedData);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to check eligibility' }, { status: 500 });
  }
}