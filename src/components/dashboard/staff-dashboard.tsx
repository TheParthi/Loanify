'use client';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';
import type { Applicant } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface StaffDashboardProps {
  applicants: Applicant[];
}

export default function StaffDashboard({
  applicants: staffApplicants,
}: StaffDashboardProps) {
  
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Staff Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2" />
              Upload Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Application</DialogTitle>
              <DialogDescription>
                Fill in the applicant's details to submit a new loan application.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Applicant Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Application Document</Label>
                <Input id="file" type="file" />
              </div>
              <Button className="w-full">Submit Application</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Branch Applicants</CardTitle>
          <CardDescription>
            Track the status of applications in your branch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead className="text-right">Eligibility Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
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
                    <TableCell>{applicant.applicationDate}</TableCell>
                    <TableCell className="text-right font-medium">
                      {applicant.eligibilityScore}%
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
