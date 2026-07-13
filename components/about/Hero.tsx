import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="text-center flex flex-col items-center justify-center max-w-4xl mx-auto py-20 space-y-6">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
        Learn from Real Interviews, <br />
        <span className="text-primary">Not Just Theory</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Access authentic technical challenges from top companies. Built by
        developers, for developers, to bridge the gap between academic knowledge
        and industrial reality.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Link href="/questions">
          <Button size="lg" className="px-8 h-12 hover:scale-[1.02] transition-transform">
            Explore Questions
          </Button>
        </Link>
        <Link href="/questions/ask">
          <Button variant="outline" size="lg" className="h-12 px-8">
            Start Contributing
          </Button>
        </Link>
      </div>
    </section>
  );
}
