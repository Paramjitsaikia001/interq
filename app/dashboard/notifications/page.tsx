'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { useSimulationStore } from '@/lib/state-store';
import { 
  Bell, 
  Check, 
  Flame, 
  CheckCircle2, 
  MessageSquare, 
  Settings, 
  Inbox, 
  Mail, 
  ThumbsUp, 
  Bookmark, 
  ChevronRight, 
  MoreVertical,
  Volume2
} from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
  tags?: string[];
  replyContext?: string;
}

export default function NotificationsPage() {
  const { authToken } = useSimulationStore();
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'unread' | 'mentions' | 'votes'>('all');
  
  // Custom mock notifications to match the Stitch screen exactly
  const initialNotifications: Notification[] = [
    {
      id: 'n-stitch-1',
      type: 'upvote',
      title: 'Your answer was upvoted',
      message: 'DevSarah and 4 others upvoted your solution to "Explain the event loop in Node.js".',
      link: '/questions/q1',
      read: false,
      createdAt: new Date(Date.now() - 120000).toISOString(), // 2m ago
      tags: ['Node.js', 'Architecture']
    },
    {
      id: 'n-stitch-2',
      type: 'moderation',
      title: 'New question at Meta for SDE II',
      message: 'A new system design challenge was recently posted: "Designing a globally distributed rate limiter." Match your expertise!',
      link: '/questions/q1',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1h ago
    },
    {
      id: 'n-stitch-3',
      type: 'validation',
      title: 'User bookmarked your contribution',
      message: 'AlexChen saved your answer to "Optimizing React rendering performance" to their personal collection.',
      link: '/questions/q3',
      read: true,
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3h ago
    },
    {
      id: 'n-stitch-4',
      type: 'mention',
      title: 'Dev_Jordan mentioned you',
      message: '"@User I think your approach with Redis streams might be better suited for this scale than the current polling method."',
      link: '/questions/q1',
      read: true,
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1d ago
      replyContext: 'RE: High-throughput data ingestion pipeline...'
    }
  ];

  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications);
  const [loading, setLoading] = React.useState(false);

  // Fetch real notifications or fall back to mock data if no auth
  const fetchNotifications = React.useCallback(async () => {
    if (!authToken) {
      setNotifications(initialNotifications);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Merge with our rich mock data to keep the premium Stitch UI populated
        const apiNotifications = data.notifications || [];
        if (apiNotifications.length > 0) {
          setNotifications(apiNotifications);
        } else {
          setNotifications(initialNotifications);
        }
      } else {
        setNotifications(initialNotifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications(initialNotifications);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'upvote':
        return <ThumbsUp className="h-4 w-4 text-primary" />;
      case 'mention':
        return <Mail className="h-4 w-4 text-primary" />;
      case 'validation':
        return <Bookmark className="h-4 w-4 text-primary" />;
      default:
        return <Volume2 className="h-4 w-4 text-amber-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'upvote':
        return 'bg-primary/10';
      case 'mention':
        return 'bg-violet-500/10';
      case 'validation':
        return 'bg-indigo-500/10';
      default:
        return 'bg-amber-500/10';
    }
  };

  // Filtering logic
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'mentions') return n.type === 'mention';
    if (activeFilter === 'votes') return n.type === 'upvote';
    return true; // 'all'
  });

  // Calculate counts for filters
  const allCount = notifications.length;
  const unreadCount = notifications.filter(n => !n.read).length;
  const mentionsCount = notifications.filter(n => n.type === 'mention').length;
  const votesCount = notifications.filter(n => n.type === 'upvote').length;

  // Format time relative
  const getRelativeTime = (dateStr: string) => {
    const elapsed = Date.now() - new Date(dateStr).getTime();
    if (elapsed < 60000) return 'Just now';
    const mins = Math.floor(elapsed / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Group notifications into Today vs Yesterday
  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const todayNotifications = filteredNotifications.filter(n => isToday(n.createdAt));
  const yesterdayNotifications = filteredNotifications.filter(n => !isToday(n.createdAt));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Stay updated with your technical contributions and community activity.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllRead} 
            className="flex items-center gap-1.5 self-start md:self-auto"
          >
            <Check className="h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      {/* Grid Layout matching Stitch */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Filter Sidebar */}
        <aside className="md:col-span-3 space-y-4">
          <Card className="p-2 border bg-card/50 backdrop-blur-sm">
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`flex items-center justify-between w-full p-2.5 rounded-lg text-sm transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-primary text-primary-foreground font-bold' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="h-4 w-4" />
                  <span>All</span>
                </div>
                {allCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeFilter === 'all' ? 'bg-primary-foreground text-primary' : 'bg-muted-foreground/20 text-foreground'
                  }`}>
                    {allCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveFilter('unread')}
                className={`flex items-center justify-between w-full p-2.5 rounded-lg text-sm transition-colors ${
                  activeFilter === 'unread' 
                    ? 'bg-primary text-primary-foreground font-bold' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4" />
                  <span>Unread</span>
                </div>
                {unreadCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeFilter === 'unread' ? 'bg-primary-foreground text-primary' : 'bg-muted-foreground/20 text-foreground'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveFilter('mentions')}
                className={`flex items-center justify-between w-full p-2.5 rounded-lg text-sm transition-colors ${
                  activeFilter === 'mentions' 
                    ? 'bg-primary text-primary-foreground font-bold' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4" />
                  <span>Mentions</span>
                </div>
                {mentionsCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeFilter === 'mentions' ? 'bg-primary-foreground text-primary' : 'bg-muted-foreground/20 text-foreground'
                  }`}>
                    {mentionsCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveFilter('votes')}
                className={`flex items-center justify-between w-full p-2.5 rounded-lg text-sm transition-colors ${
                  activeFilter === 'votes' 
                    ? 'bg-primary text-primary-foreground font-bold' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Votes</span>
                </div>
                {votesCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeFilter === 'votes' ? 'bg-primary-foreground text-primary' : 'bg-muted-foreground/20 text-foreground'
                  }`}>
                    {votesCount}
                  </span>
                )}
              </button>
            </nav>
          </Card>

          <Card className="p-4 border bg-card/30">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Settings</h4>
            <Link href="/settings" className="text-xs text-primary hover:underline flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5" />
              <span>Notification preferences</span>
            </Link>
          </Card>
        </aside>

        {/* Notification List Area */}
        <section className="md:col-span-9 space-y-4">
          <StateWrapper
            emptyTitle="No notifications found"
            emptyDescription="You don't have any notifications matching this filter."
          >
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                You are all caught up!
              </div>
            ) : (
              <div className="space-y-4">
                {/* Today Section */}
                {todayNotifications.length > 0 && (
                  <div className="space-y-3">
                    {todayNotifications.map((n) => (
                      <Card 
                        key={n.id} 
                        onClick={() => markAsRead(n.id)}
                        className={`group relative p-4 transition-all flex items-start justify-between gap-4 border cursor-pointer ${
                          n.read 
                            ? 'bg-card border-border/80 opacity-80 hover:opacity-100' 
                            : 'bg-primary/5 border-primary/20 border-l-4 border-l-primary'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${getIconBg(n.type)}`}>
                            {getIcon(n.type)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{n.title}</h4>
                              {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {n.message}
                            </p>
                            {n.tags && n.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {n.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <span className="text-[10px] text-muted-foreground/80 block mt-2">
                              {getRelativeTime(n.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Link href={n.link} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon-sm" className="hover:text-primary">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Section Divider for Yesterday */}
                {todayNotifications.length > 0 && yesterdayNotifications.length > 0 && (
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-grow bg-border"></div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Yesterday</span>
                    <div className="h-[1px] flex-grow bg-border"></div>
                  </div>
                )}

                {/* Yesterday Section */}
                {yesterdayNotifications.length > 0 && (
                  <div className="space-y-3">
                    {yesterdayNotifications.map((n) => (
                      <Card 
                        key={n.id} 
                        onClick={() => markAsRead(n.id)}
                        className={`group relative p-4 transition-all flex items-start justify-between gap-4 border cursor-pointer ${
                          n.read 
                            ? 'bg-card border-border/80 opacity-80 hover:opacity-100' 
                            : 'bg-primary/5 border-primary/20 border-l-4 border-l-primary'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${getIconBg(n.type)}`}>
                            {getIcon(n.type)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{n.title}</h4>
                              {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {n.message}
                            </p>
                            {n.replyContext && (
                              <div className="mt-2 p-2 bg-muted/50 border border-border rounded-lg text-xs text-muted-foreground font-mono">
                                <span className="text-primary font-bold mr-1.5">RE:</span>
                                {n.replyContext}
                              </div>
                            )}
                            <span className="text-[10px] text-muted-foreground/80 block mt-2">
                              {getRelativeTime(n.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Link href={n.link} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon-sm" className="hover:text-primary">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </StateWrapper>
        </section>
      </div>
    </div>
  );
}
