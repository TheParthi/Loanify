import { applicants } from '@/lib/data';
import AdminDashboard from '@/components/dashboard/admin-dashboard';

export default function AdminDashboardPage() {
  // In a real app, you would fetch this data from an API
  const allApplicants = applicants;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AdminDashboard applicants={allApplicants} />
    </div>
  );
}
