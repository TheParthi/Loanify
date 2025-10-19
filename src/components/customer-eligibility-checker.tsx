'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleCheckEligibility } from '@/app/actions';
import { EligibilityResult } from '@/components/eligibility-result';

const formSchema = z.object({
  creditScore: z.coerce.number().min(300, "Must be at least 300").max(850, "Must be at most 850"),
  incomeToEmiRatio: z.coerce.number().min(0, "Cannot be negative").max(1, "Cannot be more than 1"),
  loanAmount: z.coerce.number().min(1000, "Must be at least 1000"),
  loanTenure: z.coerce.number().min(6, "Must be at least 6 months"),
});

type FormData = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Checking...' : 'Check Eligibility'}
    </Button>
  );
}

export function CustomerEligibilityChecker() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(handleCheckEligibility, null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creditScore: 720,
      incomeToEmiRatio: 0.4,
      loanAmount: 50000,
      loanTenure: 60,
    }
  });

  useEffect(() => {
    if (state?.success === false && state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Check Your Loan Eligibility</CardTitle>
        <CardDescription>
          Fill in the details below to get an instant AI-powered evaluation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.success ? (
          <EligibilityResult result={state.data!} />
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="creditScore">Credit Score</Label>
              <Input
                id="creditScore"
                placeholder="e.g., 750"
                type="number"
                {...register('creditScore')}
              />
              {errors.creditScore && <p className="text-xs text-destructive">{errors.creditScore.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="incomeToEmiRatio">Income to EMI Ratio</Label>
              <Input
                id="incomeToEmiRatio"
                placeholder="e.g., 0.4"
                type="number"
                step="0.01"
                {...register('incomeToEmiRatio')}
              />
              {errors.incomeToEmiRatio && <p className="text-xs text-destructive">{errors.incomeToEmiRatio.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount ($)</Label>
              <Input
                id="loanAmount"
                placeholder="e.g., 50000"
                type="number"
                {...register('loanAmount')}
              />
              {errors.loanAmount && <p className="text-xs text-destructive">{errors.loanAmount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanTenure">Loan Tenure (Months)</Label>
              <Input
                id="loanTenure"
                placeholder="e.g., 60"
                type="number"
                {...register('loanTenure')}
              />
              {errors.loanTenure && <p className="text-xs text-destructive">{errors.loanTenure.message}</p>}
            </div>
            <SubmitButton />
          </form>
        )}
      </CardContent>
    </Card>
  );
}
