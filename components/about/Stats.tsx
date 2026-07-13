export interface PlatformStats {
  questions: number;
  answers: number;
  companies: number;
  users: number;
  bookmarks: number;
  verifiedPercentage: number;
}

export function Stats({ stats }: { stats: PlatformStats }) {
  const formatCompact = (num: number) => {
    return Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  };

  const statItems = [
    { label: 'Questions', value: `${formatCompact(stats.questions)}+` },
    { label: 'Answers', value: `${formatCompact(stats.answers)}+` },
    { label: 'Companies', value: `${formatCompact(stats.companies)}+` },
    { label: 'Users', value: `${formatCompact(stats.users)}+` },
    { label: 'Bookmarks', value: `${formatCompact(stats.bookmarks)}+` },
    { label: 'Verified', value: `${stats.verifiedPercentage}%` },
  ];

  return (
    <section className="max-w-5xl mx-auto w-full pt-16">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="p-4 bg-card rounded-xl border border-border text-center flex flex-col items-center justify-center h-24">
            <span className="text-xl font-bold text-foreground">{item.value}</span>
            <span className="text-xs text-muted-foreground mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StatsSkeleton() {
  return (
    <section className="max-w-5xl mx-auto w-full pt-16">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-4 bg-card rounded-xl border border-border text-center flex flex-col items-center justify-center h-24 animate-pulse">
            <div className="h-6 w-12 bg-muted rounded mb-2" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
