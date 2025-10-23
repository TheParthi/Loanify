'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { downloadProfessionalReport } from '@/components/ProfessionalPDFReport';

export default function TestPDFPage() {
  const testApprovedData = {
    referenceId: 'LF000123',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    mobile: '9876543210',
    age: '32',
    employmentType: 'salaried',
    income: 85000,
    loanAmount: 750000,
    creditScore: 780,
    status: 'approved',
    eligibilityPercentage: 95,
    recommendedAmount: 750000,
    interestRate: 10.5,
    emi: 24567,
    aiReport: 'Excellent credit profile with stable employment. All RBI compliance requirements met. Recommended for immediate approval.',
    applicationDate: new Date().toISOString(),
    loanType: 'Personal Loan',
    tenure: '36'
  };

  const testRejectedData = {
    referenceId: 'LF000124',
    name: 'Priya Singh',
    email: 'priya.singh@email.com',
    mobile: '9876543211',
    age: '28',
    employmentType: 'self-employed',
    income: 35000,
    loanAmount: 500000,
    creditScore: 580,
    status: 'rejected',
    eligibilityPercentage: 35,
    recommendedAmount: 0,
    interestRate: 0,
    emi: 0,
    aiReport: 'Credit score below minimum threshold. Debt-to-income ratio exceeds acceptable limits.',
    applicationDate: new Date().toISOString(),
    loanType: 'Personal Loan',
    tenure: '48'
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1E1E1E' }}>
            Professional PDF Report Testing
          </h1>
          <p className="text-lg" style={{ color: '#64748B' }}>
            Test the professional PDF generation with different loan statuses
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-center" style={{ color: '#2ECC71' }}>
                Approved Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p><strong>Name:</strong> {testApprovedData.name}</p>
                <p><strong>Reference:</strong> {testApprovedData.referenceId}</p>
                <p><strong>Amount:</strong> ₹{testApprovedData.loanAmount.toLocaleString()}</p>
                <p><strong>Credit Score:</strong> {testApprovedData.creditScore}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">APPROVED</span></p>
              </div>
              <Button 
                onClick={() => downloadProfessionalReport(testApprovedData)}
                className="w-full text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Approved Report
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-center" style={{ color: '#E74C3C' }}>
                Rejected Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p><strong>Name:</strong> {testRejectedData.name}</p>
                <p><strong>Reference:</strong> {testRejectedData.referenceId}</p>
                <p><strong>Amount:</strong> ₹{testRejectedData.loanAmount.toLocaleString()}</p>
                <p><strong>Credit Score:</strong> {testRejectedData.creditScore}</p>
                <p><strong>Status:</strong> <span className="text-red-600 font-semibold">REJECTED</span></p>
              </div>
              <Button 
                onClick={() => downloadProfessionalReport(testRejectedData)}
                className="w-full text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)' }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Rejected Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}