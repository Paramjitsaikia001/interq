'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Select } from './input';
import { Badge } from './badge';
import { Button } from './button';
import { Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onFilterChange?: (filters: any) => void;
  availableTags?: string[];
  selectedDifficulty?: string;
  selectedTag?: string;
  selectedSort?: string;
}

export function FilterSidebar({
  onFilterChange,
  availableTags = [],
  selectedDifficulty = 'all',
  selectedTag = 'all',
  selectedSort = 'recent',
  className,
  ...props
}: FilterSidebarProps) {
  const [difficulty, setDifficulty] = React.useState(selectedDifficulty);
  const [tag, setTag] = React.useState(selectedTag);
  const [sort, setSort] = React.useState(selectedSort);

  React.useEffect(() => {
    setDifficulty(selectedDifficulty);
    setTag(selectedTag);
    setSort(selectedSort);
  }, [selectedDifficulty, selectedTag, selectedSort]);

  const handleApply = () => {
    if (onFilterChange) {
      onFilterChange({ difficulty, tag, sort });
    }
  };

  const handleReset = () => {
    setDifficulty('all');
    setTag('all');
    setSort('recent');
    if (onFilterChange) {
      onFilterChange({ difficulty: 'all', tag: 'all', sort: 'recent' });
    }
  };

  return (
    <Card className={cn('bg-card border-border p-4 w-full space-y-4', className)} {...props}>
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-primary" /> Filter Questions
        </h3>
        <Button variant="ghost" size="xs" onClick={handleReset} className="h-7 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      </div>

      <div className="space-y-3.5">
        {/* Difficulty */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Difficulty</label>
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { label: 'All Difficulties', value: 'all' },
              { label: 'Easy', value: 'Easy' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Hard', value: 'Hard' }
            ]}
          />
        </div>

        {/* Sort */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Sort By</label>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={[
              { label: 'Most Recent', value: 'recent' },
              { label: 'Highest Rated', value: 'popular' },
              { label: 'Most Validated', value: 'validated' }
            ]}
          />
        </div>

        {/* Tag pills */}
        {availableTags.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground block">Topics</label>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setTag('all')}
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all',
                  tag === 'all'
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted text-muted-foreground'
                )}
              >
                All
              </button>
              {availableTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all',
                    tag === t
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/40">
        <Button size="sm" onClick={handleApply} className="w-full">
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}
