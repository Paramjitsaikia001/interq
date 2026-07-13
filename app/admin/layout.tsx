'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, 
  Users, 
  CheckSquare, 
  Building, 
  BarChart3, 
  Lock,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userRole } = useSimulationStore();

  if (userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
        <div className="p-4 bg-red-500/10 rounded-full text-red-600 mb-4">
          <Lock className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You need Admin permissions to access the moderation dashboard, manage users, edit companies, and view system analytics.
        </p>
        <p className="text-xs text-muted-foreground border border-border/80 bg-muted/40 rounded-lg p-3 w-full mb-6">
          💡 Tip: Use the **Simulation Console** in the bottom-right corner to toggle your role to **Admin**.
        </p>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  const menuItems = [
    { label: 'Admin Overview', href: '/admin', icon: ShieldAlert },
    { label: 'User Management', href: '/admin/users', icon: Users },
    { label: 'Question Moderation', href: '/admin/questions', icon: CheckSquare },
    { label: 'Company Management', href: '/admin/companies', icon: Building },
    { label: 'System Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start w-full">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-1 space-y-2">
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-amber-500/20 dark:border-amber-500/10">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" /> Admin Console
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active 
                      ? 'bg-amber-600 text-white shadow-sm dark:bg-amber-600' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </div>
        </Card>
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
