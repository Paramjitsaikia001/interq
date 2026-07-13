'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { useSimulationStore } from '@/lib/state-store';
import { ShieldAlert, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function AskQuestion() {
  const router = useRouter();
  const { authToken } = useSimulationStore();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [role, setRole] = React.useState('');
  const [companyId, setCompanyId] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('Medium');
  const [experienceLevel, setExperienceLevel] = React.useState('entry');
  const [tags, setTags] = React.useState('');
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = React.useState(false);
  const [duplicates, setDuplicates] = React.useState<any[]>([]);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // No need to fetch companies list since target company is now a text input
  }, []);

  const handleSubmit = async (e?: React.FormEvent, bypass = false) => {
    if (e) e.preventDefault();
    setError('');
    
    if (!authToken) {
      setError('You must be signed in to ask a question. Please sign in first.');
      return;
    }

    if (!title.trim() || !content.trim() || !role.trim() || !companyId.trim()) {
      setError('All fields are required and cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const res = await fetch(`/api/v1/questions${bypass ? '?bypass=true' : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          role: role.trim(),
          companyId: companyId.trim(),
          experienceLevel,
          interviewRound: 'General',
          askedYear: new Date().getFullYear(),
          difficulty,
          tags: parsedTags,
        }),
      });

      if (res.ok) {
        setShowDuplicateWarning(false);
        router.push('/questions');
      } else if (res.status === 409) {
        const data = await res.json();
        setDuplicates(data.duplicates || []);
        setShowDuplicateWarning(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit question.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 w-full max-w-[80%] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Ask an Interview Question</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share a question you faced in a real interview. Help the community grow!
        </p>
      </div>

      <StateWrapper>
        <Card className="border-border bg-card shadow-md">
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <CardContent className="p-8 space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Question Title</label>
                <Input
                  placeholder="e.g. Design a low-latency caching system for chat messages"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-[10px] text-muted-foreground">
                  Keep it clear, concise, and focused on the core technical challenge.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Company</label>
                  <Input
                    placeholder="e.g. Stripe, Google, Meta"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Job Role Title</label>
                  <Input
                    placeholder="e.g. Software Engineer II (L4)"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Interview Difficulty</label>
                  <Select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    options={[
                      { label: 'Easy', value: 'Easy' },
                      { label: 'Medium', value: 'Medium' },
                      { label: 'Hard', value: 'Hard' }
                    ]}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Experience Level</label>
                  <Select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    options={[
                      { label: 'Entry Level (0-2 YOE)', value: 'entry' },
                      { label: 'Mid Level (3-5 YOE)', value: 'mid' },
                      { label: 'Senior (5-8+ YOE)', value: 'senior' },
                      { label: 'Staff / Principal (10+ YOE)', value: 'staff' }
                    ]}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Topics / Tags (comma separated)</label>
                <Input
                  placeholder="e.g. System Design, Redis, Caching"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Question Content & Context</label>
                <Textarea
                  placeholder="Provide details about the constraints, requirements, and key parts of the interview question..."
                  className="min-h-[220px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0 mt-2 flex justify-between items-center border-t border-border/40">
              <span className="text-[10px] text-muted-foreground">
                Do not post confidential company NDA information.
              </span>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Question'} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </StateWrapper>

      {/* Duplicate warning Modal */}
      <Dialog
        isOpen={showDuplicateWarning}
        onClose={() => setShowDuplicateWarning(false)}
        title="Similar Question Detected!"
        description="Our AI has flagged a potential duplicate question in the database."
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg flex gap-3 text-xs">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Duplicate Question Policy</p>
              <p className="mt-0.5">Please review the similar question below before submitting to avoid duplicate threads.</p>
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto space-y-3">
            {duplicates.map((dup) => (
              <div key={dup.id} className="border border-border p-3 rounded-lg bg-muted/20">
                <p className="text-xs font-semibold text-foreground">{dup.title}</p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/40">
                  <span className="text-[9px] bg-muted px-2 py-0.5 rounded-full">Similarity: {Math.round(dup.similarity * 100)}%</span>
                  <Link href={`/questions/${dup.id}`} target="_blank">
                    <Button size="xs" variant="link" className="p-0 text-xs">View existing thread →</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button size="sm" variant="ghost" onClick={() => setShowDuplicateWarning(false)}>Cancel & Revise</Button>
            <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700" onClick={() => handleSubmit(undefined, true)}>Submit Anyway</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
