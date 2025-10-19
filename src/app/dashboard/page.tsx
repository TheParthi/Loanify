'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin');
  }, [router]);

  return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-96 w-full" />
      </div>
  );
}
