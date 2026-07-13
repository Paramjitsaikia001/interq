import * as React from 'react';
import Link from 'next/link';
import { Card } from './card';
import { Button } from './button';
import { Bell, CheckCircle2, ChevronRight, MessageSquare, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NotificationItemProps {
  id: string;
  type: 'upvote' | 'answer' | 'validation' | 'moderation';
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
  onReadClick?: (id: string) => void;
  className?: string;
}

export function NotificationItem({
  id,
  type,
  title,
  message,
  link,
  read,
  createdAt,
  onReadClick,
  className
}: NotificationItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'answer':
        return <MessageSquare className="h-4 w-4 text-primary" />;
      case 'validation':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'upvote':
        return <Flame className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getBg = () => {
    switch (type) {
      case 'answer':
        return 'bg-primary/10';
      case 'validation':
        return 'bg-emerald-500/10';
      case 'upvote':
        return 'bg-amber-500/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <Card
      className={cn(
        'p-4 transition-colors flex items-start justify-between gap-4 border',
        read ? 'bg-card border-border/80' : 'bg-primary/5 dark:bg-primary/10 border-primary/20',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-xl mt-0.5 shrink-0', read ? 'bg-muted text-muted-foreground' : getBg())}>
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-foreground">{title}</h4>
            {!read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{message}</p>
          <span className="text-[9px] text-muted-foreground/80 block mt-2">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {!read && onReadClick && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onReadClick(id)}
            className="text-[10px] text-primary"
          >
            Mark Read
          </Button>
        )}
        <Link href={link}>
          <Button variant="ghost" size="icon-sm" className="hover:text-primary">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
