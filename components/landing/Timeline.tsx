import React from 'react';
import { Send, ShieldCheck, Dumbbell, Trophy } from 'lucide-react';

export function Timeline() {
  const steps = [
    {
      icon: <Send className="w-6 h-6 text-blue-500" />,
      title: 'Share',
      description: 'Post interview questions you recently encountered.',
      color: 'bg-blue-500/10'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: 'Community Verifies',
      description: 'Peers review and mark questions as recently asked.',
      color: 'bg-emerald-500/10'
    },
    {
      icon: <Dumbbell className="w-6 h-6 text-amber-500" />,
      title: 'Practice',
      description: 'Solve problems with high-quality community answers.',
      color: 'bg-amber-500/10'
    },
    {
      icon: <Trophy className="w-6 h-6 text-primary" />,
      title: 'Ace Interviews',
      description: 'Go into your next technical interview with confidence.',
      color: 'bg-primary/10'
    }
  ];

  return (
    <section className="w-full py-24 bg-surface-container-low/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">How interQ Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">A virtuous cycle of sharing and learning, powered by the developer community.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center group">
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 relative bg-surface border border-outline-variant`}>
                  {step.icon}
                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center border-2 border-surface shadow-sm">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
