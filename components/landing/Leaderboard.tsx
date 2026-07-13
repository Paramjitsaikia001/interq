import React from 'react';
import { Shield } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

export function Leaderboard() {
  const contributors = [
    { rank: "01", name: "Alex L.", role: "Senior Eng @ Airbnb", questions: 42, rep: "12.4k", color: "text-primary" },
    { rank: "02", name: "Sarah C.", role: "Staff Dev @ Shopify", questions: 38, rep: "9.8k", color: "text-foreground" },
    { rank: "03", name: "Michael W.", role: "CTO @ Stealth Startup", questions: 29, rep: "8.2k", color: "text-muted-foreground" }
  ];

  return (
    <section className="py-20 w-full">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="bg-surface rounded-3xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6 sm:p-8 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Top Contributors</h2>
            </div>
            <span className="text-sm font-medium text-muted-foreground bg-surface-container-highest px-3 py-1 rounded-full">Updated hourly</span>
          </div>

          <div className="divide-y divide-outline-variant">
            {contributors.map((c, i) => (
              <div key={i} className="p-6 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-surface-container-low transition-colors gap-4">
                <div className="flex items-center gap-6">
                  <span className={`font-mono font-bold text-lg w-6 text-center ${c.color}`}>{c.rank}</span>
                  <div className="flex items-center gap-4">
                    <Avatar 
                      className={`w-12 h-12 border-2 border-surface ${
                        i === 0 ? 'bg-primary/20 text-primary' : 
                        i === 1 ? 'bg-emerald-500/20 text-emerald-600' : 
                        'bg-amber-500/20 text-amber-600'
                      }`}
                      fallback={c.name.split(' ').map(n => n[0]).join('')}
                    />
                    <div>
                      <div className="font-bold text-foreground text-lg">{c.name}</div>
                      <div className="text-sm text-muted-foreground font-medium">{c.role}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-12 sm:gap-16 pl-12 sm:pl-0">
                  <div className="text-center sm:text-right">
                    <div className="font-bold text-xl text-foreground">{c.questions}</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5">Questions</div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="font-bold text-xl text-primary">{c.rep}</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5">Reputation</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-surface-container-low text-center border-t border-outline-variant">
            <button className="text-primary hover:text-primary/80 hover:underline font-bold transition-colors">
              View All Contributors →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
