'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/lib/state-store';
import { CheckCircle2, MessageSquare, Bookmark } from 'lucide-react';
import router from 'next/router';
import { Loader } from '@/components/ui/loader';

export default function Bookmarklists() {
  const { authToken } = useSimulationStore();

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<any[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [askedIds, setAskedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!authToken) return;

    async function fetchBookmarks() {
      try {
        setLoading(true);

        const res = await fetch('/api/v1/bookmark', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch bookmarks');
        }

        const data = await res.json();
        console.log(data)
        setBookmarkedQuestions(
          data.map((bookmark: any) => ({
            ...bookmark.question,
            bookmarkedAt: bookmark.createdAt,
            answersCount: bookmark.question._count.answers,
            askedCount: bookmark.question._count.askedMatches,
            bookmarkCount: bookmark.question._count.bookmarks,
          }))
        );
        setBookmarkedIds(data.map((bookmark: any) => bookmark.questionId));
      } catch (err) {
        console.error(err);
        setError('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, [authToken]);

  const handleBookmarkToggle = async (qId: string) => {
    if (!authToken) {
      router.push('/auth/login');
      return;
    }

    const isBookmarked = bookmarkedIds.includes(qId);
    if (isBookmarked) {
      setBookmarkedIds(prev => prev.filter(id => id !== qId));
    } else {
      setBookmarkedIds(prev => [...prev, qId]);
    }

    try {
      const res = await fetch(`/api/v1/bookmark/${qId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isBookmarked) {
          setBookmarkedIds(prev => [...prev.filter(id => id !== qId), qId]);
        } else {
          setBookmarkedIds(prev => prev.filter(id => id !== qId));
          setBookmarkedQuestions(prev => prev.filter(q => q.id !== qId));
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Toggle "I Was Asked This"
  const handleAskedToggle = async (qId: string) => {
    if (!authToken) {
      router.push('/auth/login');
      return;
    }

    const hasAsked = askedIds.includes(qId);
    if (hasAsked) {
      setAskedIds(prev => prev.filter(id => id !== qId));
      setBookmarkedQuestions(prev => prev.map(q => {
        if (q.id === qId) {
          return { ...q, askedCount: Math.max(0, q.askedCount - 1) };
        }
        return q;
      }));
    } else {
      setAskedIds(prev => [...prev, qId]);
      setBookmarkedQuestions(prev => prev.map(q => {
        if (q.id === qId) {
          return { ...q, askedCount: q.askedCount + 1 };
        }
        return q;
      }));
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return '1d ago';
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  };

  const getCompanyColor = (companyName: string) => {
    const name = companyName.toUpperCase();
    if (name.includes('GOOGLE')) return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300';
    if (name.includes('META')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (name.includes('STRIPE')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  if (loading) return <Loader/>;
  if (error) return <div>{error}</div>;

  return (
    <main className="flex-1 space-y-6">

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-heading">
          Interview Questions
        </h1>
      </div>

      <div className='space-y-4'>
        {bookmarkedQuestions.map((q) => {
          const isBookmarked = bookmarkedIds.includes(q.id);

          const hasAsked = askedIds.includes(q.id);

          return (
            <div
              key={q.id}
              className="flex items-start gap-4 border border-border bg-card rounded-2xl p-6 hover:border-primary/50 hover:shadow-sm transition-all relative group"
            >
              <div className="flex-1 space-y-3">

                {/* Header: Company, Role, Relative Time, Bookmark */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] tracking-wide font-black font-mono uppercase ${getCompanyColor(q.company?.name || '')}`}>
                      {q.company?.name || 'Company'}
                    </span>
                    <span className="font-semibold text-foreground/80 font-sans">{q.role}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(q.createdAt)}</span>
                  </div>

                  {/* Bookmark Toggle */}
                  <button
                    onClick={() => handleBookmarkToggle(q.id)}
                    className={`text-muted-foreground hover:text-primary transition-colors focus:outline-none p-1 rounded-md ${isBookmarked ? 'text-primary' : ''}`}
                    aria-label="Bookmark question"
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                  </button>
                </div>

                {/* Question Title & Content Preview */}
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground leading-snug hover:text-primary transition-colors font-heading font-sans">
                    <Link href={`/questions/${q.id}`}>
                      {q.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {q.content}
                  </p>
                </div>

                {/* Footer stats: Answer count, Asked count, and Users Stack */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/40 text-xs">

                  {/* Stats & validations */}
                  <div className="flex items-center gap-4 text-muted-foreground font-mono font-bold">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> {q.answersCount} answers
                    </span>
                    <button
                      onClick={() => handleAskedToggle(q.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all ${hasAsked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'border-border hover:bg-muted text-muted-foreground'
                        }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      "I was asked this" ({q.askedCount})
                    </button>
                  </div>

                  {/* Overlapping User Avatars list (mock stack from Stitch) */}
                  <div className="flex items-center -space-x-1.5 select-none">
                    <div className="h-5 w-5 rounded-full border border-card bg-indigo-500 text-white flex items-center justify-center text-[7px] font-bold">A</div>
                    <div className="h-5 w-5 rounded-full border border-card bg-emerald-500 text-white flex items-center justify-center text-[7px] font-bold">B</div>
                    <div className="h-5 w-5 rounded-full border border-card bg-amber-500 text-white flex items-center justify-center text-[7px] font-bold">C</div>
                    <div className="h-5 w-5 rounded-full border border-card bg-slate-800 text-[8px] text-white flex items-center justify-center text-[7px] font-bold px-1 min-w-[20px] font-mono">
                      +{q.askedCount > 3 ? q.askedCount - 3 : 12}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )
        })}
      </div>
    </main>
  );
}