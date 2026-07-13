'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProfile() {
  const router = useRouter();
  const { currentUser, userRole, authToken, updateUser } = useSimulationStore();

  const [name, setName] = React.useState(currentUser?.name || '');
  const [title, setTitle] = React.useState(currentUser?.title || '');
  const [company, setCompany] = React.useState(currentUser?.company || '');
  const [bio, setBio] = React.useState(currentUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = React.useState(currentUser?.avatarUrl || '');
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (userRole === 'guest') {
      router.push('/auth/login');
    }
  }, [userRole, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !currentUser) return;

    setIsSaving(true);
    setError(null);
    
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ name, title, company, bio, avatarUrl })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      updateUser(data.user);
      router.refresh();
      router.push(`/profile/${currentUser.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-4 max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/profile/${currentUser?.id || 'u2'}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ArrowLeft className="h-4 w-4" /> Cancel edit
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">Edit Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your public presence on interQ.
        </p>
      </div>

      <StateWrapper>
        <Card className="border-border bg-card">
          <form onSubmit={handleSave}>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Avatar Image URL</label>
                  <Input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Job Title</label>
                  <Input
                    placeholder="e.g. Senior Frontend Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Company</label>
                  <Input
                    placeholder="e.g. Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Public Biography</label>
                <Textarea
                  placeholder="Tell the community about your interview goals, background, or technologies you specialize in..."
                  className="min-h-[120px]"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </CardContent>
            {error && (
              <div className="px-6 pb-4">
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}
            <CardFooter className="p-6 pt-0 mt-2 flex justify-between items-center border-t border-border/40">
              <span className="text-[10px] text-muted-foreground">
                Your changes will be saved to your profile immediately.
              </span>
              <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5">
                <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </StateWrapper>
    </div>
  );
}
