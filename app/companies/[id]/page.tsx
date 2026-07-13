import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CompanyDetailsClient from './CompanyDetailsClient';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { mockCompanies } from '@/lib/mock-data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const company = mockCompanies.find(
    (c) => c.slug === resolvedParams.id || c.id === resolvedParams.id
  );

  if (!company) {
    return {
      title: 'Company Not Found',
    };
  }

  return {
    title: `${company.name} Interview Questions & Difficulty`,
    description: `Prepare for interviews at ${company.name}. View difficulty rating (${company.interviewDifficulty}), office location (${company.location}), and real interview questions validated by the community.`,
    alternates: {
      canonical: `/companies/${company.slug}`,
    },
    openGraph: {
      title: `${company.name} Interview Questions | interQ`,
      description: company.description,
      url: `https://interq.dev/companies/${company.slug}`,
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${company.name} Interview Questions | interQ`,
      description: company.description,
    },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const company = mockCompanies.find(
    (c) => c.slug === resolvedParams.id || c.id === resolvedParams.id
  );

  if (!company) {
    notFound();
  }

  // Generate Organization JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://interq.dev';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': company.name,
    'description': company.description,
    'url': company.website,
    'logo': company.logo,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': company.location,
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': company.rating,
      'bestRating': '5',
      'worstRating': '1',
      'ratingCount': company.questionCount || 1,
    },
  };

  return (
    <div className="flex-1 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs customLabels={{ [resolvedParams.id]: company.name }} />
      <CompanyDetailsClient />
    </div>
  );
}
