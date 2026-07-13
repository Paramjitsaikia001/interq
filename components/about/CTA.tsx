import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="max-w-5xl mx-auto w-full py-16">
      <div className="bg-primary text-primary-foreground p-12 md:p-16 rounded-3xl flex flex-col items-center text-center gap-6 shadow-xl relative overflow-hidden">
        {/* Subtle background decoration could go here */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight z-10">
          Join the Community
        </h2>
        <p className="text-primary-foreground/90 max-w-2xl text-lg z-10">
          Whether you&apos;re preparing for your next role or want to give back
          to the developer ecosystem, interQ is your home.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 z-10">
          <Link href="/questions/ask">
            <Button size="lg" className="bg-background text-primary hover:bg-background/90 px-8 h-12">
              Start Contributing
            </Button>
          </Link>
          <Link href="/questions">
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground px-8 h-12">
              Browse Questions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
