'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/use-role';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { role } = useRole();
  useEffect(() => {
    router.replace(`/dashboard/${role}`);
  }, [router, role]);
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Loading…
      </div>
    </div>
  );
}