'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  LayoutDashboard, Users, Shield, LogOut, Bell, Search, Download, TrendingUp, DollarSign, 
  Clock, CheckCircle, BarChart3, Eye, Edit, RefreshCw, ArrowUpRight, Target, Timer, 
  FileCheck, Upload, FileText, AlertTriangle, X, Check, XCircle, Activity, PieChart,
  Settings, CreditCard, Building2, Phone, Mail, Calendar, Filter, Plus, Trash2,
  MapPin, Globe, Zap, Award, Star, ThumbsUp, MessageSquare, UserCheck, Briefcase,
  TrendingDown, AlertCircle, ChevronRight, ChevronDown, ExternalLink, Copy, Share2
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [realTimeData, setRealTimeData] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('today');
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
    loadRealTimeData();
    loadNotifications();
    
    const interval = setInterval(() => {
      fetchApplications();
      loadRealTimeData();
    }, 5000);
    
    return () => clearInterval(interval);
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
        status: app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Under Review',
        loanType: app.loan_type || 'Personal Loan',
        applicationDate: new Date(app.created_at).toLocaleDateString(),
        referenceId: `LN${String(app.id).padStart(6, '0')}`,
        riskCategory: app.credit_score >= 750 ? 'Low Risk' : app.credit_score >= 650 ? 'Medium Risk' : 'High Risk',
        processingTime: Math.floor(Math.random() * 48) + 1,
        documents: app.documents || [],
        branch: app.branch || 'Mumbai Central',
        officer: app.officer || 'Rajesh Sharma',
        priority: app.priority || 'Normal',
        lastActivity: new Date(Date.now() - Math.random() * 86400000).toLocaleString()
      })));
    } catch (error) {
      setApplications([
        {
          id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', mobile: '9876543210',
          loanAmount: 500000, income: 75000, creditScore: 750, status: 'Approved', 
          loanType: 'Personal Loan', applicationDate: '2024-01-15', referenceId: 'LN000001', 
          riskCategory: 'Low Risk', processingTime: 24, documents: ['Aadhaar', 'PAN', 'Salary Slip'],
          branch: 'Mumbai Central', officer: 'Rajesh Sharma', priority: 'High',
          lastActivity: '2024-01-15 14:30:00'
        },
        {
          id: 2, name: 'Priya Sharma', email: 'priya@email.com', mobile: '9876543211',
          loanAmount: 1000000, income: 120000, creditScore: 680, status: 'Under Review',
          loanType: 'Business Loan', applicationDate: '2024-01-16', referenceId: 'LN000002',
          riskCategory: 'Medium Risk', processingTime: 36, documents: ['Aadhaar', 'Business License'],
          branch: 'Delhi NCR', officer: 'Amit Singh', priority: 'Normal',
          lastActivity: '2024-01-16 10:15:00'
        },
        {
          id: 3, name: 'Amit Patel', email: 'amit@email.com', mobile: '9876543212',
          loanAmount: 300000, income: 45000, creditScore: 620, status: 'Rejected',
          loanType: 'Vehicle Loan', applicationDate: '2024-01-17', referenceId: 'LN000003',
          riskCategory: 'High Risk', processingTime: 12, documents: ['Aadhaar'],
          branch: 'Bangalore', officer: 'Sneha Reddy', priority: 'Low',
          lastActivity: '2024-01-17 09:45:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = () => {
    setRealTimeData({
      activeUsers: Math.floor(Math.random() * 50) + 100,
      serverLoad: Math.floor(Math.random() * 30) + 40,
      responseTime: Math.floor(Math.random() * 100) + 150,
      uptime: '99.9%',
      todayApplications: Math.floor(Math.random() * 20) + 45,
      pendingApprovals: Math.floor(Math.random() * 10) + 15,
      systemAlerts: Math.floor(Math.random() * 3) + 1
    });
  };

  const loadNotifications = () => {
    setNotifications([
      { id: 1, type: 'urgent', message: 'High-value loan application requires immediate review', time: '5 min ago', priority: 'high' },
      { id: 2, type: 'success', message: 'Monthly RBI compliance report submitted successfully', time: '1 hour ago', priority: 'medium' },
      { id: 3, type: 'warning', message: 'System maintenance scheduled for tonight 2:00 AM', time: '2 hours ago', priority: 'medium' },
      { id: 4, type: 'info', message: 'New KYC verification guidelines updated', time: '4 hours ago', priority: 'low' },
      { id: 5, type: 'error', message: 'Document verification failed for 3 applications', time: '6 hours ago', priority: 'high' }
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/');
  };

  const handleViewApplication = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleApproveApplication = (appId) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: 'Approved', lastActivity: new Date().toLocaleString() } : app
    ));
    const newNotif = {
      id: Date.now(),
      type: 'success',
      message: `Application ${applications.find(a => a.id === appId)?.referenceId} approved successfully`,
      time: 'Just now',
      priority: 'medium'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleRejectApplication = (appId) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: 'Rejected', lastActivity: new Date().toLocaleString() } : app
    ));
    const newNotif = {
      id: Date.now(),
      type: 'error',
      message: `Application ${applications.find(a => a.id === appId)?.referenceId} rejected`,
      time: 'Just now',
      priority: 'medium'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleDownloadReport = async (app) => {
    try {
      // Try backend first
      const response = await fetch(`http://localhost:8081/report/${app.referenceId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Loanify_Admin_Report_${app.referenceId}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }
    } catch (error) {
      console.log('Backend unavailable, generating professional PDF');
    }

    // Use professional PDF generator
    const { generateProfessionalReport } = await import('@/lib/pdf-generator');
    
    const applicantData = {
      referenceId: app.referenceId,
      name: app.name,
      email: app.email,
      mobile: app.mobile,
      employmentType: 'salaried',
      income: app.income,
      loanAmount: app.loanAmount,
      creditScore: app.creditScore,
      status: app.status.toLowerCase(),
      eligibilityPercentage: app.creditScore >= 750 ? 95 : app.creditScore >= 650 ? 75 : 45,
      recommendedAmount: app.loanAmount,
      interestRate: app.creditScore >= 750 ? 10.5 : app.creditScore >= 650 ? 12.5 : 15.5,
      emi: Math.round((app.loanAmount * (app.creditScore >= 750 ? 10.5 : 12.5) / 12 / 100 * Math.pow(1 + (app.creditScore >= 750 ? 10.5 : 12.5) / 12 / 100, 36)) / (Math.pow(1 + (app.creditScore >= 750 ? 10.5 : 12.5) / 12 / 100, 36) - 1)),
      aiReport: `Professional assessment completed for ${app.name}. Credit score: ${app.creditScore}. Risk category: ${app.riskCategory}. Processing time: ${app.processingTime} hours.`,
      applicationDate: app.applicationDate,
      loanType: app.loanType,
      riskCategory: app.riskCategory,
      branch: app.branch,
      officer: app.officer,
      priority: app.priority,
      processingTime: app.processingTime,
      documents: app.documents,
      tenure: '36'
    };
    
    generateProfessionalReport(applicantData);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Reference ID', 'Name', 'Email', 'Mobile', 'Loan Amount', 'Credit Score', 'Status', 'Application Date', 'Branch', 'Officer'],
      ...filteredApplications.map(app => [
        app.referenceId,
        app.name,
        app.email,
        app.mobile,
        app.loanAmount,
        app.creditScore,
        app.status,
        app.applicationDate,
        app.branch,
        app.officer
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Loanify_Applications_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateRBIReport = async () => {
    const { generateProfessionalReport } = await import('@/lib/pdf-generator');
    
    const rbiReportData = {
      referenceId: `RBI_RPT_${Date.now()}`,
      name: 'RBI Compliance Report',
      email: 'compliance@loanify.com',
      mobile: '1800-123-LOAN',
      loanType: 'Compliance Report',
      loanAmount: totalLoanValue,
      creditScore: 850,
      status: 'approved',
      eligibilityPercentage: complianceScore,
      recommendedAmount: totalLoanValue,
      interestRate: 0,
      emi: 0,
      aiReport: `RBI COMPLIANCE REPORT\n\nTotal Applications: ${totalApplicants}\nApproved: ${approved} (${approvalRate}%)\nPending: ${pending}\nRejected: ${rejected}\n\nPortfolio Value: ₹${(totalLoanValue / 10000000).toFixed(1)} Crores\nCompliance Score: ${complianceScore}%\nAvg Processing Time: ${avgProcessingTime} hours\n\nHigh Risk Loans: ${highRiskLoans}\nRBI Guidelines Adherence: 100%\nCapital Adequacy Ratio: 18.5%\nLiquidity Coverage Ratio: 5.2%\nNPA Ratio: 2.1%\n\nAll operations conducted in compliance with RBI Master Directions on NBFC operations and Fair Practices Code.`,
      applicationDate: new Date().toISOString(),
      tenure: '0',
      branch: 'Head Office',
      officer: 'Compliance Officer',
      priority: 'High',
      processingTime: 0,
      documents: ['RBI License', 'Compliance Certificate', 'Audit Report']
    };
    
    generateProfessionalReport(rbiReportData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return { backgroundColor: '#E8F6F3', color: '#2ECC71', borderColor: '#2ECC71' };
      case 'Rejected': return { backgroundColor: '#FEF2F2', color: '#E74C3C', borderColor: '#E74C3C' };
      case 'Under Review': return { backgroundColor: '#FEF3E2', color: '#F39C12', borderColor: '#F39C12' };
      default: return { backgroundColor: '#F4F6F8', color: '#C9D1D9', borderColor: '#C9D1D9' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#E74C3C';
      case 'Medium': return '#F39C12';
      case 'Normal': return '#2ECC71';
      case 'Low': return '#95A5A6';
      default: return '#C9D1D9';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low Risk': return '#2ECC71';
      case 'Medium Risk': return '#F39C12';
      case 'High Risk': return '#E74C3C';
      default: return '#C9D1D9';
    }
  };

  const totalApplicants = applications.length;
  const approved = applications.filter(a => a.status === 'Approved').length;
  const pending = applications.filter(a => a.status === 'Under Review').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const totalLoanValue = applications.filter(a => a.status === 'Approved').reduce((sum, a) => sum + a.loanAmount, 0);
  const approvalRate = totalApplicants > 0 ? Math.round((approved / totalApplicants) * 100) : 0;
  const avgProcessingTime = applications.length > 0 ? Math.round(applications.reduce((sum, a) => sum + a.processingTime, 0) / applications.length) : 0;
  const highRiskLoans = applications.filter(a => a.riskCategory === 'High Risk').length;
  const complianceScore = Math.max(0, 100 - (highRiskLoans * 5) - (pending * 2));

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.mobile.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Real-time System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold">{realTimeData.activeUsers}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-100">Live</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">System Uptime</p>
                  <p className="text-2xl font-bold">{realTimeData.uptime}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3 text-green-300" />
                    <span className="text-xs text-green-100">Healthy</span>
                  </div>
                </div>
                <Zap className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Response Time</p>
                  <p className="text-2xl font-bold">{realTimeData.responseTime}ms</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Timer className="w-3 h-3 text-orange-300" />
                    <span className="text-xs text-orange-100">Optimal</span>
                  </div>
                </div>
                <Globe className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Today's Apps</p>
                  <p className="text-2xl font-bold">{realTimeData.todayApplications}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-purple-300" />
                    <span className="text-xs text-purple-100">+15%</span>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced KPI Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2" style={{ color: '#1E1E1E' }}>
                  <BarChart3 className="h-6 w-6" style={{ color: '#0047AB' }} />
                  Portfolio Performance Analytics
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    Last 30 Days
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                  <p className="text-2xl font-bold text-blue-800">{totalApplicants}</p>
                  <p className="text-sm font-medium text-blue-600">Total Applications</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">+12%</span>
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                  <p className="text-2xl font-bold text-green-800">{approvalRate}%</p>
                  <p className="text-sm font-medium text-green-600">Approval Rate</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Target className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Target: 75%</span>
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
                  <p className="text-2xl font-bold text-orange-800">{avgProcessingTime}h</p>
                  <p className="text-sm font-medium text-orange-600">Avg Processing</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-orange-600" />
                    <span className="text-xs text-orange-600">SLA: 48h</span>
                  </div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                  <p className="text-2xl font-bold text-purple-800">₹{(totalLoanValue / 10000000).toFixed(1)}Cr</p>
                  <p className="text-sm font-medium text-purple-600">Portfolio Value</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-purple-600">+18%</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-600">Interactive Chart</p>
                  <p className="text-sm text-gray-500">Real-time portfolio analytics visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2" style={{ color: '#1E1E1E' }}>
                <Shield className="h-5 w-5" style={{ color: '#0047AB' }} />
                RBI Compliance Monitor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border-l-4" style={{ backgroundColor: '#E8F6F3', borderColor: '#2ECC71' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm" style={{ color: '#1E1E1E' }}>Compliance Score</span>
                  <span className="text-2xl font-bold text-green-600">{complianceScore}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${complianceScore}%` }}></div>
                </div>
                <p className="text-xs mt-2 text-green-700">Excellent compliance status</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Capital Adequacy</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">18.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Liquidity Ratio</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">5.2%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">NPA Ratio</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">2.1%</span>
                </div>
              </div>
              
              <Button 
                className="w-full text-white font-medium" 
                style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
                onClick={() => handleGenerateRBIReport()}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate RBI Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Priority Applications Queue */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2" style={{ color: '#1E1E1E' }}>
                <AlertTriangle className="h-6 w-6" style={{ color: '#F39C12' }} />
                Priority Applications Queue
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="px-3 py-1 bg-red-100 text-red-700 font-semibold">
                  {applications.filter(a => a.priority === 'High' && a.status === 'Under Review').length} Urgent
                </Badge>
                <Button size="sm" onClick={() => setActiveTab('applications')} className="text-white" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                  View All Applications
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applications.filter(a => a.status === 'Under Review').slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-300 cursor-pointer" 
                     style={{ backgroundColor: '#F8FAFC', borderColor: app.priority === 'High' ? '#E74C3C' : '#E2E8F0' }}
                     onClick={() => handleViewApplication(app)}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                        <span className="font-bold text-white">{app.name.charAt(0)}</span>
                      </div>
                      {app.priority === 'High' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold" style={{ color: '#1E1E1E' }}>{app.name}</p>
                        <Badge className="px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${getPriorityColor(app.priority)}20`, color: getPriorityColor(app.priority) }}>
                          {app.priority}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium" style={{ color: '#0047AB' }}>{app.referenceId} • {app.loanType}</p>
                      <p className="text-sm" style={{ color: '#64748B' }}>₹{app.loanAmount.toLocaleString()} • {app.branch}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>Processing Time</p>
                      <p className="font-bold" style={{ color: app.processingTime > 24 ? '#E74C3C' : '#2ECC71' }}>
                        {app.processingTime}h
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onClick={(e) => { e.stopPropagation(); handleApproveApplication(app.id); }}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleRejectApplication(app.id); }}>
                        <X className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderApplications = () => {
    return (
      <div className="space-y-6">
        {/* Advanced Filters & Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-0">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#1E1E1E' }}>Application Management Center</h2>
              <p className="text-sm" style={{ color: '#64748B' }}>Advanced loan application processing and monitoring system</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#64748B' }} />
                <Input 
                  placeholder="Search by name, ID, mobile, email..." 
                  className="pl-10 w-80 h-10 border-2 rounded-lg" 
                  style={{ borderColor: '#E2E8F0' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="h-10 px-3 border-2 rounded-lg text-sm font-medium"
                style={{ borderColor: '#E2E8F0', color: '#1E1E1E' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <Button 
                className="text-white font-medium" 
                style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
                onClick={() => handleExportCSV()}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                className="text-white font-medium" 
                style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}
                onClick={() => handleGenerateRBIReport()}
              >
                <FileText className="h-4 w-4 mr-2" />
                RBI Report PDF
              </Button>
              <Button className="text-white font-medium" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2" style={{ borderColor: '#E2E8F0' }}>
                    <th className="text-left py-4 px-6 font-bold text-sm" style={{ color: '#1E1E1E' }}>Application Details</th>
                    <th className="text-left py-4 px-6 font-bold text-sm" style={{ color: '#1E1E1E' }}>Applicant Information</th>
                    <th className="text-left py-4 px-6 font-bold text-sm" style={{ color: '#1E1E1E' }}>Loan & Risk Assessment</th>
                    <th className="text-left py-4 px-6 font-bold text-sm" style={{ color: '#1E1E1E' }}>Processing Status</th>
                    <th className="text-left py-4 px-6 font-bold text-sm" style={{ color: '#1E1E1E' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50 transition-all duration-200" style={{ borderColor: '#F1F5F9' }}>
                      <td className="py-6 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm" style={{ color: '#0047AB' }}>{app.referenceId}</p>
                            <Badge className="px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${getPriorityColor(app.priority)}20`, color: getPriorityColor(app.priority) }}>
                              {app.priority}
                            </Badge>
                          </div>
                          <p className="text-xs font-medium" style={{ color: '#64748B' }}>{app.applicationDate}</p>
                          <p className="text-xs" style={{ color: '#64748B' }}>Branch: {app.branch}</p>
                          <p className="text-xs" style={{ color: '#64748B' }}>Officer: {app.officer}</p>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                            {app.name.charAt(0)}
                          </div>
                          <div className="space-y-1">
                            <p className="font-bold text-sm" style={{ color: '#1E1E1E' }}>{app.name}</p>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" style={{ color: '#64748B' }} />
                              <p className="text-xs" style={{ color: '#64748B' }}>{app.mobile}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" style={{ color: '#64748B' }} />
                              <p className="text-xs" style={{ color: '#64748B' }}>{app.email}</p>
                            </div>
                            <p className="text-xs" style={{ color: '#64748B' }}>Income: ₹{app.income.toLocaleString()}/mo</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="space-y-2">
                          <div>
                            <p className="font-bold text-sm" style={{ color: '#1E1E1E' }}>{app.loanType}</p>
                            <p className="font-bold text-lg" style={{ color: '#0047AB' }}>₹{app.loanAmount.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-center">
                              <p className="text-lg font-bold" style={{ color: app.creditScore >= 750 ? '#2ECC71' : app.creditScore >= 650 ? '#F39C12' : '#E74C3C' }}>
                                {app.creditScore}
                              </p>
                              <p className="text-xs" style={{ color: '#64748B' }}>Credit Score</p>
                            </div>
                            <div>
                              <Badge className="px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${getRiskColor(app.riskCategory)}20`, color: getRiskColor(app.riskCategory) }}>
                                {app.riskCategory}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="space-y-2">
                          <Badge className="px-3 py-1 font-medium text-xs" style={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                          <div className="text-xs" style={{ color: '#64748B' }}>
                            <p>Processing: {app.processingTime}h</p>
                            <p>Last Activity: {app.lastActivity}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {app.documents.map((doc, idx) => (
                              <div key={idx} className="w-2 h-2 rounded-full bg-green-500" title={doc}></div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 text-xs" onClick={() => handleViewApplication(app)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-500 text-gray-600 hover:bg-gray-50 text-xs">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                          {app.status === 'Under Review' && (
                            <div className="flex items-center gap-1">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs" onClick={() => handleApproveApplication(app.id)}>
                                <Check className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs" onClick={() => handleRejectApplication(app.id)}>
                                <X className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
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
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'applications': return renderApplications();
      case 'documents': return <div className="text-center py-20"><Upload className="h-20 w-20 mx-auto mb-6" style={{ color: '#C9D1D9' }} /><p className="text-xl font-semibold" style={{ color: '#C9D1D9' }}>Advanced Document Management Coming Soon</p></div>;
      case 'analytics': 
        router.push('/dashboard/analytics');
        return null;
      case 'compliance': 
        router.push('/dashboard/compliance');
        return null;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Professional Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-xl border-b sticky top-0 z-50" style={{ borderColor: '#0047AB' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <Image 
                  src="https://i.postimg.cc/MGyDGd6p/Create-a-modern-minimalist-logo-icon-for-a-fintech-AI-platform-focused-on-smart-loan-approvals-and.png" 
                  alt="Loanify Logo" 
                  width={48} 
                  height={48} 
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Loanify NBFC</h1>
                  <p className="text-xs font-semibold text-gray-500">Professional Admin Suite</p>
                </div>
              </Link>
              
              <nav className="flex items-center gap-1">
                {[
                  { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
                  { id: 'applications', label: 'Application Center', icon: Users },
                  { id: 'documents', label: 'Document Hub', icon: Upload },
                  { id: 'analytics', label: 'Business Intelligence', icon: BarChart3 },
                  { id: 'compliance', label: 'RBI Compliance', icon: Shield }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm ${
                        activeTab === item.id 
                          ? 'text-white shadow-lg transform scale-105 bg-gradient-to-r from-blue-600 to-blue-700' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700">System Online</span>
              </div>
              
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative border-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {notifications.length}
                    </span>
                  )}
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border-2 z-50" style={{ borderColor: '#E2E8F0' }}>
                    <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50" style={{ borderColor: '#F1F5F9' }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg" style={{ color: '#1E1E1E' }}>System Notifications</h3>
                        <Badge className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold">
                          {notifications.filter(n => n.priority === 'high').length} Critical
                        </Badge>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#F1F5F9' }}>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {notif.type === 'urgent' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                              {notif.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                              {notif.type === 'warning' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                              {notif.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                              {notif.type === 'info' && <Bell className="h-5 w-5 text-blue-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold" style={{ color: '#1E1E1E' }}>{notif.message}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs" style={{ color: '#64748B' }}>{notif.time}</p>
                                <Badge className="px-2 py-1 text-xs" style={{ 
                                  backgroundColor: notif.priority === 'high' ? '#FEE2E2' : notif.priority === 'medium' ? '#FEF3C7' : '#F0F9FF',
                                  color: notif.priority === 'high' ? '#DC2626' : notif.priority === 'medium' ? '#D97706' : '#2563EB'
                                }}>
                                  {notif.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-50">
                      <Button className="w-full text-white font-medium" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                        View All Notifications
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm" 
                className="border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Secure Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-6" style={{ borderColor: '#0047AB' }}></div>
            <p className="text-xl font-semibold" style={{ color: '#64748B' }}>Loading Professional Dashboard...</p>
          </div>
        ) : (
          renderContent()
        )}
      </main>

      {/* Enhanced Application Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: '#1E1E1E' }}>Application Details</h3>
                  <p className="text-sm font-medium" style={{ color: '#64748B' }}>Comprehensive loan application review</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-600 mb-1">Reference ID</p>
                      <p className="font-bold text-lg text-blue-800">{selectedApp.referenceId}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                      <p className="text-sm font-semibold text-green-600 mb-1">Application Date</p>
                      <p className="font-bold text-lg text-green-800">{selectedApp.applicationDate}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                      <p className="text-sm font-semibold text-purple-600 mb-1">Loan Amount</p>
                      <p className="font-bold text-lg text-purple-800">₹{selectedApp.loanAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                      <p className="text-sm font-semibold text-orange-600 mb-1">Credit Score</p>
                      <p className="font-bold text-lg text-orange-800">{selectedApp.creditScore}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                    <h4 className="font-bold text-lg mb-4" style={{ color: '#1E1E1E' }}>Applicant Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#64748B' }}>Full Name</p>
                        <p className="font-semibold" style={{ color: '#1E1E1E' }}>{selectedApp.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#64748B' }}>Mobile Number</p>
                        <p className="font-semibold" style={{ color: '#1E1E1E' }}>{selectedApp.mobile}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#64748B' }}>Email Address</p>
                        <p className="font-semibold" style={{ color: '#1E1E1E' }}>{selectedApp.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#64748B' }}>Monthly Income</p>
                        <p className="font-semibold" style={{ color: '#1E1E1E' }}>₹{selectedApp.income.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border-2" style={{ borderColor: '#E2E8F0' }}>
                    <h4 className="font-bold mb-3" style={{ color: '#1E1E1E' }}>Processing Status</h4>
                    <Badge className="px-3 py-2 font-semibold mb-3" style={getStatusColor(selectedApp.status)}>
                      {selectedApp.status}
                    </Badge>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Processing Time:</span> {selectedApp.processingTime}h</p>
                      <p><span className="font-semibold">Branch:</span> {selectedApp.branch}</p>
                      <p><span className="font-semibold">Officer:</span> {selectedApp.officer}</p>
                      <p><span className="font-semibold">Priority:</span> 
                        <Badge className="ml-2 px-2 py-1 text-xs" style={{ backgroundColor: `${getPriorityColor(selectedApp.priority)}20`, color: getPriorityColor(selectedApp.priority) }}>
                          {selectedApp.priority}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white border-2" style={{ borderColor: '#E2E8F0' }}>
                    <h4 className="font-bold mb-3" style={{ color: '#1E1E1E' }}>Documents</h4>
                    <div className="space-y-2">
                      {selectedApp.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6 border-t" style={{ borderColor: '#F1F5F9' }}>
                {selectedApp.status === 'Under Review' && (
                  <>
                    <Button 
                      className="flex-1 text-white font-semibold py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" 
                      onClick={() => {
                        handleApproveApplication(selectedApp.id);
                        setShowModal(false);
                      }}
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Approve Application
                    </Button>
                    <Button 
                      className="flex-1 text-white font-semibold py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800" 
                      onClick={() => {
                        handleRejectApplication(selectedApp.id);
                        setShowModal(false);
                      }}
                    >
                      <X className="h-5 w-5 mr-2" />
                      Reject Application
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  className="border-2 font-semibold py-3" 
                  style={{ borderColor: '#0047AB', color: '#0047AB' }}
                  onClick={() => handleDownloadReport(selectedApp)}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Generate Report
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 font-semibold py-3" 
                  style={{ borderColor: '#64748B', color: '#64748B' }}
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}