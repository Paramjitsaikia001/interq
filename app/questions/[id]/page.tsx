import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QuestionDetailsClient from './QuestionDetailsClient';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ id: string }>;
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getQuestionAndAnswers(id: string) {
  if (!uuidRegex.test(id)) {
    return null;
  }
  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        company: true,
        answers: {
          where: { deletedAt: null },
          include: {
            user: true,
          }
        },
        _count: {
          select: {
            askedMatches: true
          }
        }
      }
    });
    return question;
  } catch (error) {
    console.error('Error fetching question in page.tsx:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const question = await getQuestionAndAnswers(resolvedParams.id);
  
  if (!question) {
    return {
      title: 'Question Not Found',
    };
  }

  return {
    title: `${question.title} - ${question.company.name} Interview Question`,
    description: `${question.content.slice(0, 150)}... Browse answer validation, upvotes, and developer solutions for ${question.role} interview.`,
    alternates: {
      canonical: `/questions/${question.id}`,
    },
    openGraph: {
      title: `${question.title} | interQ`,
      description: question.content.slice(0, 150),
      url: `https://interq.dev/questions/${question.id}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${question.title} | interQ`,
      description: question.content.slice(0, 150),
    },
  };
}

export default async function QuestionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const question = await getQuestionAndAnswers(resolvedParams.id);
  
  if (!question) {
    notFound();
  }

  // Generate QAPage JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    'mainEntity': {
      '@type': 'Question',
      'name': question.title,
      'text': question.content,
      'answerCount': question.answers.length,
      'upvoteCount': question.upvote,
      'dateCreated': question.createdAt.toISOString(),
      'author': {
        '@type': 'Person',
        'name': question.userId, // We can use userId or author's name if we query it, but userId is fine here.
      },
      'suggestedAnswer': question.answers.map((answer) => ({
        '@type': 'Answer',
        'text': answer.content,
        'dateCreated': answer.createdAt.toISOString(),
        'upvoteCount': answer.upvote,
        'author': {
          '@type': 'Person',
          'name': answer.user.name,
        },
      })),
    },
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      /> */}
      {/* <Breadcrumbs customLabels={{ [resolvedParams.id]: question.title }} /> */}
      <QuestionDetailsClient />
    </div>
  );
}

