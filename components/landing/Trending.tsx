import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { QuestionCard } from '@/components/ui/question-card';
import { mockQuestions } from '@/lib/mock-data';

export function Trending() {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 py-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Trending Questions</h2>
          <p className="text-muted-foreground">The most frequent problems from the last 30 days.</p>
        </div>
        <Link href="/questions" className="text-primary font-medium flex items-center gap-1 hover:underline transition-all">
          View full archive <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockQuestions.slice(0, 3).map((question) => (
          <QuestionCard key={question.id} {...question} className="h-full rounded-2xl shadow-sm hover:shadow-md border-outline-variant" />
        ))}
      </div>
    </section>
  );
}
