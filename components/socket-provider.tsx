'use client';

import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useSimulationStore } from '@/lib/state-store';
import { Bell, CheckCircle2, Flame, X } from 'lucide-react';
import Link from 'next/link';

interface ToastMessage {
  id: string;
  type: 'upvote' | 'answer' | 'validation';
  title: string;
  message: string;
  link: string;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { authToken } = useSimulationStore();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  // Open socket connection on auth token presence
  React.useEffect(() => {
    if (!authToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to host (automatically handles same port or custom host/port)
    const socketUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const newSocket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected client-side, registering...');
      newSocket.emit('register', authToken);
    });

    newSocket.on('notification', (notification: ToastMessage) => {
      console.log('Received real-time notification:', notification);
      // Append toast
      setToasts(prev => [...prev, { ...notification, id: notification.id || Math.random().toString() }]);
    });

    newSocket.on('registered', (data) => {
      console.log('Socket.IO registration response:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [authToken]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'validation':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'upvote':
        return <Flame className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <>
      {children}
      
      {/* Real-time Toasts Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          // Auto-remove toast after 6 seconds
          return (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
              icon={getIcon(toast.type)}
            />
          );
        })}
      </div>
    </>
  );
}

function ToastItem({
  toast,
  onClose,
  icon,
}: {
  toast: ToastMessage;
  onClose: () => void;
  icon: React.ReactNode;
}) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="pointer-events-auto w-full bg-background/80 dark:bg-zinc-950/80 backdrop-blur-md border border-border/80 rounded-xl shadow-lg shadow-black/10 overflow-hidden flex items-start gap-3 p-4 transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className="p-1.5 bg-muted/50 rounded-lg shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{toast.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{toast.message}</p>
        <Link 
          href={toast.link} 
          onClick={onClose}
          className="inline-flex items-center text-[10px] font-semibold text-primary hover:underline mt-2"
        >
          View Details
        </Link>
      </div>
      <button 
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
