import React from 'react';
import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Companies() {
  const companies = ['Google', 'Meta', 'Amazon', 'Stripe'];

  return (
    <section className="w-full max-w-3xl mx-auto px-6 mb-20 flex flex-wrap justify-center items-center gap-4">
      <span className="text-sm text-muted-foreground font-medium">Trending Companies:</span>
      <div className="flex flex-wrap gap-2.5">
        {companies.map((company) => (
          <Badge
            key={company}
            variant="outline"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer border-outline-variant text-foreground shadow-sm"
          >
            <Building2 className="w-4 h-4 text-muted-foreground" />
            {company}
          </Badge>
        ))}
      </div>
    </section>
  );
}
