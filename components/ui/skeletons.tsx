import * as React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted/70 dark:bg-muted/30', className)}
      {...props}
    />
  );
}

export function QuestionCardSkeleton() {
  return (
    <div className="border border-border bg-card rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-10 rounded-full" />
      </div>
      <div className="pt-3 border-t border-border/40 flex items-center justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/60">
      <div className="flex items-center gap-3 w-1/3">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="space-y-1.5 w-full">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-5 w-14 rounded-full" />
      <Skeleton className="h-4 w-12" />
      <div className="flex gap-2">
        <Skeleton className="h-7 w-16 rounded-lg" />
        <Skeleton className="h-7 w-12 rounded-lg" />
      </div>
    </div>
  );
}

export function DetailLayoutSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4 border border-border p-6 rounded-xl bg-card">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-24 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-2/3" />
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex gap-3">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-36 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-28" />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border border-border p-4 rounded-xl space-y-3 bg-card/65">
            <div className="flex gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5 w-1/3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
