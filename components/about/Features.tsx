import { 
  CheckCircle2, 
  Users, 
  Building2, 
  Wand2, 
  Code2, 
  Plus 
} from 'lucide-react';

const features = [
  {
    title: 'Real experiences',
    description: 'Actual questions faced by engineers at tier-1 tech firms, updated daily.',
    icon: <CheckCircle2 className="w-5 h-5 text-primary" />
  },
  {
    title: 'Community verified',
    description: 'Every entry is peer-reviewed for accuracy and quality by our contributor network.',
    icon: <Users className="w-5 h-5 text-primary" />
  },
  {
    title: 'Company-specific',
    description: 'Deep insights into hiring patterns and culture across 500+ global organizations.',
    icon: <Building2 className="w-5 h-5 text-primary" />
  },
  {
    title: 'High-quality answers',
    description: 'Detailed walkthroughs and multiple approaches for every single question.',
    icon: <Wand2 className="w-5 h-5 text-primary" />
  },
  {
    title: 'Built for developers',
    description: 'IDE-like interface, markdown support, and syntax highlighting for code blocks.',
    icon: <Code2 className="w-5 h-5 text-primary" />
  }
];

export function Features() {
  return (
    <section className="max-w-5xl mx-auto w-full pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <div key={i} className="p-8 bg-card rounded-2xl border border-border flex flex-col gap-4 hover:border-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
        
        {/* Suggest a feature card */}
        <div className="p-8 bg-transparent rounded-2xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-muted/50 transition-colors group">
          <div className="flex items-center gap-2 text-primary font-medium group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
            Suggest a feature
          </div>
        </div>
      </div>
    </section>
  );
}
