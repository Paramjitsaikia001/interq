'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'left' | 'right';
  children: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  side = 'right',
  children
}: DrawerProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sideClasses = {
    left: 'left-0 h-full w-full max-w-sm border-r animate-in slide-in-from-left duration-200',
    right: 'right-0 h-full w-full max-w-sm border-l animate-in slide-in-from-right duration-200'
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Wrapper */}
      <div
        className={cn(
          'fixed top-0 z-50 flex flex-col bg-card text-card-foreground p-6 shadow-2xl transition-all border-border',
          sideClasses[side]
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
          <h2 className="text-base font-bold text-foreground capitalize">{title || 'Menu'}</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
