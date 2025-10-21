'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { downloadLoanReport } from '@/lib/pdf-generator';
import { useTranslation } from '@/lib/i18n';

const applicantData = {
  'LA001': {
    id: 'LA001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    amount: 500000,
    status: 'approved',
    score: 850,
    appliedDate: '2024-01-15',
    documents: 8,
    loanType: 'Personal Loan',
    monthlyIncome: 75000,
    employment: 'Software Engineer at TCS',
    experience: '5 years',
    evaluation: {
      loan_eligibility_score: 85,
      approval_status: 'APPROVED',
      remarks: 'Comprehensive assessment shows excellent creditworthiness with CIBIL score of 850. Stable employment with TCS for 5+ years verified. Monthly income of ₹75,000 provides comfortable debt service coverage. No adverse credit history or defaults identified.',
      risk_factors: ['Low risk - All parameters within excellent range'],
      recommendations: ['Approved for full requested amount', 'Eligible for preferential interest rate', 'Fast-track processing recommended'],
      interestRate: 10.5,
      tenure: 36,
      emi: 16134,
      processingFee: 5000,
      totalAmount: 580824,
      disbursementDate: '2024-01-20',
      maturityDate: '2027-01-20'
    }
  },
  'LA002': {
    id: 'LA002',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 87654 32109',
    location: 'Delhi, NCR',
    amount: 250000,
    status: 'pending',
    score: 720,
    appliedDate: '2024-01-14',
    documents: 6,
    loanType: 'Personal Loan',
    monthlyIncome: 45000,
    employment: 'Marketing Manager at Wipro',
    experience: '3 years',
    evaluation: {
      loan_eligibility_score: 72,
      approval_status: 'PENDING',
      remarks: 'Good credit profile with CIBIL score of 720. Recent employment change from previous company requires additional verification. Current income documentation is 2 months old and needs updating.',
      risk_factors: ['Recent employment change requiring verification', 'Income documentation needs updating'],
      recommendations: ['Submit latest salary slips from current employer', 'Provide employment confirmation letter', 'Update bank statements'],
      interestRate: 12.0,
      tenure: 24,
      emi: 11765,
      processingFee: 2500,
      totalAmount: 282360,
      disbursementDate: 'Pending approval',
      maturityDate: 'TBD'
    }
  }
};

export default function ApplicantView() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const applicantId = params.id as string;
  const applicant = applicantData[applicantId as keyof typeof applicantData];

  if (!applicant) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Applicant Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const enhancedApplicant = {
        ...applicant,
        evaluation: {
          ...applicant.evaluation,
          remarks: `Comprehensive RBI-compliant credit assessment completed for ${applicant.name}. Credit bureau analysis conducted through CIBIL with score verification. Income assessment based on salary certificates and bank statement analysis. Employment verification completed through HR confirmation. ${applicant.status === 'approved' ? 'All eligibility parameters meet NBFC lending criteria with excellent creditworthiness and stable financial profile demonstrated.' : applicant.status === 'pending' ? 'Satisfactory credit profile with minor documentation gaps requiring resolution before final approval.' : 'Credit assessment indicates higher risk profile not meeting current conservative lending standards.'}`,
          risk_factors: applicant.status === 'approved' ? ['Low risk - All credit parameters within excellent range', 'Stable employment verified with 5+ years experience', 'No adverse credit bureau records or defaults', 'Debt service coverage ratio well within limits'] : applicant.status === 'pending' ? ['Medium risk - Recent employment change requires verification', 'Income documentation needs updating', 'Credit utilization slightly elevated in recent months'] : ['High risk - Credit score below minimum threshold of 650', 'Debt service coverage ratio exceeds acceptable limits', 'Multiple recent credit inquiries indicating credit stress'],
          recommendations: applicant.status === 'approved' ? ['Loan sanctioned as per applied terms and conditions', 'Eligible for competitive interest rate of 10.5% p.a.', 'Fast-track processing recommended due to excellent profile', 'Maintain existing credit discipline for future facilities'] : applicant.status === 'pending' ? ['Submit latest 3 months salary slips from current employer', 'Provide employment confirmation letter on company letterhead', 'Submit updated 6 months bank statements', 'Complete pending KYC documentation'] : ['Improve credit score to minimum 650 through timely repayments', 'Reduce existing debt obligations to improve DTI ratio', 'Consider secured loan options or co-applicant addition', 'Reapply after 6 months of improved credit behavior']
        }
      };
      await downloadLoanReport(enhancedApplicant, t);
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applicants
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('applicantDetails') || 'Applicant Details'}</h1>
              <p className="text-gray-600">{t('applicationId') || 'Application ID'}: {applicant.id}</p>
            </div>
          </div>
          <Button 
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? (t('generating') || 'Generating...') : (t('downloadReport') || 'Download Report')}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('personalInformation') || 'Personal Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                      {applicant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{applicant.name}</h3>
                    <Badge className={getStatusColor(applicant.status)}>
                      {getStatusIcon(applicant.status)}
                      <span className="ml-1 capitalize">{applicant.status}</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{applicant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{applicant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{applicant.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Applied: {new Date(applicant.appliedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {t('employmentDetails') || 'Employment Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Position</label>
                  <p className="text-sm">{applicant.employment}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Experience</label>
                  <p className="text-sm">{applicant.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Monthly Income</label>
                  <p className="text-sm font-semibold">₹{applicant.monthlyIncome.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {t('loanDetails') || 'Loan Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Loan Type</label>
                    <p className="text-sm font-semibold">{applicant.loanType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Amount Requested</label>
                    <p className="text-sm font-semibold">₹{applicant.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Interest Rate</label>
                    <p className="text-sm font-semibold">{applicant.evaluation.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tenure</label>
                    <p className="text-sm font-semibold">{applicant.evaluation.tenure} months</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Monthly EMI</label>
                    <p className="text-sm font-semibold">₹{applicant.evaluation.emi.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Processing Fee</label>
                    <p className="text-sm font-semibold">₹{applicant.evaluation.processingFee.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount Payable</span>
                    <span className="text-lg font-bold">₹{applicant.evaluation.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t('creditAssessment') || 'Credit Assessment'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Credit Score</span>
                    <span className="text-2xl font-bold text-green-600">{applicant.score}</span>
                  </div>
                  <Progress value={(applicant.score / 900) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Eligibility Score</span>
                    <span className="text-2xl font-bold text-blue-600">{applicant.evaluation.loan_eligibility_score}%</span>
                  </div>
                  <Progress value={applicant.evaluation.loan_eligibility_score} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('aiEvaluation') || 'AI Evaluation'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={`${getStatusColor(applicant.status)} mt-1`}>
                    {applicant.evaluation.approval_status}
                  </Badge>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Remarks</label>
                  <p className="text-sm mt-1">{applicant.evaluation.remarks}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Risk Factors</label>
                  <ul className="text-sm mt-1 space-y-1">
                    {applicant.evaluation.risk_factors.map((factor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Recommendations</label>
                  <ul className="text-sm mt-1 space-y-1">
                    {applicant.evaluation.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents ({applicant.documents}/10)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(applicant.documents / 10) * 100} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">
                  {applicant.documents === 10 ? 'All documents submitted' : `${10 - applicant.documents} documents pending`}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}