'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, PieChart, Download, Calendar, Filter, ArrowUpRight, Target, DollarSign, Users, Clock, AlertTriangle } from 'lucide-react';

export default function BusinessIntelligence() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalyticsData({
        totalApplications: 1247,
        approvedLoans: 892,
        rejectedLoans: 234,
        pendingLoans: 121,
        totalDisbursed: 45600000,
        avgLoanAmount: 387500,
        avgProcessingTime: 28,
        approvalRate: 71.5,
        portfolioGrowth: 18.3,
        riskScore: 2.1,
        customerSatisfaction: 4.6,
        branchPerformance: [
          { branch: 'Mumbai Central', applications: 342, approved: 245, disbursed: 12500000 },
          { branch: 'Delhi NCR', applications: 298, approved: 201, disbursed: 9800000 },
          { branch: 'Bangalore', applications: 267, approved: 189, disbursed: 8900000 },
          { branch: 'Chennai', applications: 201, approved: 142, disbursed: 7200000 },
          { branch: 'Pune', applications: 139, approved: 115, disbursed: 7200000 }
        ],
        loanTypeDistribution: [
          { type: 'Personal Loan', count: 687, amount: 28900000 },
          { type: 'Business Loan', count: 342, amount: 12400000 },
          { type: 'Vehicle Loan', count: 218, amount: 4300000 }
        ],
        monthlyTrends: [
          { month: 'Jan', applications: 98, disbursed: 3200000 },
          { month: 'Feb', applications: 112, disbursed: 3800000 },
          { month: 'Mar', applications: 134, disbursed: 4200000 },
          { month: 'Apr', applications: 156, disbursed: 4900000 },
          { month: 'May', applications: 189, disbursed: 5600000 },
          { month: 'Jun', applications: 201, disbursed: 6100000 }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const downloadAnalyticsReport = async () => {
    const { generateProfessionalReport } = await import('@/lib/pdf-generator');
    
    const reportData = {
      referenceId: `BI_RPT_${Date.now()}`,
      name: 'Business Intelligence Report',
      email: 'analytics@loanify.com',
      mobile: '1800-123-LOAN',
      loanType: 'Analytics Report',
      loanAmount: analyticsData.totalDisbursed,
      creditScore: 850,
      status: 'approved',
      eligibilityPercentage: 95,
      recommendedAmount: analyticsData.totalDisbursed,
      interestRate: 0,
      emi: 0,
      aiReport: `BUSINESS INTELLIGENCE REPORT\n\nPERFORMANCE METRICS (${timeRange.toUpperCase()})\n\nTotal Applications: ${analyticsData.totalApplications}\nApproved Loans: ${analyticsData.approvedLoans}\nApproval Rate: ${analyticsData.approvalRate}%\nTotal Disbursed: ₹${(analyticsData.totalDisbursed / 10000000).toFixed(1)} Crores\nAvg Loan Amount: ₹${analyticsData.avgLoanAmount?.toLocaleString()}\nAvg Processing Time: ${analyticsData.avgProcessingTime} hours\n\nPORTFOLIO ANALYSIS\nPortfolio Growth: ${analyticsData.portfolioGrowth}%\nRisk Score: ${analyticsData.riskScore}%\nCustomer Satisfaction: ${analyticsData.customerSatisfaction}/5\n\nTOP PERFORMING BRANCHES\n${analyticsData.branchPerformance?.slice(0, 3).map(branch => `${branch.branch}: ${branch.approved} loans, ₹${(branch.disbursed / 10000000).toFixed(1)}Cr`).join('\n')}\n\nLOAN TYPE DISTRIBUTION\n${analyticsData.loanTypeDistribution?.map(loan => `${loan.type}: ${loan.count} loans (₹${(loan.amount / 10000000).toFixed(1)}Cr)`).join('\n')}\n\nKEY INSIGHTS\n• Strong portfolio growth of ${analyticsData.portfolioGrowth}% indicates healthy business expansion\n• Approval rate of ${analyticsData.approvalRate}% is within optimal range\n• Average processing time of ${analyticsData.avgProcessingTime} hours meets SLA requirements\n• Risk score of ${analyticsData.riskScore}% indicates well-managed portfolio`,
      applicationDate: new Date().toISOString(),
      tenure: '0',
      branch: 'Head Office',
      officer: 'Business Intelligence Team',
      priority: 'High',
      processingTime: 0,
      documents: ['Analytics Dashboard', 'Performance Metrics', 'Risk Assessment']
    };
    
    generateProfessionalReport(reportData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-6" style={{ borderColor: '#0047AB' }}></div>
          <p className="text-xl font-semibold" style={{ color: '#64748B' }}>Loading Business Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#1E1E1E' }}>Business Intelligence</h1>
            <p className="text-lg" style={{ color: '#64748B' }}>Advanced analytics and performance insights</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border rounded-lg font-medium"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <Button 
              onClick={downloadAnalyticsReport}
              className="text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold">{analyticsData.totalApplications?.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-blue-200" />
                    <span className="text-sm text-blue-100">+12% vs last period</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Approval Rate</p>
                  <p className="text-3xl font-bold">{analyticsData.approvalRate}%</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Target className="h-4 w-4 text-green-200" />
                    <span className="text-sm text-green-100">Target: 75%</span>
                  </div>
                </div>
                <TrendingUp className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Disbursed</p>
                  <p className="text-3xl font-bold">₹{(analyticsData.totalDisbursed / 10000000).toFixed(1)}Cr</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="h-4 w-4 text-purple-200" />
                    <span className="text-sm text-purple-100">+{analyticsData.portfolioGrowth}% growth</span>
                  </div>
                </div>
                <DollarSign className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg Processing</p>
                  <p className="text-3xl font-bold">{analyticsData.avgProcessingTime}h</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-4 w-4 text-orange-200" />
                    <span className="text-sm text-orange-100">SLA: 48h</span>
                  </div>
                </div>
                <Clock className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Branch Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.branchPerformance?.map((branch, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-semibold">{branch.branch}</p>
                      <p className="text-sm text-gray-600">{branch.applications} applications</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{branch.approved} approved</p>
                      <p className="text-sm text-gray-600">₹{(branch.disbursed / 10000000).toFixed(1)}Cr</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-6 w-6 text-purple-600" />
                Loan Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.loanTypeDistribution?.map((loan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                      <div>
                        <p className="font-semibold">{loan.type}</p>
                        <p className="text-sm text-gray-600">{loan.count} loans</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{(loan.amount / 10000000).toFixed(1)}Cr</p>
                      <p className="text-sm text-gray-600">{((loan.count / analyticsData.totalApplications) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="shadow-xl border-0 bg-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Monthly Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {analyticsData.monthlyTrends?.map((month, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <p className="text-sm font-medium text-blue-600 mb-2">{month.month}</p>
                  <p className="text-xl font-bold text-blue-800">{month.applications}</p>
                  <p className="text-xs text-blue-600">applications</p>
                  <p className="text-sm font-semibold text-green-600 mt-2">₹{(month.disbursed / 1000000).toFixed(1)}M</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk & Quality Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">{analyticsData.riskScore}%</div>
                <p className="text-sm text-gray-600">Portfolio Risk Level</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${analyticsData.riskScore * 10}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Customer Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{analyticsData.customerSatisfaction}/5</div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <div className="flex justify-center mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className={`w-6 h-6 ${star <= Math.floor(analyticsData.customerSatisfaction) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Avg Loan Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">₹{(analyticsData.avgLoanAmount / 100000).toFixed(1)}L</div>
                <p className="text-sm text-gray-600">Average Disbursement</p>
                <Badge className="mt-4 bg-blue-100 text-blue-700">
                  +8% vs last period
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}