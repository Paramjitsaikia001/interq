import { MetadataRoute } from 'next';
import { mockQuestions, mockCompanies } from '@/lib/mock-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://interq.dev';

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/questions`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Question details routes
  const questionRoutes = mockQuestions.map((question) => ({
    url: `${baseUrl}/questions/${question.id}`,
    lastModified: new Date(question.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Company details routes
  const companyRoutes = mockCompanies.map((company) => ({
    url: `${baseUrl}/companies/${company.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...questionRoutes, ...companyRoutes];
}
