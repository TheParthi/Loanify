'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { downloadLoanReport } from '@/lib/pdf-generator';
import Link from 'next/link';

const applicants = [
  {
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
    avatar: '/avatars/rajesh.jpg'
  },
  {
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
    avatar: '/avatars/priya.jpg'
  },
  {
    id: 'LA003',
    name: 'Amit Singh',
    email: 'amit.singh@email.com',
    phone: '+91 76543 21098',
    location: 'Bangalore, Karnataka',
    amount: 750000,
    status: 'review',
    score: 680,
    appliedDate: '2024-01-13',
    documents: 7,
    avatar: '/avatars/amit.jpg'
  },
  {
    id: 'LA004',
    name: 'Sunita Devi',
    email: 'sunita.devi@email.com',
    phone: '+91 65432 10987',
    location: 'Pune, Maharashtra',
    amount: 300000,
    status: 'approved',
    score: 780,
    appliedDate: '2024-01-12',
    documents: 9,
    avatar: '/avatars/sunita.jpg'
  },
  {
    id: 'LA005',
    name: 'Vikram Patel',
    email: 'vikram.patel@email.com',
    phone: '+91 54321 09876',
    location: 'Ahmedabad, Gujarat',
    amount: 425000,
    status: 'rejected',
    score: 580,
    appliedDate: '2024-01-11',
    documents: 5,
    avatar: '/avatars/vikram.jpg'
  }
];

export default function ApplicantsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'review': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'rejected': return 'bg-red-100 text-red-700 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'review': return <AlertTriangle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDownloadReport = (applicant: any) => {
    const reportData = {
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      loanType: 'Personal Loan',
      loanAmount: applicant.amount,
      creditScore: applicant.score,
      eligibilityScore: applicant.score,
      status: applicant.status,
      applicationDate: applicant.appliedDate,
      evaluation: {
        loan_eligibility_score: applicant.score,
        approval_status: applicant.status,
        remarks: `Based on credit score of ${applicant.score} and income analysis, the application has been ${applicant.status.toLowerCase()}.`
      }
    };
    
    downloadLoanReport(reportData, t);
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('applicants') || 'Loan Applicants'}</h1>
            <p className="text-gray-600 mt-1">{t('manageApplications') || 'Manage and review loan applications with AI-powered insights'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="bg-navy-600 hover:bg-navy-700 gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('searchPlaceholder') || 'Search by name, ID, or email...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                >
                  <option value="all">{t('allStatus') || 'All Status'}</option>
                  <option value="approved">{t('approved') || 'Approved'}</option>
                  <option value="pending">{t('pending') || 'Pending'}</option>
                  <option value="review">{t('underReview') || 'Under Review'}</option>
                  <option value="rejected">{t('rejected') || 'Rejected'}</option>
                </select>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => {
                    const filterOptions = [
                      'Credit Score: 300-850',
                      'Loan Amount: ₹50K-₹50L', 
                      'Status: All/Approved/Pending/Rejected',
                      'Date Range: Custom dates',
                      'Employment: Salaried/Self-employed'
                    ];
                    alert(`Advanced Filters:\n${filterOptions.map(f => `• ${f}`).join('\n')}`);
                  }}
                >
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApplicants.map((applicant) => (
            <Card key={applicant.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={applicant.avatar} alt={applicant.name} />
                      <AvatarFallback className="bg-navy-100 text-navy-700 font-semibold">
                        {applicant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                      <p className="text-sm text-gray-500">{applicant.id}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(applicant.status)}>
                    {getStatusIcon(applicant.status)}
                    <span className="ml-1 capitalize">{applicant.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{applicant.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{applicant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{applicant.location}</span>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Loan Amount</span>
                    <span className="font-semibold text-gray-900">
                      ₹{(applicant.amount / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Credit Score</span>
                    <span className={`font-semibold ${getScoreColor(applicant.score)}`}>
                      {applicant.score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Documents</span>
                    <span className="font-semibold text-gray-900">{applicant.documents}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Applied</span>
                    <span className="text-sm text-gray-900">
                      {new Date(applicant.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
                    <Link href={`/admin/applicants/${applicant.id}`}>
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => handleDownloadReport(applicant)}
                  >
                    <Download className="h-4 w-4" />
                    Report
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredApplicants.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}