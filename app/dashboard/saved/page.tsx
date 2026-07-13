'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { mockQuestions } from '@/lib/mock-data';
import { Bookmark, CheckCircle2 } from 'lucide-react';

export default function SavedQuestions() {
  const savedQuestions = mockQuestions.filter((q) => q.isSaved);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Saved Questions</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          A list of bookmark interview questions you want to review later.
        </p>
      </div>

      <StateWrapper
        emptyTitle="No saved questions yet"
        emptyDescription="Bookmark interview questions from search listings or details pages to study them later."
      >
        <div className="space-y-4">
          {savedQuestions.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              You haven't bookmarked any questions yet.
            </div>
          ) : (
            savedQuestions.map((q) => (
              <Card key={q.id} className="hover:border-violet-500/20 transition-all">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px] uppercase font-bold">{q.companyName}</Badge>
                      <span className="text-xs text-muted-foreground">{q.role}</span>
                    </div>
                    <Badge variant={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'warning' : 'destructive'}>
                      {q.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm sm:text-base font-bold mt-2 hover:text-primary transition-colors">
                    <Link href={`/questions/${q.id}`}>{q.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">{q.content}</p>
                </CardContent>
                <CardFooter className="p-4 py-2 border-t border-border/30 bg-muted/10 mt-0 flex items-center justify-between rounded-b-xl">
                  <span className="text-xs flex items-center gap-1 text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {q.askedCount} asked
                  </span>
                  <Button variant="ghost" size="xs" className="text-violet-600 font-semibold flex items-center gap-1">
                    <Bookmark className="h-3.5 w-3.5 fill-violet-600" /> Bookmarked
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </StateWrapper>
    </div>
  );
}
