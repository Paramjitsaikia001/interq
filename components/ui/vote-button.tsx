'use client';

import * as React from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface VoteButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  score: number;
  hasVoted?: boolean;
  onVoteToggle?: (voted: boolean) => void;
  orientation?: 'horizontal' | 'vertical';
}

export function VoteButton({
  score,
  hasVoted = false,
  onVoteToggle,
  orientation = 'horizontal',
  className,
  ...props
}: VoteButtonProps) {
  const [voted, setVoted] = React.useState(hasVoted);
  const [currentScore, setCurrentScore] = React.useState(score);

  React.useEffect(() => {
    setVoted(hasVoted);
    setCurrentScore(score);
  }, [hasVoted, score]);

  const handleVote = () => {
    const nextVoted = !voted;
    setVoted(nextVoted);
    setCurrentScore(prev => prev + (nextVoted ? 1 : -1));
    if (onVoteToggle) onVoteToggle(nextVoted);
  };

  if (orientation === 'vertical') {
    return (
      <button
        onClick={handleVote}
        className={cn(
          'flex flex-col items-center justify-center p-2 rounded-lg border transition-all select-none w-12 min-h-[56px] focus:outline-none',
          voted
            ? 'bg-primary border-primary text-primary-foreground shadow-sm'
            : 'border-border bg-muted/20 hover:bg-muted text-muted-foreground hover:text-foreground',
          className
        )}
        {...props}
      >
        <ChevronUp className="h-5 w-5" />
        <span className="text-xs font-bold mt-0.5">{currentScore}</span>
      </button>
    );
  }

  return (
    <Button
      onClick={handleVote}
      variant={voted ? 'default' : 'outline'}
      size="sm"
      className={cn('flex items-center gap-1 px-3', className)}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
      <span>Upvote ({currentScore})</span>
    </Button>
  );
}
