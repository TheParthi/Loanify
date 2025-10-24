'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, XCircle, Download, FileText, Calendar, Eye, RefreshCw, Award, Building2, Scale } from 'lucide-react';

interface ComplianceCheck {
  category: string;
  status: string;
  score: number;
  requirement: string;
  actual: string;
  lastCheck: string;
}

interface RBIReport {
  type: string;
  dueDate: string;
  status: string;
  submittedOn: string | null;
}

interface AuditFinding {
  id: number;
  category: string;
  severity: string;
  description: string;
  status: string;
  date: string;
}

interface RiskMetrics {
  creditRisk?: number;
  operationalRisk?: number;
  marketRisk?: number;
  liquidityRisk?: number;
  reputationalRisk?: number;
}

interface ComplianceData {
  overallScore?: number;
  capitalAdequacy?: number;
  liquidityRatio?: number;
  npaRatio?: number;
  leverageRatio?: number;
  creditRiskRatio?: number;
  operationalRisk?: number;
  complianceChecks?: ComplianceCheck[];
  rbiReports?: RBIReport[];
  auditFindings?: AuditFinding[];
  riskMetrics?: RiskMetrics;
}

export default function RBICompliance() {
  const [loading, setLoading] = useState(true);
  const [complianceData, setComplianceData] = useState<ComplianceData>({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = () => {
    setLoading(true);
    setTimeout(() => {
      setComplianceData({
        overallScore: 94,
        capitalAdequacy: 18.5,
        liquidityRatio: 5.2,
        npaRatio: 2.1,
        leverageRatio: 12.8,
        creditRiskRatio: 8.3,
        operationalRisk: 3.2,
        complianceChecks: [
          { category: 'Capital Adequacy', status: 'compliant', score: 95, requirement: '≥15%', actual: '18.5%', lastCheck: '2024-01-15' },
          { category: 'Liquidity Coverage', status: 'compliant', score: 92, requirement: '≥4%', actual: '5.2%', lastCheck: '2024-01-15' },
          { category: 'NPA Management', status: 'warning', score: 78, requirement: '≤3%', actual: '2.1%', lastCheck: '2024-01-14' },
          { category: 'Leverage Ratio', status: 'compliant', score: 88, requirement: '≥10%', actual: '12.8%', lastCheck: '2024-01-15' },
          { category: 'Credit Risk', status: 'compliant', score: 91, requirement: '≤10%', actual: '8.3%', lastCheck: '2024-01-15' },
          { category: 'Operational Risk', status: 'compliant', score: 96, requirement: '≤5%', actual: '3.2%', lastCheck: '2024-01-15' },
          { category: 'KYC Compliance', status: 'compliant', score: 98, requirement: '100%', actual: '98.2%', lastCheck: '2024-01-15' },
          { category: 'AML Monitoring', status: 'compliant', score: 94, requirement: '100%', actual: '94.8%', lastCheck: '2024-01-15' },
          { category: 'Data Localization', status: 'compliant', score: 100, requirement: '100%', actual: '100%', lastCheck: '2024-01-15' },
          { category: 'Fair Practices', status: 'compliant', score: 93, requirement: '≥90%', actual: '93.1%', lastCheck: '2024-01-15' }
        ],
        rbiReports: [
          { type: 'Monthly Return', dueDate: '2024-02-15', status: 'submitted', submittedOn: '2024-02-10' },
          { type: 'Quarterly Report', dueDate: '2024-01-31', status: 'submitted', submittedOn: '2024-01-28' },
          { type: 'Annual Report', dueDate: '2024-03-31', status: 'pending', submittedOn: null },
          { type: 'NPA Report', dueDate: '2024-02-20', status: 'submitted', submittedOn: '2024-02-18' },
          { type: 'Capital Adequacy', dueDate: '2024-02-25', status: 'pending', submittedOn: null }
        ],
        auditFindings: [
          { id: 1, category: 'Documentation', severity: 'low', description: 'Minor discrepancies in loan documentation', status: 'resolved', date: '2024-01-10' },
          { id: 2, category: 'Process', severity: 'medium', description: 'Approval workflow optimization needed', status: 'in-progress', date: '2024-01-12' },
          { id: 3, category: 'Compliance', severity: 'low', description: 'Update required in policy documents', status: 'resolved', date: '2024-01-08' }
        ],
        riskMetrics: {
          creditRisk: 8.3,
          operationalRisk: 3.2,
          marketRisk: 1.8,
          liquidityRisk: 2.1,
          reputationalRisk: 1.5
        }
      });
      setLastUpdated(new Date());
      setLoading(false);
    }, 1500);
  };

  const downloadComplianceReport = async () => {
    const { generateProfessionalReport } = await import('@/lib/pdf-generator');
    
    const reportData = {
      referenceId: `RBI_COMP_${Date.now()}`,
      name: 'RBI Compliance Report',
      email: 'compliance@loanify.com',
      mobile: '1800-123-LOAN',
      loanType: 'RBI Compliance Report',
      loanAmount: 0,
      creditScore: 850,
      status: 'approved',
      eligibilityPercentage: complianceData.overallScore || 0,
      recommendedAmount: 0,
      interestRate: 0,
      emi: 0,
      aiReport: `RBI COMPLIANCE ASSESSMENT REPORT\n\nOVERALL COMPLIANCE SCORE: ${complianceData.overallScore || 0}%\n\nKEY METRICS\nCapital Adequacy Ratio: ${complianceData.capitalAdequacy || 0}% (Requirement: ≥15%)\nLiquidity Coverage Ratio: ${complianceData.liquidityRatio || 0}% (Requirement: ≥4%)\nNPA Ratio: ${complianceData.npaRatio || 0}% (Requirement: ≤3%)\nLeverage Ratio: ${complianceData.leverageRatio || 0}% (Requirement: ≥10%)\n\nCOMPLIANCE STATUS\n${complianceData.complianceChecks?.filter(check => check.status === 'compliant').length || 0} Compliant Areas\n${complianceData.complianceChecks?.filter(check => check.status === 'warning').length || 0} Areas Requiring Attention\n${complianceData.complianceChecks?.filter(check => check.status === 'non-compliant').length || 0} Non-Compliant Areas\n\nRISK ASSESSMENT\nCredit Risk: ${complianceData.riskMetrics?.creditRisk || 0}%\nOperational Risk: ${complianceData.riskMetrics?.operationalRisk || 0}%\nMarket Risk: ${complianceData.riskMetrics?.marketRisk || 0}%\nLiquidity Risk: ${complianceData.riskMetrics?.liquidityRisk || 0}%\n\nRBI REPORTING STATUS\n${complianceData.rbiReports?.filter(report => report.status === 'submitted').length || 0} Reports Submitted On Time\n${complianceData.rbiReports?.filter(report => report.status === 'pending').length || 0} Reports Pending\n\nCOMPLIANCE SUMMARY\nLoanify NBFC maintains excellent compliance with RBI guidelines and regulations. All critical parameters are within acceptable limits. Regular monitoring and proactive risk management ensure continued regulatory adherence.`,
      applicationDate: new Date().toISOString(),
      tenure: '0',
      branch: 'Head Office',
      officer: 'Chief Compliance Officer',
      priority: 'High',
      processingTime: 0,
      documents: ['RBI License', 'Compliance Certificate', 'Audit Report', 'Risk Assessment']
    };
    
    generateProfessionalReport(reportData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return { bg: '#E8F6F3', text: '#2ECC71', border: '#2ECC71' };
      case 'warning': return { bg: '#FEF3E2', text: '#F39C12', border: '#F39C12' };
      case 'non-compliant': return { bg: '#FEF2F2', text: '#E74C3C', border: '#E74C3C' };
      default: return { bg: '#F4F6F8', text: '#64748B', border: '#64748B' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'non-compliant': return <XCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-6" style={{ borderColor: '#0047AB' }}></div>
          <p className="text-xl font-semibold" style={{ color: '#64748B' }}>Loading RBI Compliance Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#1E1E1E' }}>RBI Compliance Dashboard</h1>
            <p className="text-lg" style={{ color: '#64748B' }}>Regulatory compliance monitoring and reporting</p>
            <p className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={loadComplianceData}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              onClick={downloadComplianceReport}
              className="text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overall Compliance Score */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-green-600 to-green-700 text-white mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Compliance Score</h2>
                <div className="text-6xl font-bold mb-4">{complianceData.overallScore}%</div>
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  <span className="text-lg">Excellent Compliance Status</span>
                </div>
              </div>
              <div className="text-right">
                <Shield className="h-24 w-24 text-green-200 mb-4" />
                <p className="text-green-100">RBI Guidelines Adherence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
                <Badge className="bg-green-100 text-green-700">Compliant</Badge>
              </div>
              <h3 className="font-semibold text-gray-600 mb-2">Capital Adequacy</h3>
              <div className="text-3xl font-bold text-blue-600">{complianceData.capitalAdequacy}%</div>
              <p className="text-sm text-gray-500">Requirement: ≥15%</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Scale className="h-8 w-8 text-green-600" />
                <Badge className="bg-green-100 text-green-700">Compliant</Badge>
              </div>
              <h3 className="font-semibold text-gray-600 mb-2">Liquidity Ratio</h3>
              <div className="text-3xl font-bold text-green-600">{complianceData.liquidityRatio}%</div>
              <p className="text-sm text-gray-500">Requirement: ≥4%</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700">Monitor</Badge>
              </div>
              <h3 className="font-semibold text-gray-600 mb-2">NPA Ratio</h3>
              <div className="text-3xl font-bold text-orange-600">{complianceData.npaRatio}%</div>
              <p className="text-sm text-gray-500">Requirement: ≤3%</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
                <Badge className="bg-green-100 text-green-700">Compliant</Badge>
              </div>
              <h3 className="font-semibold text-gray-600 mb-2">Leverage Ratio</h3>
              <div className="text-3xl font-bold text-purple-600">{complianceData.leverageRatio}%</div>
              <p className="text-sm text-gray-500">Requirement: ≥10%</p>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Checks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.complianceChecks?.map((check, index) => {
                  const statusStyle = getStatusColor(check.status);
                  return (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border" style={{ backgroundColor: statusStyle.bg, borderColor: statusStyle.border }}>
                      <div className="flex items-center gap-3">
                        <div style={{ color: statusStyle.text }}>
                          {getStatusIcon(check.status)}
                        </div>
                        <div>
                          <p className="font-semibold">{check.category}</p>
                          <p className="text-sm text-gray-600">Last checked: {check.lastCheck}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: statusStyle.text }}>{check.score}%</div>
                        <p className="text-xs text-gray-500">{check.actual} / {check.requirement}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                RBI Reporting Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.rbiReports?.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-semibold">{report.type}</p>
                      <p className="text-sm text-gray-600">Due: {report.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`mb-2 ${report.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {report.status}
                      </Badge>
                      {report.submittedOn && (
                        <p className="text-xs text-gray-500">Submitted: {report.submittedOn}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Metrics & Audit Findings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(complianceData.riskMetrics || {}).map(([risk, value], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium capitalize">{risk.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${value <= 3 ? 'bg-green-500' : value <= 6 ? 'bg-orange-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(value * 10, 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-lg w-12 text-right">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-6 w-6 text-purple-600" />
                Recent Audit Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.auditFindings?.map((finding) => (
                  <div key={finding.id} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${finding.severity === 'high' ? 'bg-red-100 text-red-700' : finding.severity === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {finding.severity} severity
                      </Badge>
                      <Badge variant="outline" className={`${finding.status === 'resolved' ? 'border-green-500 text-green-600' : 'border-orange-500 text-orange-600'}`}>
                        {finding.status}
                      </Badge>
                    </div>
                    <p className="font-semibold mb-1">{finding.category}</p>
                    <p className="text-sm text-gray-600 mb-2">{finding.description}</p>
                    <p className="text-xs text-gray-500">Date: {finding.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}