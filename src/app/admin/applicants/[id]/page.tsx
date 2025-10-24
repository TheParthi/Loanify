import ClientApplicantView from './client-page';

export async function generateStaticParams() {
  return [
    { id: 'LA001' },
    { id: 'LA002' }
  ];
}

export default async function ApplicantView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientApplicantView id={id} />;
}