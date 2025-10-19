'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, Clock, FileText, Terminal } from 'lucide-react';
import type { Applicant } from '@/lib/types';
import { handleGenerateReport } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface ApplicantDetailsProps {
  applicant: Applicant;
}

export default function ApplicantDetails({ applicant }: ApplicantDetailsProps) {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateReport = async () => {
    setIsLoading(true);
    setReport(null);
    const result = await handleGenerateReport(applicant);
    if (result.success && result.data) {
      setReport(result.data.report);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating report',
        description: result.error,
      });
    }
    setIsLoading(false);
  };
  
  const getStatusBadgeVariant = (status: Applicant['status']) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Image
          src={`https://picsum.photos/seed/${applicant.avatar}/80/80`}
          alt={applicant.name}
          width={80}
          height={80}
          className="rounded-full"
          data-ai-hint="person avatar"
        />
        <div>
          <h1 className="text-3xl font-bold font-headline">{applicant.name}</h1>
          <p className="text-muted-foreground">{applicant.email}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between"><span>Loan Type:</span> <span className="font-medium">{applicant.loanType}</span></div>
            <div className="flex justify-between"><span>Amount:</span> <span className="font-medium">${applicant.loanAmount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Tenure:</span> <span className="font-medium">{applicant.loanTenure} months</span></div>
            <div className="flex justify-between"><span>Branch:</span> <span className="font-medium">{applicant.branch}</span></div>
            <div className="flex justify-between items-center"><span>Status:</span> <Badge variant={getStatusBadgeVariant(applicant.status)}>{applicant.status}</Badge></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Financial Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between"><span>Credit Score:</span> <span className="font-medium">{applicant.creditScore}</span></div>
            <div className="flex justify-between"><span>Income-to-EMI Ratio:</span> <span className="font-medium">{applicant.incomeToEmiRatio}</span></div>
            <div className="flex justify-between"><span>AI Eligibility Score:</span> <span className="font-medium text-primary">{applicant.eligibilityScore}%</span></div>
            <div className="flex justify-between"><span>Application Date:</span> <span className="font-medium">{applicant.applicationDate}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>AI Loan Evaluation Report</CardTitle>
            <CardDescription>
              Generate an automated report summarizing the loan application.
            </CardDescription>
          </div>
          <Button onClick={generateReport} disabled={isLoading}>
            <BrainCircuit className="mr-2" />
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {report && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Evaluation Report</AlertTitle>
              <AlertDescription>
                <pre className="whitespace-pre-wrap font-sans text-sm">{report}</pre>
              </AlertDescription>
            </Alert>
          )}
          {!isLoading && !report && (
             <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12" />
                <p className="mt-2">Click the button to generate the AI report.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>Activity log for this application.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-secondary rounded-full mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium">Application Submitted</p>
                        <p className="text-sm text-muted-foreground">by Branch Staff on {applicant.applicationDate}</p>
                    </div>
                </div>
                {applicant.status !== 'Pending' && (
                  <div className="flex items-start gap-4">
                      <div className="p-2 bg-secondary rounded-full mt-1">
                          <Terminal className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                          <p className="font-medium">Decision Updated: {applicant.status}</p>
                          <p className="text-sm text-muted-foreground">by System Automation</p>
                      </div>
                  </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
