'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { ChevronUp, CheckCircle2, MessageSquare, Lock, ArrowLeft, Send, Sparkles, Bookmark } from 'lucide-react';

export default function QuestionDetails() {
  const params = useParams();
  const router = useRouter();
  const { userRole, authToken, currentUser } = useSimulationStore();
  const [answerInput, setAnswerInput] = React.useState('');
  
  const questionId = typeof params?.id === 'string' ? params.id : '';
  const [question, setQuestion] = React.useState<any | null>(null);
  const [answers, setAnswers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const [hasVoted, setHasVoted] = React.useState(false);
  const [hasAsked, setHasAsked] = React.useState(false);
  const [hasBookmarked, setHasBookmarked] = React.useState(false);

  const [localUpvotes, setLocalUpvotes] = React.useState(0);
  const [localAskedCount, setLocalAskedCount] = React.useState(0);

  const fetchQuestionAndAnswers = React.useCallback(async () => {
    if (!questionId) return;
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Question Details
      const headers: any = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const qRes = await fetch(`/api/v1/questions/${questionId}`, { headers });
      if (!qRes.ok) {
        if (qRes.status === 404) {
          setQuestion(null);
          setLoading(false);
          return;
        }
        throw new Error('Failed to load question details');
      }

      const qData = await qRes.json();
      setQuestion(qData);
      setHasVoted(qData.isVoted);
      setHasAsked(qData.isValidated);
      setHasBookmarked(qData.isBookmarked);
      setLocalUpvotes(qData.upvotes || 0);
      setLocalAskedCount(qData.askedCount || 0);

      // 2. Fetch Answers (Only if not a guest)
      if (userRole !== 'guest' && authToken) {
        const aRes = await fetch(`/api/v1/questions/${questionId}/answers`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (aRes.ok) {
          const aData = await aRes.json();
          setAnswers(aData.answers || []);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading content.');
    } finally {
      setLoading(false);
    }
  }, [questionId, authToken, userRole]);

  React.useEffect(() => {
    fetchQuestionAndAnswers();
  }, [fetchQuestionAndAnswers]);

  const handleToggleQuestionVote = async () => {
    if (!authToken) {
      router.push('/auth/login');
      return;
    }
    if (question && question.userId === currentUser?.id) {
      alert('You cannot upvote your own question.');
      return;
    }
    try {
      const res = await fetch(`/api/v1/questions/${questionId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHasVoted(data.action === 'added');
        setLocalUpvotes(data.upvotesCount);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to toggle vote.');
      }
    } catch (err) {
      console.error('Error voting on question:', err);
    }
  };

  const handleToggleQuestionValidate = async () => {
    if (!authToken) {
      router.push('/auth/login');
      return;
    }
    try {
      const res = await fetch(`/api/v1/questions/${questionId}/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHasAsked(data.action === 'added');
        setLocalAskedCount(data.askedCount);
      }
    } catch (err) {
      console.error('Error validating question:', err);
    }
  };

  const handleToggleQuestionBookmark = async () => {
    if (!authToken) {
      router.push('/auth/login');
      return;
    }
    try {
      const res = await fetch(`/api/v1/questions/${questionId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHasBookmarked(data.action === 'bookmarked');
      }
    } catch (err) {
      console.error('Error bookmarking question:', err);
    }
  };

  const handleToggleAnswerVote = async (answerId: string) => {
    if (!authToken) {
      router.push('/auth/login');
      return;
    }
    try {
      const res = await fetch(`/api/v1/answers/${answerId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAnswers(prev => prev.map(ans => {
          if (ans.id === answerId) {
            return { ...ans, upvotes: data.upvotesCount };
          }
          return ans;
        }));
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to toggle upvote on answer.');
      }
    } catch (err) {
      console.error('Error upvoting answer:', err);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerInput.trim() || !authToken) return;
    try {
      const res = await fetch(`/api/v1/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          content: answerInput
        })
      });
      if (res.ok) {
        setAnswerInput('');
        fetchQuestionAndAnswers();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to submit answer.');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Back button */}
      <div>
        <Link href="/questions" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to questions
        </Link>
      </div>

      <StateWrapper
        emptyTitle="Question not found"
        emptyDescription="The question you are looking for may have been removed or moderated."
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <span className="text-xs">Loading question details...</span>
          </div>
        ) : !question ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <span className="text-xs">Question not found.</span>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Content Canvas */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Question Title & Engagement */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary/10 text-primary dark:bg-primary/20 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider">
                    {question.tags?.[0] || 'Coding'}
                  </span>
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                    question.difficulty === 'Easy' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' :
                    question.difficulty === 'Medium' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' :
                    'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                  }`}>
                    {question.difficulty}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {question.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button 
                    onClick={handleToggleQuestionValidate}
                    variant={hasAsked ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>I was asked this ({localAskedCount})</span>
                  </Button>

                  <div className="flex items-center border border-input rounded-md overflow-hidden h-9">
                    <Button 
                      onClick={handleToggleQuestionVote}
                      variant="ghost"
                      size="sm"
                      className={`h-full border-r border-input rounded-none px-3 flex items-center gap-1.5 ${hasVoted ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      <ChevronUp className="h-4 w-4" />
                      <span>{localUpvotes}</span>
                    </Button>
                    
                    <Button 
                      onClick={handleToggleQuestionBookmark}
                      variant="ghost"
                      size="sm"
                      className={`h-full rounded-none px-3 ${hasBookmarked ? 'bg-amber-500/10 text-amber-500' : 'text-muted-foreground'}`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Question Description (Markdown Emulation/Glass Card) */}
              <section className="prose prose-slate dark:prose-invert max-w-none">
                <div className="bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-6 sm:p-8 rounded-2xl">
                  <p className="text-base sm:text-lg text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {question.content}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-6 mt-6 border-t border-slate-200/30">
                    {(question.tags || []).map((t: string) => (
                      <span key={t} className="text-xs bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-md font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Community Answers */}
              <section className="space-y-6 pt-4" id="answers">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" /> Community Solutions ({answers.length})
                  </h2>
                </div>

                {userRole === 'guest' ? (
                  /* Hidden Answers for Guests */
                  <Card className="border-dashed border-border p-8 text-center bg-muted/20">
                    <div className="p-3 bg-primary/10 rounded-md text-primary inline-block mb-3">
                      <Lock className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">Answers locked for guests</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                      You must sign in or register to view high-quality answers, code blocks, and contribute your own solutions.
                    </p>
                    <div className="flex justify-center gap-3">
                      <Link href="/auth/login">
                        <Button size="sm">Sign In</Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button variant="outline" size="sm">Create Account</Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  /* Visible Answers for Logged-In Users */
                  <div className="space-y-4">
                    {answers.length === 0 ? (
                      <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                        No answers yet. Be the first to contribute a solution!
                      </div>
                    ) : (
                      answers.map((answer) => (
                        <Card key={answer.id} className="relative overflow-hidden border-border bg-card">
                          {answer.isAccepted && (
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] uppercase tracking-wider font-extrabold px-3 py-0.5 rounded-bl-lg flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" /> Best Answer
                            </div>
                          )}
                          <CardHeader className="p-5 pb-3">
                            <div className="flex items-center gap-3">
                              <Avatar fallback={answer.author?.name || 'User'} src={answer.author?.avatarUrl} className="h-9 w-9 border border-border" />
                              <div>
                                <p className="text-sm font-semibold text-foreground">{answer.author?.name || 'Community Member'}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  Posted {new Date(answer.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="px-5 pb-4">
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed font-mono bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-[13px] border border-slate-800">
                              {answer.content}
                            </p>
                          </CardContent>
                          <CardFooter className="px-5 py-3 bg-muted/10 border-t border-border mt-0 flex items-center justify-between">
                            <Button 
                              variant="ghost" 
                              size="xs" 
                              className="flex items-center gap-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                              onClick={() => handleToggleAnswerVote(answer.id)}
                            >
                              <ChevronUp className="h-4 w-4" />
                              <span>Upvote ({answer.upvotes})</span>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    )}

                    {/* Post Answer Field */}
                    <div className="border border-border rounded-xl p-5 space-y-4 bg-card/60">
                      <h3 className="text-sm font-semibold text-foreground">Contribute your solution</h3>
                      <Textarea 
                        placeholder="Share your technical approach, code snippet, or explanation here (Markdown supported)..."
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        className="min-h-[120px] text-sm focus:ring-primary"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-muted-foreground">
                          Please keep answers clear, correct, and educational.
                        </span>
                        <Button 
                          size="sm" 
                          disabled={!answerInput.trim()}
                          onClick={handleSubmitAnswer}
                        >
                          <Send className="h-3 w-3 mr-1.5" /> Submit Answer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column: Sidebar (Metadata & Related) */}
            <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
              {/* Metadata Card */}
              <div className="border border-border rounded-2xl p-5 bg-card flex flex-col gap-4">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
                  Question Details
                </h4>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">business</span> Company
                  </span>
                  <span className="font-semibold text-primary">
                    {question.company?.name || 'Stripe'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">reorder</span> Round
                  </span>
                  <span className="font-semibold text-foreground">
                    {question.role || 'System Design'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">calendar_today</span> Date
                  </span>
                  <span className="font-semibold text-foreground">
                    {new Date(question.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">trending_up</span> Frequency
                  </span>
                  <div className="flex gap-[3px]">
                    {[1, 2, 3, 4, 5].map((level) => {
                      // Dynamically highlight based on asked count
                      const active = level <= Math.min(5, Math.max(1, Math.ceil((question.askedCount || localAskedCount) / 3)));
                      return (
                        <div 
                          key={level} 
                          className={`w-2.5 h-4 rounded-full transition-colors ${
                            active ? 'bg-primary' : 'bg-primary-fixed-dim/30 dark:bg-primary-fixed-dim/10'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <Button className="w-full mt-2" variant="secondary">
                  Join Discussion
                </Button>
              </div>
            </aside>
          </div>
        )}
      </StateWrapper>
    </div>
  );
}
