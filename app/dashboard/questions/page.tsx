'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/lib/state-store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { mockQuestions } from '@/lib/mock-data';
import { Edit, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function MyQuestions() {
  const { currentUser } = useSimulationStore();

  // Filter questions posted by this user
  const userQuestions = mockQuestions.filter((q) => q.userId === currentUser?.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Questions</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            A history of interview questions you've shared with the community.
          </p>
        </div>
        <Link href="/questions/ask">
          <Button size="sm">Ask Another</Button>
        </Link>
      </div>

      <StateWrapper
        emptyTitle="You haven't posted any questions yet"
        emptyDescription="Share real interview questions from your experiences and help other candidates prepare."
      >
        <div className="space-y-4">
          {userQuestions.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              You haven't shared any questions yet.
            </div>
          ) : (
            userQuestions.map((q) => (
              <Card key={q.id} className="hover:border-primary/30 transition-colors rounded-2xl">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase">{q.companyName}</Badge>
                      <span className="text-xs text-muted-foreground">{q.role}</span>
                    </div>
                    <Badge variant={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'warning' : 'destructive'}>
                      {q.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm sm:text-base font-bold hover:text-primary mt-2">
                    <Link href={`/questions/${q.id}`}>{q.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xs text-muted-foreground line-clamp-2">{q.content}</p>
                </CardContent>
                <CardFooter className="p-4 py-2 bg-muted/10 border-t border-border/30 mt-0 flex items-center justify-between rounded-b-xl">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> {q.askedCount} Validations</span>
                    <span>{q.answersCount} Answers</span>
                  </div>
                  <Link href={`/questions/${q.id}/edit`}>
                    <Button variant="outline" size="xs" className="flex items-center gap-1">
                      <Edit className="h-3 w-3" /> Edit
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </StateWrapper>
    </div>
  );
}
