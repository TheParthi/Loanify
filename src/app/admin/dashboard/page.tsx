'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  DollarSign,
  FileText,
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar,
  MapPin
} from 'lucide-react';

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  averageScore: number;
  totalLoanAmount: number;
  approvalRate: number;
  applicationsByBranch: { [key: string]: number };
  recentApplications: Array<{
    id: string;
    name: string;
    amount: number;
    status: string;
    score: number;
    date: string;
    branch: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalApplications: 1247,
        pendingApplications: 89,
        approvedApplications: 756,
        rejectedApplications: 402,
        averageScore: 72.5,
        totalLoanAmount: 45600000,
        approvalRate: 60.6,
        applicationsByBranch: {
          'Mumbai Central': 324,
          'Delhi NCR': 298,
          'Bangalore': 267,
          'Chennai': 189,
          'Pune': 169
        },
        recentApplications: [
          {
            id: 'LF12345678',
            name: 'Rajesh Kumar',
            amount: 500000,
            status: 'APPROVED',
            score: 85,
            date: '2024-01-15',
            branch: 'Mumbai Central'
          },
          {
            id: 'LF12345679',
            name: 'Priya Sharma',
            amount: 300000,
            status: 'PENDING',
            score: 72,
            date: '2024-01-15',
            branch: 'Delhi NCR'
          },
          {
            id: 'LF12345680',
            name: 'Amit Patel',
            amount: 750000,
            status: 'REJECTED',
            score: 45,
            date: '2024-01-14',
            branch: 'Bangalore'
          },
          {
            id: 'LF12345681',
            name: 'Sneha Reddy',
            amount: 400000,
            status: 'APPROVED',
            score: 78,
            date: '2024-01-14',
            branch: 'Chennai'
          },
          {
            id: 'LF12345682',
            name: 'Vikram Singh',
            amount: 600000,
            status: 'PENDING',
            score: 68,
            date: '2024-01-13',
            branch: 'Pune'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor loan applications and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedPeriod === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={selectedPeriod === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={selectedPeriod === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvalRate}%</div>
            <Progress value={stats.approvalRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageScore}</div>
            <p className="text-xs text-muted-foreground">AI eligibility score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.approvedApplications}
            </div>
            <div className="text-sm text-gray-600">
              Total Amount: ₹{(stats.totalLoanAmount * 0.6).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats.rejectedApplications}
            </div>
            <div className="text-sm text-gray-600">
              {((stats.rejectedApplications / stats.totalApplications) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
              Total Loan Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ₹{(stats.totalLoanAmount / 10000000).toFixed(1)}Cr
            </div>
            <div className="text-sm text-gray-600">Across all applications</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Applications
            </CardTitle>
            <CardDescription>Latest loan applications submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(app.status)}
                    <div>
                      <div className="font-medium">{app.name}</div>
                      <div className="text-sm text-gray-500">
                        {app.id} • ₹{app.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                    <div className="text-sm text-gray-500 mt-1">Score: {app.score}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Applications
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Applications by Branch
            </CardTitle>
            <CardDescription>Performance across different locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.applicationsByBranch).map(([branch, count]) => (
                <div key={branch} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{branch}</span>
                    <span className="text-sm text-gray-500">{count} applications</span>
                  </div>
                  <Progress 
                    value={(count / Math.max(...Object.values(stats.applicationsByBranch))) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center" asChild>
              <Link href="/admin/applicants">
                <Users className="w-6 h-6 mb-2" />
                View Applicants
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <FileText className="w-6 h-6 mb-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <PieChart className="w-6 h-6 mb-2" />
              Analytics
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <AlertTriangle className="w-6 h-6 mb-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}