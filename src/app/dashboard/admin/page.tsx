'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  Users, 
  FileText,
  Upload,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  Download,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  CreditCard,
  Building2,
  Shield,
  AlertTriangle,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Globe,
  PieChart,
  Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    const userData = localStorage.getItem('adminUser');
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (userData) {
      setAdminUser(JSON.parse(userData));
    }

    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:8081/admin/applications');
      if (!response.ok) throw new Error('Backend offline');
      
      const data = await response.json();
      setApplications(data.map(app => ({
        id: app.id,
        name: app.name,
        email: app.email,
        mobile: app.phone,
        loanAmount: app.requested_amount || 0,
        income: app.salary || 0,
        creditScore: app.credit_score || 0,
        eligibilityScore: app.eligibility_score || 0,
        status: app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Pending',
        loanType: 'Personal Loan',
        applicationDate: new Date(app.created_at).toLocaleDateString(),
        referenceId: app.id
      })));
    } catch (error) {
      console.error('Backend connection failed:', error);
      setApplications([
        {
          id: 1,
          name: 'Rajesh Kumar',
          email: 'rajesh@email.com',
          mobile: '9876543210',
          loanAmount: 500000,
          income: 75000,
          creditScore: 750,
          eligibilityScore: 85,
          status: 'Approved',
          loanType: 'Personal Loan',
          applicationDate: '2024-01-15',
          referenceId: 'LN001'
        },
        {
          id: 2,
          name: 'Priya Sharma',
          email: 'priya@email.com',
          mobile: '9876543211',
          loanAmount: 1000000,
          income: 120000,
          creditScore: 680,
          eligibilityScore: 72,
          status: 'Pending',
          loanType: 'Business Loan',
          applicationDate: '2024-01-16',
          referenceId: 'LN002'
        },
        {
          id: 3,
          name: 'Amit Patel',
          email: 'amit@email.com',
          mobile: '9876543212',
          loanAmount: 300000,
          income: 45000,
          creditScore: 620,
          eligibilityScore: 45,
          status: 'Rejected',
          loanType: 'Vehicle Loan',
          applicationDate: '2024-01-17',
          referenceId: 'LN003'
        },
        {
          id: 4,
          name: 'Sneha Reddy',
          email: 'sneha@email.com',
          mobile: '9876543213',
          loanAmount: 750000,
          income: 95000,
          creditScore: 720,
          eligibilityScore: 78,
          status: 'Approved',
          loanType: 'Home Loan',
          applicationDate: '2024-01-18',
          referenceId: 'LN004'
        },
        {
          id: 5,
          name: 'Vikram Singh',
          email: 'vikram@email.com',
          mobile: '9876543214',
          loanAmount: 200000,
          income: 55000,
          creditScore: 690,
          eligibilityScore: 65,
          status: 'Pending',
          loanType: 'MSME Loan',
          applicationDate: '2024-01-19',
          referenceId: 'LN005'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return { backgroundColor: '#E8F6F3', color: '#2ECC71', borderColor: '#2ECC71' };
      case 'Rejected': return { backgroundColor: '#FEF2F2', color: '#E74C3C', borderColor: '#E74C3C' };
      case 'Pending': return { backgroundColor: '#FEF3E2', color: '#F39C12', borderColor: '#F39C12' };
      default: return { backgroundColor: '#F4F6F8', color: '#C9D1D9', borderColor: '#C9D1D9' };
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'compliance', label: 'RBI Compliance', icon: Shield },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'customers', label: 'Customers', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const totalApplicants = applications.length;
  const approved = applications.filter(a => a.status === 'Approved').length;
  const pending = applications.filter(a => a.status === 'Pending').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const totalLoanValue = applications.filter(a => a.status === 'Approved').reduce((sum, a) => sum + a.loanAmount, 0);
  const approvalRate = totalApplicants > 0 ? Math.round((approved / totalApplicants) * 100) : 0;
  const avgCreditScore = applications.length > 0 ? Math.round(applications.reduce((sum, a) => sum + a.creditScore, 0) / applications.length) : 0;

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-1">Total Applications</p>
                <p className="text-3xl font-black text-blue-800">{totalApplicants}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+12% this month</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 rounded-3xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-600 mb-1">Approval Rate</p>
                <p className="text-3xl font-black text-green-800">{approvalRate}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+5% improvement</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-600 mb-1">Pending Reviews</p>
                <p className="text-3xl font-black text-orange-800">{pending}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Needs attention</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600 mb-1">Total Disbursed</p>
                <p className="text-3xl font-black text-purple-800">₹{(totalLoanValue / 100000).toFixed(1)}L</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+18% growth</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xl border-0 rounded-3xl bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold" style={{ color: '#1E1E1E' }}>Application Trends</CardTitle>
              <Button variant="outline" size="sm" className="border-2" style={{ borderColor: '#0047AB', color: '#0047AB' }}>
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 Days
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center" style={{ backgroundColor: '#F4F6F8' }}>
              <div className="text-center">
                <Activity className="h-16 w-16 mx-auto mb-4" style={{ color: '#C9D1D9' }} />
                <p className="text-lg font-semibold" style={{ color: '#1E1E1E' }}>Interactive Chart</p>
                <p style={{ color: '#C9D1D9' }}>Real-time application analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 rounded-3xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold" style={{ color: '#1E1E1E' }}>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: '#F4F6F8' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#C9D1D9' }}>Avg Credit Score</p>
                <p className="text-2xl font-bold" style={{ color: '#1E1E1E' }}>{avgCreditScore}</p>
              </div>
              <CreditCard className="h-8 w-8" style={{ color: '#0047AB' }} />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: '#F4F6F8' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#C9D1D9' }}>Processing Time</p>
                <p className="text-2xl font-bold" style={{ color: '#1E1E1E' }}>2.4h</p>
              </div>
              <Zap className="h-8 w-8" style={{ color: '#F39C12' }} />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: '#F4F6F8' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#C9D1D9' }}>Customer Satisfaction</p>
                <p className="text-2xl font-bold" style={{ color: '#1E1E1E' }}>4.8/5</p>
              </div>
              <CheckCircle className="h-8 w-8" style={{ color: '#2ECC71' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="shadow-xl border-0 rounded-3xl bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold" style={{ color: '#1E1E1E' }}>Recent Applications</CardTitle>
            <Button 
              onClick={() => setActiveTab('applications')} 
              className="text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
              style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
            >
              View All Applications
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-6 rounded-2xl border-2 hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#F4F6F8', borderColor: '#E8F4FD' }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                    <span className="font-bold text-white text-lg">{app.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#1E1E1E' }}>{app.name}</p>
                    <p className="font-medium" style={{ color: '#C9D1D9' }}>{app.loanType} • ₹{app.loanAmount.toLocaleString()}</p>
                    <p className="text-sm" style={{ color: '#C9D1D9' }}>Credit Score: {app.creditScore}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="px-4 py-2 rounded-xl font-semibold" style={getStatusColor(app.status)}>
                    {app.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="rounded-xl border-2" style={{ borderColor: '#0047AB', color: '#0047AB' }}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2" style={{ color: '#1E1E1E' }}>Loan Applications</h2>
          <p className="text-lg" style={{ color: '#C9D1D9' }}>Manage and review all loan applications</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#C9D1D9' }} />
            <Input placeholder="Search applications..." className="pl-12 w-80 h-12 border-2 rounded-xl" style={{ borderColor: '#C9D1D9' }} />
          </div>
          <Button variant="outline" size="lg" className="border-2 rounded-xl" style={{ borderColor: '#C9D1D9', color: '#1E1E1E' }}>
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </Button>
          <Button size="lg" className="text-white font-semibold rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
            <Plus className="h-5 w-5 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      <Card className="shadow-xl border-0 rounded-3xl bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
                  <th className="text-left py-6 px-8 font-bold text-lg" style={{ color: '#1E1E1E' }}>Applicant</th>
                  <th className="text-left py-6 px-8 font-bold text-lg" style={{ color: '#1E1E1E' }}>Loan Details</th>
                  <th className="text-left py-6 px-8 font-bold text-lg" style={{ color: '#1E1E1E' }}>Credit Score</th>
                  <th className="text-left py-6 px-8 font-bold text-lg" style={{ color: '#1E1E1E' }}>Status</th>
                  <th className="text-left py-6 px-8 font-bold text-lg" style={{ color: '#1E1E1E' }}>Date</th>
                  <th className="text-left py-6 px-8 font-bold text-lg" style={{ color: '#1E1E1E' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b-2 hover:bg-gray-50 transition-all duration-200" style={{ borderColor: '#F4F6F8' }}>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                          <span className="font-bold text-white">{app.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-bold text-lg" style={{ color: '#1E1E1E' }}>{app.name}</p>
                          <p className="font-medium" style={{ color: '#C9D1D9' }}>{app.mobile}</p>
                          <p className="text-sm" style={{ color: '#C9D1D9' }}>{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <p className="font-bold text-lg" style={{ color: '#1E1E1E' }}>{app.loanType}</p>
                      <p className="font-semibold text-lg" style={{ color: '#0047AB' }}>₹{app.loanAmount.toLocaleString()}</p>
                      <p className="text-sm" style={{ color: '#C9D1D9' }}>Income: ₹{app.income.toLocaleString()}</p>
                    </td>
                    <td className="py-6 px-8">
                      <div className="text-center">
                        <span className="text-2xl font-black" style={{ 
                          color: app.creditScore >= 750 ? '#2ECC71' : app.creditScore >= 650 ? '#F39C12' : '#E74C3C'
                        }}>
                          {app.creditScore}
                        </span>
                        <p className="text-sm font-medium" style={{ color: '#C9D1D9' }}>
                          {app.creditScore >= 750 ? 'Excellent' : app.creditScore >= 650 ? 'Good' : 'Poor'}
                        </p>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <Badge className="px-4 py-2 rounded-xl font-bold text-sm" style={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-6 px-8">
                      <p className="font-medium" style={{ color: '#1E1E1E' }}>{app.applicationDate}</p>
                      <p className="text-sm" style={{ color: '#C9D1D9' }}>Ref: {app.referenceId}</p>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="rounded-xl border-2" style={{ borderColor: '#0047AB', color: '#0047AB' }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl border-2" style={{ borderColor: '#2ECC71', color: '#2ECC71' }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl border-2" style={{ borderColor: '#E74C3C', color: '#E74C3C' }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'applications': return renderApplications();
      case 'analytics': return <div className="text-center py-20"><BarChart3 className="h-20 w-20 mx-auto mb-6" style={{ color: '#C9D1D9' }} /><p className="text-xl font-semibold" style={{ color: '#C9D1D9' }}>Advanced Analytics Dashboard Coming Soon</p></div>;
      case 'documents': return <div className="text-center py-20"><FileText className="h-20 w-20 mx-auto mb-6" style={{ color: '#C9D1D9' }} /><p className="text-xl font-semibold" style={{ color: '#C9D1D9' }}>Document Management System Coming Soon</p></div>;
      case 'compliance': return <div className="text-center py-20"><Shield className="h-20 w-20 mx-auto mb-6" style={{ color: '#C9D1D9' }} /><p className="text-xl font-semibold" style={{ color: '#C9D1D9' }}>RBI Compliance Dashboard Coming Soon</p></div>;
      case 'reports': return <div className="text-center py-20"><PieChart className="h-20 w-20 mx-auto mb-6" style={{ color: '#C9D1D9' }} /><p className="text-xl font-semibold" style={{ color: '#C9D1D9' }}>Advanced Reports & Analytics Coming Soon</p></div>;
      case 'customers': return <div className="text-center py-20"><Building2 className="h-20 w-20 mx-auto mb-6" style={{ color: '#C9D1D9' }} /><p className="text-xl font-semibold" style={{ color: '#C9D1D9' }}>Customer Management Portal Coming Soon</p></div>;
      case 'settings': return <div className="text-center py-20"><Settings className="h-20 w-20 mx-auto mb-6" style={{ color: '#C9D1D9' }} /><p className="text-xl font-semibold" style={{ color: '#C9D1D9' }}>System Settings Panel Coming Soon</p></div>;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-xl border-b-4 p-8" style={{ borderColor: '#0047AB' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                  <span className="text-white font-bold text-2xl">L</span>
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Loanify NBFC</h1>
                  <p className="text-sm font-semibold" style={{ color: '#C9D1D9' }}>Admin Portal</p>
                </div>
              </Link>
              
              <nav className="flex items-center gap-2 ml-8">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === item.id 
                          ? 'text-white shadow-lg' 
                          : 'hover:bg-gray-100'
                      }`}
                      style={activeTab === item.id ? { background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' } : { color: '#1E1E1E' }}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-2 font-semibold rounded-xl" style={{ borderColor: '#C9D1D9', color: '#1E1E1E' }}>
                <RefreshCw className="h-5 w-5 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" className="border-2 font-semibold rounded-xl" style={{ borderColor: '#2ECC71', color: '#2ECC71' }}>
                <Download className="h-5 w-5 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" className="border-2 rounded-xl" style={{ borderColor: '#F39C12', color: '#F39C12' }}>
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="border-2 font-semibold rounded-xl" 
                style={{ borderColor: '#E74C3C', color: '#E74C3C' }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-6" style={{ borderColor: '#0047AB' }}></div>
              <p className="text-xl font-semibold" style={{ color: '#C9D1D9' }}>Loading Dashboard...</p>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
}