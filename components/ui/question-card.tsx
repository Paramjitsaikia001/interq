import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';
import { Badge } from './badge';
import { CompanyBadge } from './company-badge';
import { VoteButton } from './vote-button';
import { AskedButton } from './asked-button';
import { MessageSquare, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
  role: string;
  companyName: string;
  companySlug?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  askedCount: number;
  upvotes: number;
  answersCount: number;
  userName: string;
  createdAt: string;
  className?: string;
}

export function QuestionCard({
  id,
  title,
  content,
  role,
  companyName,
  companySlug,
  difficulty,
  tags,
  askedCount,
  upvotes,
  answersCount,
  userName,
  createdAt,
  className
}: QuestionCardProps) {
  return (
    <Card className={cn('hover:border-primary/40 hover:shadow-sm transition-all', className)}>
      <CardHeader className="p-5 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CompanyBadge name={companyName} slug={companySlug || companyName.toLowerCase()} />
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{role}</span>
          </div>
          <Badge
            variant={
              difficulty === 'Easy' ? 'success' :
              difficulty === 'Medium' ? 'warning' : 'destructive'
            }
          >
            {difficulty}
          </Badge>
        </div>
        <CardTitle className="text-base font-bold mt-2 hover:text-primary transition-colors">
          <Link href={`/questions/${id}`}>{title}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 py-1">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {content}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px] py-0.5 px-2">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3 border-t border-border/30 bg-muted/10 flex flex-wrap items-center justify-between gap-4 mt-3 rounded-b-xl">
        <div className="flex items-center gap-3">
          <VoteButton score={upvotes} />
          <AskedButton count={askedCount} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" /> {answersCount} answers
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>By {userName}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
