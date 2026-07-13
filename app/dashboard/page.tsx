'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/lib/state-store';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { mockQuestions } from '@/lib/mock-data';
import { 
  Trophy, 
  HelpCircle, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function DashboardOverview() {
  const { currentUser } = useSimulationStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back, {currentUser?.name}!</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Here is an overview of your interview prep metrics and community contributions.
        </p>
      </div>

      <StateWrapper>
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-primary/5 border-primary/20 flex items-center gap-4 rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-md text-primary">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Reputation</p>
              <p className="text-xl font-bold text-foreground">{currentUser?.reputation} pts</p>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/5 border-border flex items-center gap-4 rounded-2xl">
            <div className="p-3 bg-secondary/10 dark:bg-white/5 rounded-md text-foreground">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Questions Asked</p>
              <p className="text-xl font-bold text-foreground">5</p>
            </div>
          </Card>

          <Card className="p-4 bg-emerald-500/5 border-emerald-500/15 flex items-center gap-4 rounded-2xl">
            <div className="p-3 bg-emerald-500/10 rounded-md text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Answers Given</p>
              <p className="text-xl font-bold text-foreground">12</p>
            </div>
          </Card>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recommended Questions */}
          <Card className="flex flex-col border-border/80 bg-card">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2 font-heading">
                <Sparkles className="h-4 w-4 text-primary" /> Recommended For You
              </CardTitle>
              <CardDescription className="text-xs">Based on your industry interests and top companies.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 flex-1 space-y-3">
              {mockQuestions.slice(0, 2).map((q) => (
                <div key={q.id} className="border border-border/60 bg-muted/20 hover:border-primary/30 p-3 rounded-md space-y-1.5 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase">{q.companyName}</span>
                    <Badge variant="outline">{q.difficulty}</Badge>
                  </div>
                  <Link href={`/questions/${q.id}`} className="text-xs font-bold text-foreground hover:text-primary transition-colors block leading-snug">
                    {q.title}
                  </Link>
                </div>
              ))}
            </CardContent>
            <CardFooter className="p-5 pt-2 border-t border-border/30 bg-muted/10 mt-0 flex justify-end rounded-b-xl">
              <Link href="/questions" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Explore More <ArrowRight className="h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>

          {/* Activity Metrics */}
          <Card className="border-border/80 bg-card">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" /> Interview Prep Status
              </CardTitle>
              <CardDescription className="text-xs">Keep track of your study streak and achievements.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Weekly Target Goal</span>
                  <span className="text-primary">60% Complete</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[60%]" />
                </div>
              </div>

              <div className="border border-border/60 rounded-lg p-3 space-y-1 bg-muted/10">
                <p className="text-xs font-bold text-foreground">🔥 4-Day Prep Streak!</p>
                <p className="text-[11px] text-muted-foreground">Keep validating interview questions daily to maintain your placement priority rank.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </StateWrapper>
    </div>
  );
}
