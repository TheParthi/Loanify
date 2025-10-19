'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { Applicant } from '@/lib/types';

interface AdminDashboardProps {
  applicants: Applicant[];
}

export default function AdminDashboard({
  applicants: initialApplicants,
}: AdminDashboardProps) {
  const [approvalThreshold, setApprovalThreshold] = useState(70);
  const [branchFilter, setBranchFilter] = useState('all');
  const [loanTypeFilter, setLoanTypeFilter] = useState('all');

  const branches = [
    'all',
    ...Array.from(new Set(initialApplicants.map((a) => a.branch))),
  ];
  const loanTypes = [
    'all',
    ...Array.from(new Set(initialApplicants.map((a) => a.loanType))),
  ];

  const filteredApplicants = initialApplicants.filter((applicant) => {
    const branchMatch =
      branchFilter === 'all' || applicant.branch === branchFilter;
    const loanTypeMatch =
      loanTypeFilter === 'all' || applicant.loanType === loanTypeFilter;
    return branchMatch && loanTypeMatch;
  });

  const getStatusBadgeVariant = (status: Applicant['status']) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialApplicants.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {initialApplicants.filter((a) => a.status === 'Approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {initialApplicants.filter((a) => a.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {initialApplicants.filter((a) => a.status === 'Rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applicant Overview</CardTitle>
          <CardDescription>
            View and manage all loan applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Approval Threshold: {approvalThreshold}%</Label>
              <Slider
                defaultValue={[approvalThreshold]}
                max={100}
                step={1}
                onValueChange={(value) => setApprovalThreshold(value[0])}
              />
            </div>
            <div className="space-y-2">
              <Label>Filter by Branch</Label>
              <Select
                value={branchFilter}
                onValueChange={setBranchFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch === 'all' ? 'All Branches' : branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filter by Loan Type</Label>
              <Select
                value={loanTypeFilter}
                onValueChange={setLoanTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a loan type" />
                </SelectTrigger>
                <SelectContent>
                  {loanTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Loan Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Eligibility Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow
                    key={applicant.id}
                    className={
                      applicant.eligibilityScore < approvalThreshold
                        ? 'bg-red-500/10'
                        : 'bg-green-500/10'
                    }
                  >
                    <TableCell>
                      <Link
                        href={`/dashboard/applicants/${applicant.id}`}
                        className="flex items-center gap-2"
                      >
                        <Image
                          src={`https://picsum.photos/seed/${applicant.avatar}/40/40`}
                          alt={applicant.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                          data-ai-hint="person avatar"
                        />
                        <div>
                          <div className="font-medium">{applicant.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {applicant.id}
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{applicant.loanType}</TableCell>
                    <TableCell className="text-right">
                      ${applicant.loanAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div
                        className={
                          applicant.eligibilityScore < approvalThreshold
                            ? 'text-red-500 font-medium'
                            : 'text-green-500 font-medium'
                        }
                      >
                        {applicant.eligibilityScore}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(applicant.status)}>
                        {applicant.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
