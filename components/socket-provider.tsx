'use client';

import * as React from 'react';
import { io, Socket } from 'socket.io-client';
import { useSimulationStore } from '@/lib/state-store';
import { toast } from '@/lib/toast';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { authToken } = useSimulationStore();
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    if (!authToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const newSocket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected client-side, registering...');
      newSocket.emit('register', authToken);
    });

    newSocket.on('notification', (notification: {
      id?: string;
      type: string;
      title: string;
      message: string;
      link: string;
    }) => {
      console.log('Received real-time notification:', notification);
      toast.notification(notification.title, notification.message, notification.link);
    });

    newSocket.on('registered', (data) => {
      console.log('Socket.IO registration response:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [authToken]);

  return <>{children}</>;
}
