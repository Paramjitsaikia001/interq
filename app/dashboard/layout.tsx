'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  HelpCircle, 
  MessageSquare, 
  Bookmark, 
  Bell, 
  Lock,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userRole } = useSimulationStore();
  const router = useRouter();

  if (userRole === 'guest') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
        <div className="p-4 bg-amber-500/10 rounded-full text-amber-600 mb-4">
          <Lock className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Authentication Required</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You need to be logged in to view your dashboard, check notifications, and access saved questions.
        </p>
        <div className="flex gap-3">
          <Link href="/auth/login">
            <Button className="bg-primary text-primary-foreground">Log In</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Questions', href: '/dashboard/questions', icon: HelpCircle },
    { label: 'My Answers', href: '/dashboard/answers', icon: MessageSquare },
    { label: 'Saved Questions', href: '/dashboard/saved', icon: Bookmark },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start w-full">
      {/* Sidebar Navigation */}
      <aside className="lg:col-span-1 space-y-2">
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Dashboard Menu
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
                      ? 'bg-primary text-primary-foreground shadow-sm' 
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
