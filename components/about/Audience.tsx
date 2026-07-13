export function Audience() {
  return (
    <section className="max-w-5xl mx-auto w-full pt-20">
      <h2 className="text-2xl font-bold mb-8 text-foreground">
        A Platform for the Entire Ecosystem
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Row 1 */}
        <div className="p-6 bg-card rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-primary mb-2">Students</h3>
          <p className="text-sm text-muted-foreground">
            Understand industry expectations before your first campus interview. Practice what actually matters.
          </p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-primary mb-2">Freshers</h3>
          <p className="text-sm text-muted-foreground">
            Bridge the gap between leetcode and real-world system design questions from top product firms.
          </p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-primary mb-2">Software Engineers</h3>
          <p className="text-sm text-muted-foreground">
            Stay sharp and keep track of evolving technical trends in specialized domains like AI, Cloud, and Ops.
          </p>
        </div>
        
        {/* Row 2 */}
        <div className="md:col-span-1 p-6 bg-primary text-primary-foreground rounded-xl border border-primary">
          <h3 className="text-sm font-semibold mb-2 text-primary-foreground">Senior Engineers & Staff</h3>
          <p className="text-sm text-primary-foreground/90 italic">
            Analyze architectural decisions and high-level leadership scenarios typical of L5+ roles at Big Tech.
          </p>
        </div>
        <div className="md:col-span-2 p-6 bg-card rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-primary mb-2">Interviewers</h3>
          <p className="text-sm text-muted-foreground">
            Ensure your question bank remains unique and challenging by monitoring what&apos;s currently in the public domain.
          </p>
        </div>
      </div>
    </section>
  );
}
