'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit3, Share2, Mail } from 'lucide-react';
import { useSimulationStore } from '@/lib/state-store';

export function ProfileActions({ userId, userEmail }: { userId: string; userEmail: string }) {
  const { currentUser } = useSimulationStore();
  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="flex items-center gap-3">
      {isOwnProfile ? (
        <Link href="/profile/edit">
          <Button className="bg-[#0f52ba] hover:bg-[#0f52ba]/90 text-white rounded-md px-6 font-semibold flex items-center gap-2 h-10 shadow-sm">
            <Edit3 className="h-4 w-4" /> Edit Profile
          </Button>
        </Link>
      ) : (
        <a href={`mailto:${userEmail}`}>
          <Button className="bg-[#0f52ba] hover:bg-[#0f52ba]/90 text-white rounded-md px-6 font-semibold flex items-center gap-2 h-10 shadow-sm">
            <Mail className="h-4 w-4" /> Contact
          </Button>
        </a>
      )}
      
      <Button variant="outline" className="rounded-md px-6 font-semibold flex items-center gap-2 h-10 border-border shadow-sm text-foreground hover:bg-muted/50">
        <Share2 className="h-4 w-4" /> Share
      </Button>
    </div>
  );
}
