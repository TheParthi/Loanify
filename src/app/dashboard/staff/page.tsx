'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  LogOut,
  User,
  Clock
} from 'lucide-react';
import { applicants } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export default function StaffDashboard() {
  // Filter applications assigned to staff (mock - in real app, filter by staff ID)
  const staffApplications = applicants.filter(a => a.status === 'Pending').slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-50 border-r border-blue-100 flex flex-col">
        <div className="p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Loanify" width={320} height={320} className="h-80 w-80" />
            <div>
              <h2 className="font-bold text-gray-900">Loanify</h2>
              <p className="text-xs text-gray-600">Staff Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard/staff" className="flex items-center gap-3 px-4 py-3 bg-blue-100 text-blue-800 rounded-xl font-medium">
            <FileText className="h-5 w-5" />
            My Applications
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">
            <MessageSquare className="h-5 w-5" />
            Comments
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors">
            <CheckCircle className="h-5 w-5" />
            Completed
          </Link>
        </nav>
        
        <div className="p-4 border-t border-blue-100">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
          <p className="text-gray-600">Review and process assigned loan applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assigned Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{staffApplications.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{staffApplications.length}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card className="border-0 shadow-lg rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Assigned Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Applicant Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Eligibility %</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Current Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Assigned By</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffApplications.map((applicant) => (
                    <tr key={applicant.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{applicant.name}</p>
                            <p className="text-sm text-gray-500">{applicant.loanType} Loan</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-blue-600">{applicant.eligibilityScore}%</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getStatusColor(applicant.status)} border rounded-full px-3 py-1`}>
                          {applicant.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-700">Admin</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                            Review Application
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            Add Comment
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 rounded-lg">
                            Mark Complete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {staffApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No applications assigned at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}