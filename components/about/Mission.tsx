import { Badge } from '@/components/ui/badge';

export function Mission() {
  return (
    <section className="max-w-4xl mx-auto w-full">
      <div className="p-10 bg-card rounded-3xl border border-border flex flex-col gap-6 shadow-sm">
        <div>
          <Badge variant="secondary" className="uppercase tracking-widest text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 border-none">
            Our Mission
          </Badge>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight max-w-2xl">
          Democratizing technical knowledge through community verified intelligence.
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Interviews shouldn&apos;t be a black box. We believe that by sharing real-world experiences, 
          we create a more equitable hiring landscape where merit is recognized over networking 
          privilege. interQ is designed to be the single source of truth for authentic interview data.
        </p>
      </div>
    </section>
  );
}
