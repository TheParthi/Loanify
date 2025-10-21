'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Calendar,
  Filter
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

const getStats = (t: (key: string) => string) => [
  {
    title: t('totalApplications') || 'Total Applications',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: FileText,
    color: 'bg-blue-500'
  },
  {
    title: t('approvedLoans') || 'Approved Loans',
    value: '1,923',
    change: '+8.2%',
    trend: 'up',
    icon: CheckCircle,
    color: 'bg-green-500'
  },
  {
    title: t('pendingReview') || 'Pending Review',
    value: '456',
    change: '-3.1%',
    trend: 'down',
    icon: Clock,
    color: 'bg-yellow-500'
  },
  {
    title: t('totalDisbursed') || 'Total Disbursed',
    value: '₹45.2Cr',
    change: '+15.8%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-purple-500'
  }
];

const recentApplications = [
  { id: 'LA001', name: 'Rajesh Kumar', amount: '₹5,00,000', status: 'approved', time: '2 hours ago' },
  { id: 'LA002', name: 'Priya Sharma', amount: '₹2,50,000', status: 'pending', time: '4 hours ago' },
  { id: 'LA003', name: 'Amit Singh', amount: '₹7,50,000', status: 'review', time: '6 hours ago' },
  { id: 'LA004', name: 'Sunita Devi', amount: '₹3,00,000', status: 'approved', time: '8 hours ago' },
  { id: 'LA005', name: 'Vikram Patel', amount: '₹4,25,000', status: 'rejected', time: '1 day ago' }
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const stats = getStats(t);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('dashboard') || 'Dashboard Overview'}</h1>
            <p className="text-gray-600 mt-1">{t('welcomeBack') || "Welcome back! Here's what's happening with your loans today."}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                alert(`Filtering data from ${thirtyDaysAgo.toLocaleDateString()} to ${new Date().toLocaleDateString()}`);
              }}
            >
              <Calendar className="h-4 w-4" />
              Last 30 days
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => {
                const filterOptions = [
                  'Credit Score Range',
                  'Loan Amount Range', 
                  'Application Date',
                  'Employment Type',
                  'Income Range'
                ];
                alert(`Available Filters:\n${filterOptions.map(f => `• ${f}`).join('\n')}`);
              }}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="bg-navy-600 hover:bg-navy-700 gap-2">
              <BarChart3 className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 w-full ${stat.color}`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Applications */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">{t('recentApplications') || 'Recent Applications'}</CardTitle>
                <Button asChild variant="ghost" size="sm" className="text-navy-600 hover:text-navy-700">
                  <Link href="/admin/applicants">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {recentApplications.map((app, index) => (
                  <div key={app.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors border-b last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-navy-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {app.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.name}</p>
                        <p className="text-sm text-gray-500">{app.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{app.amount}</p>
                      <p className="text-sm text-gray-500">{app.time}</p>
                    </div>
                    <Badge variant={
                      app.status === 'approved' ? 'default' : 
                      app.status === 'pending' ? 'secondary' :
                      app.status === 'review' ? 'outline' : 'destructive'
                    } className={
                      app.status === 'approved' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                      app.status === 'review' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                      'bg-red-100 text-red-700 hover:bg-red-100'
                    }>
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Analytics */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{t('quickActions') || 'Quick Actions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start gap-3 bg-navy-600 hover:bg-navy-700">
                  <Link href="/admin/upload">
                    <FileText className="h-4 w-4" />
                    Upload Documents
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start gap-3">
                  <Link href="/admin/applicants">
                    <Users className="h-4 w-4" />
                    View Applicants
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start gap-3">
                  <Link href="/admin/reports">
                    <BarChart3 className="h-4 w-4" />
                    Generate Report
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start gap-3">
                  <Link href="/admin/system-health">
                    <Activity className="h-4 w-4" />
                    System Health
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{t('performance') || 'Performance'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Approval Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Processing Speed</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}