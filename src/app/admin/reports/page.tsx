'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  FileText,
  MapPin
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const reportData = {
  totalApplications: 2847,
  approvedLoans: 1923,
  rejectedLoans: 468,
  pendingReview: 456,
  approvalRate: 67.5,
  avgProcessingTime: 2.3,
  totalDisbursed: 452000000
};

const loanTypeData = [
  { type: 'Personal', count: 1245, percentage: 43.7, color: 'bg-blue-500' },
  { type: 'Home', count: 856, percentage: 30.1, color: 'bg-green-500' },
  { type: 'Vehicle', count: 432, percentage: 15.2, color: 'bg-yellow-500' },
  { type: 'Business', count: 314, percentage: 11.0, color: 'bg-purple-500' }
];

const regionData = [
  { region: 'Mumbai', applications: 645, approved: 456, rate: 70.7 },
  { region: 'Delhi', applications: 523, approved: 342, rate: 65.4 },
  { region: 'Bangalore', applications: 487, approved: 334, rate: 68.6 },
  { region: 'Chennai', applications: 398, approved: 267, rate: 67.1 },
  { region: 'Pune', applications: 312, approved: 198, rate: 63.5 }
];

export default function ReportsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState('30');
  const [loanTypeFilter, setLoanTypeFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFullReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create and download PDF report
    const reportContent = `
      LOANIFY NBFC - PERFORMANCE REPORT
      Generated on: ${new Date().toLocaleDateString()}
      
      SUMMARY METRICS:
      • Total Applications: ${reportData.totalApplications.toLocaleString()}
      • Approved Loans: ${reportData.approvedLoans.toLocaleString()}
      • Approval Rate: ${reportData.approvalRate}%
      • Total Disbursed: ₹${(reportData.totalDisbursed / 10000000).toFixed(1)} Cr
      
      LOAN TYPE DISTRIBUTION:
      ${loanTypeData.map(item => `• ${item.type}: ${item.count} (${item.percentage}%)`).join('\n')}
      
      REGIONAL PERFORMANCE:
      ${regionData.map(item => `• ${item.region}: ${item.rate}% approval rate`).join('\n')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loanify_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Reports</h1>
            <p className="text-gray-600 mt-1">Comprehensive analytics and insights for loan operations</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="custom">Custom Range</option>
            </select>
            <select
              value={loanTypeFilter}
              onChange={(e) => setLoanTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="all">All Loan Types</option>
              <option value="personal">Personal</option>
              <option value="home">Home</option>
              <option value="vehicle">Vehicle</option>
              <option value="business">Business</option>
            </select>
            <Button 
              onClick={generateFullReport}
              disabled={isGenerating}
              className="bg-navy-600 hover:bg-navy-700 gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Full Report
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.totalApplications.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Approval Rate</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.approvalRate}%</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Processing Time</p>
                  <p className="text-2xl font-bold text-yellow-600">{reportData.avgProcessingTime} days</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Disbursed</p>
                  <p className="text-2xl font-bold text-purple-600">₹{(reportData.totalDisbursed / 10000000).toFixed(1)}Cr</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Loan Type Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Loan Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loanTypeData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.type} Loans</span>
                    <span className="text-sm text-gray-600">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Regional Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Regional Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {regionData.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{region.region}</p>
                    <p className="text-sm text-gray-600">{region.applications} applications</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{region.rate}%</p>
                    <p className="text-sm text-gray-600">{region.approved} approved</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Application Status Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Application Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{reportData.approvedLoans.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Approved Applications</p>
                <Progress value={67.5} className="mt-2 h-2" />
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-600">{reportData.pendingReview.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
                <Progress value={16} className="mt-2 h-2" />
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-600">{reportData.rejectedLoans.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Rejected Applications</p>
                <Progress value={16.5} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}