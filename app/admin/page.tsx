'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { ShieldCheck, AlertOctagon, CheckSquare, Users, Building, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-amber-600" /> Admin Overview
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          System health, moderator queue sizes, and quick management shortcuts.
        </p>
      </div>

      <StateWrapper>
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-amber-500/5 border-amber-500/20 dark:border-amber-500/10">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Pending Questions</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-foreground">8</span>
              <Badge variant="warning" className="text-[9px]">Moderate</Badge>
            </div>
          </Card>

          <Card className="p-4 bg-card/60">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Flagged Answers</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-foreground">3</span>
              <Badge variant="destructive" className="text-[9px]">Critical</Badge>
            </div>
          </Card>

          <Card className="p-4 bg-card/60">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Users</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-foreground">248</span>
              <span className="text-xs text-muted-foreground">+12 today</span>
            </div>
          </Card>

          <Card className="p-4 bg-card/60">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">System Status</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">99.98%</span>
              <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            </div>
          </Card>
        </div>

        {/* Admin Shortcut Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all cursor-pointer">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Users className="h-4 w-4 text-violet-600" /> Users Queue
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Inspect accounts, view login histories, change user roles, or temporarily ban accounts.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link href="/admin/users">
                <Button size="xs" variant="outline" className="w-full">Manage Users</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all cursor-pointer">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-emerald-600" /> Question Queue
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Approve newly posted questions, verify duplicate warnings, or edit tags.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link href="/admin/questions">
                <Button size="xs" variant="outline" className="w-full">Moderation Queue</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all cursor-pointer">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Building className="h-4 w-4 text-indigo-600" /> Companies Queue
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add new company profiles, update descriptions, logo tags, or rating scores.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link href="/admin/companies">
                <Button size="xs" variant="outline" className="w-full">Manage Companies</Button>
              </Link>
            </div>
          </Card>
        </div>
      </StateWrapper>
    </div>
  );
}
