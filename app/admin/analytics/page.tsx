'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { useSimulationStore } from '@/lib/state-store';
import { BarChart3, TrendingUp, Users, ArrowUp, Activity, HelpCircle, ShieldAlert } from 'lucide-react';

interface AnalyticsData {
  metrics: {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    newUsersToday: number;
    totalQuestions: number;
    activeQuestions: number;
    deletedQuestions: number;
    validationRate: number;
    pageviews: number;
    activeSessions: number;
  };
  dailyGrowth: {
    day: string;
    count: number;
    percentage: string;
  }[];
  topTags: {
    tag: string;
    count: number;
    percentage: number;
  }[];
}

export default function SystemAnalytics() {
  const { authToken } = useSimulationStore();
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAnalytics = React.useCallback(async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/v1/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          System Analytics
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Review request telemetry, daily engagement trends, and content moderation performance.
        </p>
      </div>

      <StateWrapper>
        {loading && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Loading analytics data...
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-xs text-red-600 bg-red-500/10 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}
        {!loading && data && (
          <>
            {/* Analytics Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-violet-600/5 dark:bg-violet-600/10 border-violet-500/20">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider">Pageviews</span>
                  <span className="text-emerald-500 font-bold flex items-center"><ArrowUp className="h-3 w-3 mr-0.5" /> +24%</span>
                </div>
                <p className="text-3xl font-extrabold text-foreground mt-2">
                  {data.metrics.pageviews.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Unique views in the past 7 days</p>
              </Card>

              <Card className="p-4 bg-indigo-600/5 dark:bg-indigo-600/10 border-indigo-500/20">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider">Active Prep Sessions</span>
                  <span className="text-emerald-500 font-bold flex items-center"><ArrowUp className="h-3 w-3 mr-0.5" /> +15%</span>
                </div>
                <p className="text-3xl font-extrabold text-foreground mt-2">
                  {data.metrics.activeSessions.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Active users in the last 24 hours</p>
              </Card>

              <Card className="p-4 bg-emerald-600/5 dark:bg-emerald-600/10 border-emerald-500/20">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider">Validation Rate</span>
                  <span className="text-emerald-500 font-bold flex items-center"><ArrowUp className="h-3 w-3 mr-0.5" /> +2%</span>
                </div>
                <p className="text-3xl font-extrabold text-foreground mt-2">
                  {data.metrics.validationRate}%
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Matches validated by developers</p>
              </Card>
            </div>

            {/* User and Question breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 bg-card/60">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Users Directory</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold text-foreground">{data.metrics.totalUsers} Total</span>
                  <span className="text-xs text-muted-foreground">
                    {data.metrics.activeUsers} Active • {data.metrics.bannedUsers} Banned
                  </span>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">+{data.metrics.newUsersToday} new users registered today</p>
              </Card>

              <Card className="p-4 bg-card/60">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Questions Repository</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold text-foreground">{data.metrics.totalQuestions} Total</span>
                  <span className="text-xs text-muted-foreground">
                    {data.metrics.activeQuestions} Active • {data.metrics.deletedQuestions} Deleted
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Soft deletion and duplicate merges active</p>
              </Card>
            </div>

            {/* Analytics Details Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-violet-600" /> Daily Post Growth
                  </CardTitle>
                  <CardDescription className="text-xs">Count of interview questions submitted per day.</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-4">
                  <div className="space-y-2">
                    {data.dailyGrowth.map((item) => (
                      <div key={item.day} className="flex items-center gap-3 text-xs">
                        <span className="w-8 text-muted-foreground font-semibold">{item.day}</span>
                        <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                          <div className="bg-primary h-3 rounded-full" style={{ width: item.percentage }} />
                        </div>
                        <span className="w-6 text-right font-bold text-foreground">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-indigo-600" /> Top tags & topics
                  </CardTitle>
                  <CardDescription className="text-xs">Topics searched by active prep candidates.</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2 space-y-3">
                  {data.topTags.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                      No tags found in active questions yet.
                    </div>
                  ) : (
                    data.topTags.map((item) => (
                      <div key={item.tag} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">{item.tag}</span>
                          <span className="text-foreground">{item.count} posts</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </StateWrapper>
    </div>
  );
}
