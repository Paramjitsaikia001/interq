'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Flame,
  Info,
  X,
} from 'lucide-react';
import { useToastStore, type Toast, type ToastType } from '@/lib/toast-store';

function getIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'notification':
      return <Bell className="h-5 w-5 text-indigo-500" />;
    default:
      return <Flame className="h-5 w-5 text-amber-500" />;
  }
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, toast.duration ?? 5000);
    return () => clearTimeout(timer);
  }, [onClose, toast.duration]);

  return (
    <div className="pointer-events-auto w-full bg-background/80 dark:bg-zinc-950/80 backdrop-blur-md border border-border/80 rounded-xl shadow-lg shadow-black/10 overflow-hidden flex items-start gap-3 p-4 transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className="p-1.5 bg-muted/50 rounded-lg shrink-0 mt-0.5">
        {getIcon(toast.type)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{toast.title}</h4>
        {toast.message ? (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{toast.message}</p>
        ) : null}
        {toast.link ? (
          <Link
            href={toast.link}
            onClick={onClose}
            className="inline-flex items-center text-[10px] font-semibold text-primary hover:underline mt-2"
          >
            View Details
          </Link>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
