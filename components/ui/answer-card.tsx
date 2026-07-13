import * as React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './card';
import { Avatar } from './avatar';
import { VoteButton } from './vote-button';
import { MarkdownViewer } from './markdown-viewer';
import { Badge } from './badge';
import { Check, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnswerCardProps {
  id: string;
  content: string;
  userName: string;
  userAvatar?: string;
  userTitle?: string;
  upvotes: number;
  isAccepted?: boolean;
  createdAt: string;
  className?: string;
}

export function AnswerCard({
  id,
  content,
  userName,
  userAvatar,
  userTitle,
  upvotes,
  isAccepted = false,
  createdAt,
  className
}: AnswerCardProps) {
  return (
    <Card className={cn('relative overflow-hidden border-border bg-card', className)}>
      {isAccepted && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-bl-lg flex items-center gap-1">
          <Check className="h-3 w-3" /> Best Answer
        </div>
      )}

      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <Avatar fallback={userName} src={userAvatar} className="h-9 w-9" />
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-foreground">{userName}</h4>
            {userTitle && <p className="text-[10px] text-muted-foreground">{userTitle}</p>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1">
        <MarkdownViewer content={content} />
      </CardContent>

      <CardFooter className="p-4 py-2 bg-muted/10 border-t border-border/30 mt-2 flex items-center justify-between rounded-b-xl">
        <VoteButton score={upvotes} />
        
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          Answered on {new Date(createdAt).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
}
