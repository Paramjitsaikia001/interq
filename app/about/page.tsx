import type { Metadata } from 'next';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';

import { Hero } from '@/components/about/Hero';
import { Mission } from '@/components/about/Mission';
import { Features } from '@/components/about/Features';
import { Timeline } from '@/components/about/Timeline';
import { Audience } from '@/components/about/Audience';
import { Stats, StatsSkeleton } from '@/components/about/Stats';
import { Values } from '@/components/about/Values';
import { Vision } from '@/components/about/Vision';
import { CTA } from '@/components/about/CTA';
import { Quote } from '@/components/about/Quote';

export const metadata: Metadata = {
  title: 'About Us | interQ',
  description: 'Learn about our mission to democratize technical knowledge through community verified intelligence.',
  alternates: {
    canonical: '/about',
  },
};

export const revalidate = 3600; // Cache the page for 1 hour

async function StatsSection() {
  let stats = {
    questions: 0,
    answers: 0,
    companies: 0,
    users: 0,
    bookmarks: 0,
    verifiedPercentage: 0,
  };

  try {
    const [questions, answers, companies, users, bookmarks, verifiedQuestions] = await Promise.all([
      prisma.question.count(),
      prisma.answer.count(),
      prisma.company.count(),
      prisma.user.count(),
      prisma.bookmark.count(),
      prisma.question.count({
        where: {
          askedMatches: {
            some: {},
          },
        },
      }),
    ]);

    const verifiedPercentage = questions > 0 ? Math.round((verifiedQuestions / questions) * 100) : 0;
    stats = {
      questions,
      answers,
      companies,
      users,
      bookmarks,
      verifiedPercentage,
    };
  } catch (error) {
    console.warn('Warning: Failed to fetch stats during build/prerender. Using fallback values.', error);
  }

  return <Stats stats={stats} />;
}

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 pb-12 bg-background">
      <Hero />
      <Mission />
      <Features />
      <Timeline />
      <Audience />
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>
      <Vision />
      <Values />
      <CTA />
      <Quote />
    </div>
  );
}
