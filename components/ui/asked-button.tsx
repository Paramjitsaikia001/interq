'use client';

import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface AskedButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  count: number;
  hasAsked?: boolean;
  onAskedToggle?: (asked: boolean) => void;
}

export function AskedButton({
  count,
  hasAsked = false,
  onAskedToggle,
  className,
  ...props
}: AskedButtonProps) {
  const [asked, setAsked] = React.useState(hasAsked);
  const [currentCount, setCurrentCount] = React.useState(count);

  React.useEffect(() => {
    setAsked(hasAsked);
    setCurrentCount(count);
  }, [hasAsked, count]);

  const handleToggle = () => {
    const nextAsked = !asked;
    setAsked(nextAsked);
    setCurrentCount(prev => prev + (nextAsked ? 1 : -1));
    if (onAskedToggle) onAskedToggle(nextAsked);
  };

  return (
    <Button
      onClick={handleToggle}
      variant={asked ? 'secondary' : 'outline'}
      size="sm"
      className={cn(
        'flex items-center gap-1.5 px-3 border transition-colors',
        asked
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
          : 'border-border text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5',
        className
      )}
      {...props}
    >
      <CheckCircle2 className={cn('h-4 w-4', asked ? 'fill-emerald-500/10' : '')} />
      <span>I was asked this ({currentCount})</span>
    </Button>
  );
}
