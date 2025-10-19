import { applicants } from '@/lib/data';
import ApplicantDetails from '@/components/dashboard/applicant-details';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return applicants.map((applicant) => ({
    id: applicant.id,
  }));
}

export default function ApplicantDetailsPage({ params }: { params: { id: string } }) {
  const applicant = applicants.find((a) => a.id === params.id);

  if (!applicant) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ApplicantDetails applicant={applicant} />
    </div>
  );
}
