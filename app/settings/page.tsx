'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { Bell, Shield, Eye, Save, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Settings() {
  const router = useRouter();
  const { userRole } = useSimulationStore();
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [pushNotifs, setPushNotifs] = React.useState(false);
  const [profilePrivate, setProfilePrivate] = React.useState(false);

  React.useEffect(() => {
    if (userRole === 'guest') {
      router.push('/auth/login');
    }
  }, [userRole, router]);

  return (
    <div className="py-2 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure security settings, email reports, and privacy configurations.
        </p>
      </div>

      <StateWrapper>
        <div className="space-y-6">
          {/* Notifications Preferences */}
          <Card className="border-border bg-card">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-violet-600" /> Notification Preferences
              </CardTitle>
              <CardDescription className="text-xs">Select how you want to be alerted of community activities.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div>
                  <p className="text-sm font-semibold text-foreground">Email digests</p>
                  <p className="text-xs text-muted-foreground">Receive weekly summaries of trending interview questions.</p>
                </div>
                <button onClick={() => setEmailNotifs(!emailNotifs)}>
                  {emailNotifs ? (
                    <ToggleRight className="h-7 w-7 text-primary" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">Push notifications</p>
                  <p className="text-xs text-muted-foreground">Get real-time updates when users validate your questions.</p>
                </div>
                <button onClick={() => setPushNotifs(!pushNotifs)}>
                  {pushNotifs ? (
                    <ToggleRight className="h-7 w-7 text-primary" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-muted-foreground" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Preferences */}
          <Card className="border-border bg-card">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-indigo-600" /> Privacy & Visibility
              </CardTitle>
              <CardDescription className="text-xs">Control who can view your interview preparation progress.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">Private profile metrics</p>
                  <p className="text-xs text-muted-foreground">Hide your contributions, lists, and reputation score from guests.</p>
                </div>
                <button onClick={() => setProfilePrivate(!profilePrivate)}>
                  {profilePrivate ? (
                    <ToggleRight className="h-7 w-7 text-primary" />
                  ) : (
                    <ToggleLeft className="h-7 w-7 text-muted-foreground" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Save Action */}
          <div className="flex justify-end gap-2">
            <Button className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5">
              <Save className="h-4 w-4" /> Save Settings
            </Button>
          </div>
        </div>
      </StateWrapper>
    </div>
  );
}
