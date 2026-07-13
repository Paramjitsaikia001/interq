import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto text-center bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 text-white mb-8 shadow-inner backdrop-blur-md">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Join thousands of developers <br className="hidden md:block" /> landing their dream roles.
          </h2>
          
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl font-medium leading-relaxed">
            Stop guessing what they'll ask. Start preparing with actual interview questions verified by our community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/questions" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-8 bg-white text-primary hover:bg-white/90 text-lg font-bold rounded-2xl shadow-lg transition-transform hover:scale-105">
                Browse Questions
              </Button>
            </Link>
            <Link href="/contribute" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-14 px-8 border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white text-lg font-bold rounded-2xl transition-all">
                Start Contributing <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
