import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface CompanyBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  logoUrl?: string;
  slug?: string;
  showLogo?: boolean;
}

export function CompanyBadge({
  name,
  logoUrl,
  slug,
  showLogo = true,
  className,
  ...props
}: CompanyBadgeProps) {
  const content = (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-card/60 hover:bg-muted/40 transition-colors text-xs font-semibold text-foreground select-none',
        className
      )}
      {...props}
    >
      {showLogo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=50'}
          alt={name}
          className="h-3.5 w-3.5 rounded object-cover bg-muted"
        />
      )}
      <span>{name}</span>
    </div>
  );

  if (slug) {
    return (
      <Link href={`/companies/${slug}`} className="focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
