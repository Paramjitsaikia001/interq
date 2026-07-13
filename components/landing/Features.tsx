import React from 'react';
import { ArrowRight, CheckCircle2, Users2 } from 'lucide-react';

export function Features() {
  return (
    <section className="py-24 bg-surface-container-low/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[420px]">
          {/* Community Driven (Span 2) */}
          <div className="md:col-span-2 p-10 bg-surface rounded-3xl border border-outline-variant flex flex-col justify-between group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-3 text-foreground">Community-driven data</h3>
              <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
                Real candidates share their interview experiences anonymously. Every question is verified by peer voting to ensure accuracy and relevance.
              </p>
            </div>

            <div className="mt-12 flex -space-x-3 relative z-10">
              {['/avatars/1.png', '/avatars/2.png', '/avatars/3.png'].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-surface bg-muted flex items-center justify-center overflow-hidden"
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm z-10">
                +2.4k
              </div>
            </div>
            
            {/* Decorative background gradient */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 group-hover:bg-primary/10 transition-colors duration-500" />
          </div>

          {/* Real-time updates */}
          <div className="p-10 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col justify-between group shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-3">Real-time updates</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fresh questions added every 15 minutes as interview seasons peak.
              </p>
            </div>

            <div className="mt-8 space-y-3 relative z-10">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex items-start gap-3 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 animate-pulse shrink-0" />
                <span className="text-sm font-medium text-slate-200 leading-tight">New question added: 'Rate Limiter' at Uber</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl flex items-start gap-3 border border-white/5 opacity-80">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span className="text-sm font-medium text-slate-300 leading-tight">Updated solution for 'Two Sum'</span>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900/50 pointer-events-none" />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Mark as Asked */}
          <div className="p-8 sm:p-10 bg-surface rounded-3xl border border-outline-variant flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center justify-between group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex-1">
              <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Mark as 'Asked'</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Help the community by tagging questions you've encountered recently. Boost the "Asked Frequency" metric for everyone.
              </p>
            </div>
            <div className="w-24 h-24 shrink-0 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/30 text-primary flex items-center justify-center group-hover:scale-105 group-hover:bg-primary/10 transition-all duration-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>

          {/* Contribute Knowledge */}
          <div className="p-8 sm:p-10 bg-primary text-primary-foreground rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">Contribute Knowledge</h3>
              <p className="text-primary-foreground/80 font-medium">Unlock premium guides by contributing.</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
