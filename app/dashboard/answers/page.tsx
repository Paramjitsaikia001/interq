'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/lib/state-store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { mockAnswers, mockQuestions } from '@/lib/mock-data';
import { MessageSquare, ArrowRight, ThumbsUp } from 'lucide-react';

export default function MyAnswers() {
  const { currentUser } = useSimulationStore();

  const userAnswers = mockAnswers.filter((a) => a.userId === currentUser?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Answers</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Review the answers and technical solutions you have shared with the community.
        </p>
      </div>

      <StateWrapper
        emptyTitle="You haven't contributed any answers yet"
        emptyDescription="Answer interview questions to earn reputation points and stand out to companies."
      >
        <div className="space-y-4">
          {userAnswers.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              You haven't contributed any answers yet.
            </div>
          ) : (
            userAnswers.map((ans) => {
              // Find matching question details
              const question = mockQuestions.find((q) => q.id === ans.questionId);
              return (
                <Card key={ans.id} className="border-border bg-card">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                      <span>Answered on {new Date(ans.createdAt).toLocaleDateString()}</span>
                      {ans.isAccepted && (
                        <Badge variant="success" className="text-[9px] uppercase">Best Answer</Badge>
                      )}
                    </div>
                    {question && (
                      <CardTitle className="text-sm font-semibold hover:text-primary mt-1">
                        <Link href={`/questions/${question.id}`}>
                          Q: {question.title}
                        </Link>
                      </CardTitle>
                    )}
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                      {ans.content}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 py-2 bg-muted/10 border-t border-border/30 mt-0 flex items-center justify-between rounded-b-xl">
                    <span className="text-xs flex items-center gap-1 font-semibold text-foreground">
                      <ThumbsUp className="h-3.5 w-3.5 text-primary" /> {ans.upvotes} upvotes
                    </span>
                    {question && (
                      <Link href={`/questions/${question.id}`}>
                        <Button variant="ghost" size="xs" className="flex items-center gap-1">
                          View thread <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </StateWrapper>
    </div>
  );
}
