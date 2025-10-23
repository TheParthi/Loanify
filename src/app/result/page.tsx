'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Download, Home, ArrowLeft } from 'lucide-react';

export default function ResultPage() {
  const [loanData, setLoanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const loanId = searchParams.get('loanId');
  const status = searchParams.get('status');

  useEffect(() => {
    if (loanId) {
      fetchLoanStatus();
    }
  }, [loanId]);

  const fetchLoanStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/loan/status/${loanId}`);
      const data = await response.json();
      setLoanData(data);
    } catch (error) {
      console.error('Failed to fetch loan status:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await fetch(`http://localhost:5000/report/${loanId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${loanData?.status === 'approved' ? 'Sanction' : 'Rejection'}_Letter_${loanId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading loan status...</p>
        </div>
      </div>
    );
  }

  const isApproved = loanData?.status === 'approved' || status === 'approved';
  const isRejected = loanData?.status === 'rejected' || status === 'rejected';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/eligibility" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Loanify NBFC</h1>
                <p className="text-sm text-gray-600">Loan Result</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Loan Application Result</h1>
            <p className="text-lg text-gray-600">Your loan application has been processed</p>
          </div>

          <Card className="shadow-lg mb-8">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                {isApproved ? (
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-12 w-12 text-red-600" />
                  </div>
                )}
              </div>
              <CardTitle className="text-3xl mb-4">
                {isApproved ? 'Congratulations!' : 'Application Update'}
              </CardTitle>
              <Badge 
                variant={isApproved ? 'default' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                {isApproved ? 'APPROVED' : 'REJECTED'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {loanData && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Applicant Name</p>
                      <p className="font-semibold text-lg">{loanData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reference ID</p>
                      <p className="font-mono text-blue-600">{loanId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Requested Amount</p>
                      <p className="font-semibold text-lg">₹{loanData.requested_amount?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Eligibility Score</p>
                      <p className="font-semibold text-lg">{loanData.eligibility_score || 0}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Credit Score</p>
                      <p className="font-semibold text-lg">{loanData.credit_score}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Application Date</p>
                      <p className="font-semibold">{new Date(loanData.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {isApproved && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3 text-lg">Loan Approved!</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-700">Sanctioned Amount</p>
                      <p className="font-semibold text-lg">₹{loanData?.requested_amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-green-700">Interest Rate</p>
                      <p className="font-semibold text-lg">10.5% per annum</p>
                    </div>
                    <div>
                      <p className="text-green-700">Processing Fee</p>
                      <p className="font-semibold text-lg">₹{Math.floor((loanData?.requested_amount || 0) * 0.01).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-green-700">Tenure</p>
                      <p className="font-semibold text-lg">Up to 60 months</p>
                    </div>
                  </div>
                </div>
              )}

              {isRejected && (
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3 text-lg">Application Not Approved</h3>
                  <p className="text-red-700 mb-4">
                    {loanData?.rejection_reason || 'Your application could not be approved at this time.'}
                  </p>
                  <div className="text-sm text-red-600">
                    <p className="font-medium mb-2">Recommendations:</p>
                    <ul className="space-y-1">
                      <li>• Improve your credit score through timely payments</li>
                      <li>• Consider applying for a lower loan amount</li>
                      <li>• Increase your monthly income documentation</li>
                      <li>• You may reapply after 3 months</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={downloadReport}
                  className="flex-1"
                  variant={isApproved ? 'default' : 'outline'}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download {isApproved ? 'Sanction Letter' : 'Rejection Report'}
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500 bg-white p-6 rounded-lg shadow">
            <p className="font-medium mb-2">Next Steps</p>
            {isApproved ? (
              <p>Visit our nearest branch with your sanction letter and required documents for loan disbursement.</p>
            ) : (
              <p>For any queries regarding your application, please contact our customer support at support@loanify.com</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}