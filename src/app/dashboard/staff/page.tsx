import { applicants } from '@/lib/data';
import StaffDashboard from '@/components/dashboard/staff-dashboard';

export default function StaffDashboardPage() {
  // In a real app, you would fetch data for the logged-in staff's branch
  const staffApplicants = applicants.filter(a => a.branch === 'New York');

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <StaffDashboard applicants={staffApplicants} />
    </div>
  );
}
