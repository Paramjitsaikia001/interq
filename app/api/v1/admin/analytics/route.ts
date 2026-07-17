import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. User metrics
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { deletedAt: null } });
    const bannedUsers = totalUsers - activeUsers;
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const newUsersToday = await prisma.user.count({
      where: {
        createdAt: { gte: startOfToday }
      }
    });

    // 2. Question metrics
    const totalQuestions = await prisma.question.count();
    const activeQuestions = await prisma.question.count({ where: { deletedAt: null } });
    const deletedQuestions = totalQuestions - activeQuestions;

    // 3. Validation rate (Questions with at least one askedMatch / total active questions)
    const questionsWithAskedMatch = await prisma.question.count({
      where: {
        deletedAt: null,
        askedMatches: { some: {} }
      }
    });
    const validationRate = activeQuestions > 0 
      ? Math.round((questionsWithAskedMatch / activeQuestions) * 1000) / 10 
      : 0;

    // 4. Daily post growth (past 5 days)
    const dailyGrowth: { day: string; count: number; percentage: string }[] = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 4; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const count = await prisma.question.count({
        where: {
          createdAt: {
            gte: start,
            lt: end
          }
        }
      });

      dailyGrowth.push({
        day: daysOfWeek[start.getDay()],
        count,
        percentage: '' // Will compute relative to max below
      });
    }

    const maxCount = Math.max(...dailyGrowth.map(d => d.count), 1);
    dailyGrowth.forEach(d => {
      d.percentage = `${Math.round((d.count / maxCount) * 100)}%`;
    });

    // 5. Top tags & topics
    const activeQs = await prisma.question.findMany({
      where: { deletedAt: null },
      select: { tags: true }
    });

    const tagCounts: { [key: string]: number } = {};
    activeQs.forEach(q => {
      q.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

   const maxTagCount = Math.max(...topTags.map(t => t.count), 1);

const topTagsWithPercentage = topTags.map(t => ({
  ...t,
  percentage: Math.round((t.count / maxTagCount) * 100),
}));

    return NextResponse.json({
      metrics: {
        totalUsers,
        activeUsers,
        bannedUsers,
        newUsersToday,
        totalQuestions,
        activeQuestions,
        deletedQuestions,
        validationRate,
        pageviews: 48250, // Static/simulated telemetry
        activeSessions: 1540, // Static/simulated telemetry
      },
      dailyGrowth,
      topTags: topTagsWithPercentage
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
