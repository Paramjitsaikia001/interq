'use client';

import * as React from 'react';
import { useSimulationStore } from '@/lib/state-store';
import { Button } from './button';
import { AlertCircle, FileSearch, Loader2, RefreshCw } from 'lucide-react';

interface StateWrapperProps {
  children: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  loadingCount?: number;
}

export function StateWrapper({
  children,
  emptyTitle = 'No data found',
  emptyDescription = 'There is nothing to display at this time.',
  errorTitle = 'An unexpected error occurred',
  errorDescription = 'We encountered an error loading this resource. Please try again later.',
  loadingCount = 3
}: StateWrapperProps) {
  const appState = useSimulationStore((state) => state.appState);
  const setAppState = useSimulationStore((state) => state.setAppState);

  if (appState === 'loading') {
    return (
      <div className="w-full space-y-4 py-8 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-[250px] rounded bg-muted" />
            <div className="h-4 w-[200px] rounded bg-muted" />
          </div>
        </div>
        <div className="space-y-3 pt-4">
          {Array.from({ length: loadingCount }).map((_, i) => (
            <div key={i} className="h-20 w-full rounded-lg bg-muted/60" />
          ))}
        </div>
        <div className="flex justify-center items-center py-6 text-muted-foreground text-sm gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Simulating load state...</span>
        </div>
      </div>
    );
  }

  if (appState === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 py-16 border border-dashed border-border rounded-xl bg-card/30">
        <div className="p-4 bg-muted/50 rounded-full text-muted-foreground mb-4">
          <FileSearch className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{emptyTitle}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{emptyDescription}</p>
        <Button variant="outline" size="sm" onClick={() => setAppState('normal')}>
          Reset to Normal
        </Button>
      </div>
    );
  }

  if (appState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 py-16 border border-destructive/20 rounded-xl bg-destructive/5 text-destructive">
        <div className="p-4 bg-destructive/10 rounded-full text-destructive mb-4">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h3 className="text-lg font-semibold mb-1 text-red-600 dark:text-red-400">{errorTitle}</h3>
        <p className="text-sm text-destructive/80 max-w-sm mb-6">{errorDescription}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAppState('normal')} className="border-destructive/30 hover:bg-destructive/10 text-destructive">
            <RefreshCw className="mr-1 h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
