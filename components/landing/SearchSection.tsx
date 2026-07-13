import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchSection() {
  return (
    <section className="w-full max-w-3xl mx-auto px-6 mb-12">
      <div className="relative group flex items-center shadow-sm rounded-2xl bg-surface-container-lowest border border-outline-variant hover:border-primary/50 hover:shadow-md transition-all duration-300">
        <Search className="absolute left-5 text-muted-foreground w-6 h-6" />
        <Input
          type="text"
          placeholder="Search by company, role, or specific question..."
          className="w-full h-16 pl-14 pr-36 rounded-2xl text-lg border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
        />
        <div className="absolute right-2 flex items-center">
          <Button size="lg" className="rounded-xl px-8 h-12 font-medium text-base shadow-sm">
            Find Now
          </Button>
        </div>
      </div>
    </section>
  );
}
