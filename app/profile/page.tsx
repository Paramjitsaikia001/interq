'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Loader2 } from 'lucide-react';

export default function ProfileRedirect() {
  const router = useRouter();
  const { currentUser, userRole } = useSimulationStore();

  React.useEffect(() => {
    if (userRole === 'guest') {
      router.push('/auth/login');
    } else {
      router.push(`/profile/${currentUser?.id || 'u2'}`);
    }
  }, [currentUser, userRole, router]);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Redirecting to profile...</span>
    </div>
  );
}
