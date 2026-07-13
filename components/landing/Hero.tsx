import React from 'react';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <section className="relative pt-20 pb-12 overflow-hidden text-center flex flex-col items-center justify-center max-w-[1200px] mx-auto px-6">
      <div className="mb-8">
        <Badge variant="secondary" className="px-5 py-2 rounded-full text-sm font-medium border border-outline-variant bg-secondary-container/50 text-on-secondary-container hover:bg-secondary-container/80 transition-colors backdrop-blur-sm">
          NEW: System Design Prep Guide
        </Badge>
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-5xl mx-auto mb-6 text-foreground">
        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Community-Powered</span> <br className="hidden md:block" /> Interview Question Hub
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
        Access real questions from top tech companies, verified by software engineers. Prepare with high-precision data and community insights.
      </p>
    </section>
  );
}
