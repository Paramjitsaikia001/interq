import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  selected?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

export function Tag({
  label,
  selected = false,
  onRemove,
  onClick,
  className,
  ...props
}: TagProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border transition-all select-none',
        onClick ? 'cursor-pointer' : '',
        selected
          ? 'bg-primary border-primary text-primary-foreground shadow-sm'
          : 'border-border bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground',
        className
      )}
      {...props}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
