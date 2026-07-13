import type { Metadata } from 'next';
import CompanyListingClient from './CompanyListingClient';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';

export const metadata: Metadata = {
  title: 'Explore Companies',
  description: 'Browse top tech companies and startups. Find interview difficulty ratings, company locations, employee counts, and community-validated interview questions.',
  alternates: {
    canonical: '/companies',
  },
};

export default function CompaniesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Breadcrumbs />
      <CompanyListingClient />
    </div>
  );
}
