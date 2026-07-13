import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Bookmark, ThumbsUp, Eye, MessageCircle, Settings } from 'lucide-react';
import { ProfileActions } from './ProfileActions';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user || user.deletedAt) {
    notFound();
  }

  // Fetch stats concurrently
  const [questionsCount, answersCount, bookmarksCount] = await Promise.all([
    prisma.question.count({ where: { userId: user.id, deletedAt: null } }),
    prisma.answer.count({ where: { userId: user.id, deletedAt: null } }),
    prisma.bookmark.count({ where: { userId: user.id } })
  ]);

  const userQuestions = await prisma.question.findMany({
    where: { userId: user.id, deletedAt: null },
    include: {
      company: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-10">
      <StateWrapper>
        {/* Main Profile Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden p-6 md:p-8">
          
          {/* Top Section */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Avatar */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <Avatar fallback={user.name} src={user.avatarUrl || undefined} className="h-32 w-32 rounded-xl md:rounded-[1.25rem] border-2 border-border shadow-sm" />
              <div className="absolute -bottom-2 -right-2 bg-[#0f52ba] text-white p-1.5 rounded-full border-4 border-card shadow-sm flex items-center justify-center">
                <Settings className="h-4 w-4" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2 md:space-y-3 pt-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                <h1 className="text-[28px] font-bold text-foreground leading-none">{user.name}</h1>
                <div className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/50 rounded flex flex-col items-center justify-center px-2 py-0.5 shadow-sm">
                  <span className="text-[10px] font-bold leading-tight capitalize">{user.role}</span>
                  <span className="text-[8px] font-bold tracking-wide uppercase leading-tight">Role</span>
                </div>
              </div>

              {(user.title || user.company) && (
                <div className="text-sm font-semibold text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                  {user.title && <span>{user.title}</span>}
                  {user.title && user.company && <span>at</span>}
                  {user.company && <span className="text-foreground">{user.company}</span>}
                </div>
              )}
              
              {user.bio ? (
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto md:mx-0 mt-1">
                  {user.bio}
                </p>
              ) : (
                <p className="text-muted-foreground/60 text-sm italic mx-auto md:mx-0 mt-1">
                  No bio provided.
                </p>
              )}

              <div className="pt-2 flex justify-center md:justify-start">
                <ProfileActions userId={user.id} userEmail={user.email} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border my-8 w-full" />

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat Block 1 */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-5 flex items-center gap-4 border border-blue-100/50 dark:border-blue-900/50">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Shared Questions</p>
                <p className="text-2xl font-bold text-foreground leading-none">{questionsCount}</p>
              </div>
            </div>
            
            {/* Stat Block 2 */}
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-5 flex items-center gap-4 border border-slate-200/50 dark:border-slate-800/50">
              <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Answers Given</p>
                <p className="text-2xl font-bold text-foreground leading-none">{answersCount}</p>
              </div>
            </div>

            {/* Stat Block 3 */}
            <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-xl p-5 flex items-center gap-4 border border-orange-100/50 dark:border-orange-900/50">
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center shrink-0">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Bookmarks</p>
                <p className="text-2xl font-bold text-foreground leading-none">{bookmarksCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-border gap-6 md:gap-8 px-2 mt-10 scrollbar-hide">
          <div className="pb-4 border-b-2 border-[#0f52ba] text-[#0f52ba] font-bold text-sm cursor-pointer whitespace-nowrap">
            My Questions
          </div>
        </div>

        {/* Questions Grid */}
        <div className="mt-8 space-y-4">
          {userQuestions.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              No contributions yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userQuestions.map((q, i) => {
                const isFirst = i === 0;
                
                // Difficulty Badge styling logic
                const difficultyColors = {
                  Easy: 'bg-blue-100 text-[#0f52ba] border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
                  Medium: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
                  Hard: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400'
                };
                
                const difficultyClass = difficultyColors[q.difficulty] || 'bg-slate-100 text-slate-700 border-slate-200';

                return (
                  <Card key={q.id} className={`hover:border-primary/20 transition-all rounded-[1rem] shadow-sm flex flex-col ${isFirst ? 'md:col-span-2' : ''}`}>
                    <CardContent className="p-5 md:p-6 flex flex-col flex-1">
                      {/* Top Row */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          {q.company?.name || 'Company'} <span className="text-muted-foreground/50 text-[10px]">●</span> {q.tags?.[0] || 'System Design'}
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${difficultyClass}`}>
                          {q.difficulty}
                        </div>
                      </div>
                      
                      {/* Title */}
                      <Link href={`/questions/${q.id}`} className="block group">
                        <h3 className={`font-bold text-foreground group-hover:text-[#0f52ba] transition-colors leading-snug ${isFirst ? 'text-[22px] mb-3' : 'text-base mb-2'}`}>
                          {q.title}
                        </h3>
                      </Link>
                      
                      {/* Description (only on first card) */}
                      {isFirst && (
                        <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                          {q.content}
                        </p>
                      )}
                      
                      <div className="flex-1" />

                      {/* Bottom Footer Row */}
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-5">
                          {isFirst ? (
                            <>
                              <div className="flex items-center gap-2"><Eye className="h-4 w-4" /> 12.4k</div>
                              <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> 82</div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2"><ThumbsUp className="h-4 w-4" /> {q.upvote || 105}</div>
                          )}
                        </div>
                        {isFirst && (
                          <div className="text-[11px] text-muted-foreground/70">
                            Shared 2 days ago
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {userQuestions.length > 0 && (
          <div className="flex justify-center mt-10 pb-4">
            <Button variant="outline" className="w-full md:w-auto md:min-w-[320px] border-[#0f52ba] text-[#0f52ba] hover:bg-[#0f52ba]/5 font-bold h-11 rounded-lg">
              Load More Contributions
            </Button>
          </div>
        )}
      </StateWrapper>
    </div>
  );
}
