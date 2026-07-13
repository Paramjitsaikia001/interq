import type { Metadata } from 'next';
import QuestionsListingClient from './QuestionsListingClient';

export const metadata: Metadata = {
  title: 'Interview Questions',
  description: 'Browse real technical interview questions asked during software engineering and developer interviews at top companies.',
  alternates: {
    canonical: '/questions',
  },
};

import { Suspense } from 'react';

export default function QuestionsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Suspense fallback={<div>Loading questions...</div>}>
        <QuestionsListingClient />
      </Suspense>
    </div>
  );
}
