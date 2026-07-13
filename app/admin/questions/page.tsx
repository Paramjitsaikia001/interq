'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { useSimulationStore } from '@/lib/state-store';
import { Check, Trash2, ShieldAlert, GitMerge, RotateCcw, AlertTriangle } from 'lucide-react';

interface DBQuestion {
  id: string;
  title: string;
  content: string;
  role: string;
  difficulty: string;
  tags: string[];
  createdAt: string;
  deletedAt: string | null;
  user: {
    name: string;
    email: string;
  };
  company: {
    name: string;
  };
  _count?: {
    answers: number;
    askedMatches: number;
  };
}

export default function QuestionModeration() {
  const { authToken } = useSimulationStore();
  const [questions, setQuestions] = React.useState<DBQuestion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Merge form state
  const [sourceId, setSourceId] = React.useState('');
  const [targetId, setTargetId] = React.useState('');
  const [mergeLoading, setMergeLoading] = React.useState(false);

  const fetchQuestions = React.useCallback(async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/v1/admin/questions?includeDeleted=true', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const data = await res.json();
      setQuestions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleModerate = async (questionId: string, action: 'approve' | 'soft_delete' | 'restore') => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/v1/admin/questions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ questionId, action })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to moderate question');
      }

      await fetchQuestions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMerge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId) {
      alert('Please specify both source and target questions');
      return;
    }
    if (sourceId === targetId) {
      alert('Source and target questions cannot be the same');
      return;
    }

    if (!confirm('Are you sure you want to merge this duplicate question? All answers and bookmarks will be moved to the target question, and the source question will be soft-deleted.')) {
      return;
    }

    setMergeLoading(true);
    try {
      const res = await fetch('/api/v1/admin/questions/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          sourceQuestionId: sourceId,
          targetQuestionId: targetId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to merge questions');
      }

      alert('Questions merged successfully!');
      setSourceId('');
      setTargetId('');
      await fetchQuestions();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setMergeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Question Moderation
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Approve posts, soft-delete inappropriate content, or merge duplicate questions.
        </p>
      </div>

      {/* Merge Duplicate Questions Card */}
      <Card className="border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/[0.02]">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-1.5">
            <GitMerge className="h-4 w-4 text-amber-600" /> Duplicate Question Merge
          </CardTitle>
          <CardDescription className="text-xs">
            Combine a duplicate thread into a primary question. This transfers validations, bookmarks, and answers, then soft-deletes the duplicate thread.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <form onSubmit={handleMerge} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-semibold uppercase">Source Question (Duplicate to delete)</label>
              <select 
                className="w-full text-xs rounded-lg border border-border bg-card p-2 text-foreground"
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                required
              >
                <option value="">-- Select Duplicate Question --</option>
                {questions.filter(q => !q.deletedAt).map(q => (
                  <option key={q.id} value={q.id}>
                    [{q.company.name}] {q.title.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-semibold uppercase">Target Question (Primary to keep)</label>
              <select 
                className="w-full text-xs rounded-lg border border-border bg-card p-2 text-foreground"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                required
              >
                <option value="">-- Select Primary Question --</option>
                {questions.filter(q => !q.deletedAt && q.id !== sourceId).map(q => (
                  <option key={q.id} value={q.id}>
                    [{q.company.name}] {q.title.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" size="sm" disabled={mergeLoading || !sourceId || !targetId} className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5">
                <GitMerge className="h-4 w-4" /> {mergeLoading ? 'Merging...' : 'Merge Duplicate Thread'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <StateWrapper
        emptyTitle="All clear! No questions in the system"
        emptyDescription="Create some questions in the main app to test moderation actions."
      >
        {loading && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Loading questions...
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-xs text-red-600 bg-red-500/10 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No questions found.
              </div>
            ) : (
              questions.map((q) => {
                const isDeleted = q.deletedAt !== null;
                return (
                  <Card key={q.id} className={`border-border bg-card ${isDeleted ? 'opacity-60 bg-red-500/[0.01]' : ''}`}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          {q.company.name} • {q.role} • By {q.user.name}
                        </span>
                        {isDeleted ? (
                          <Badge variant="destructive" className="text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Soft-Deleted
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3" /> Active
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm font-bold mt-1.5 flex items-center gap-2">
                        {q.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1 space-y-2">
                      <p className="text-xs text-muted-foreground leading-relaxed">{q.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {q.tags.map(t => (
                          <Badge key={t} variant="outline" className="text-[9px] py-0">{t}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 py-2 bg-muted/10 border-t border-border/30 mt-0 flex justify-between items-center gap-2 rounded-b-xl">
                      <span className="text-[10px] text-muted-foreground">
                        ID: <code className="bg-muted px-1 py-0.5 rounded text-[9px]">{q.id}</code>
                      </span>
                      <div className="flex gap-2">
                        {!isDeleted ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="xs" 
                              onClick={() => handleModerate(q.id, 'approve')}
                              className="border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10 flex items-center gap-1"
                            >
                              <Check className="h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="xs" 
                              onClick={() => handleModerate(q.id, 'soft_delete')}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Soft Delete
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="xs" 
                            onClick={() => handleModerate(q.id, 'restore')}
                            className="border-blue-500/20 text-blue-600 hover:bg-blue-500/10 flex items-center gap-1"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Restore Post
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </StateWrapper>
    </div>
  );
}
