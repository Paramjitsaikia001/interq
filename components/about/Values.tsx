import { ShieldCheck, Award, HeartHandshake, TrendingUp } from 'lucide-react';

const values = [
  {
    title: 'Authenticity',
    description: 'We prioritize first-hand accounts and reject "hypothetical" content. Every data point on interQ is backed by real human experience.',
    icon: <ShieldCheck className="w-5 h-5 text-primary" />
  },
  {
    title: 'Quality',
    description: "Moderation isn't just about deleting spam. It's about ensuring every question has a clear, actionable solution path.",
    icon: <Award className="w-5 h-5 text-primary" />
  },
  {
    title: 'Collaboration',
    description: 'interQ thrives when we help each other. The platform is built on the spirit of open-source knowledge sharing.',
    icon: <HeartHandshake className="w-5 h-5 text-primary" />
  },
  {
    title: 'Improvement',
    description: 'Continuous learning is our core drive. We constantly evolve our curation formats to reflect modern engineering practices.',
    icon: <TrendingUp className="w-5 h-5 text-primary" />
  }
];

export function Values() {
  return (
    <section className="max-w-5xl mx-auto w-full pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {values.map((value, i) => (
          <div key={i} className="p-8 bg-card rounded-2xl border border-border flex flex-col sm:flex-row gap-6 hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
              {value.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
