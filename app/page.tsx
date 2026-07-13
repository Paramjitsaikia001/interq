import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { SearchSection } from '@/components/landing/SearchSection';
import { Companies } from '@/components/landing/Companies';
import { Features } from '@/components/landing/Features';
import { Stats } from '@/components/landing/Stats';
import { Trending } from '@/components/landing/Trending';
import { Timeline } from '@/components/landing/Timeline';
import { Leaderboard } from '@/components/landing/Leaderboard';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { GridBackground } from '@/components/ui/GridBackground';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col relative">
      <GridBackground />
      
      <main className="flex-grow">
        <Hero />
        <SearchSection />
        <Companies />
        <Features />
        <Stats />
        <Trending />
        <Timeline />
        <Leaderboard />
        <CTA />
      </main>
    </div>
  );
}
