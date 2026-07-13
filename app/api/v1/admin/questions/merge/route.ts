import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { redis } from '@/lib/redis';

// POST /api/v1/admin/questions/merge - Merges a duplicate question into a master thread.
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { sourceQuestionId, targetQuestionId } = body;

    if (!sourceQuestionId || !targetQuestionId) {
      return NextResponse.json({ error: 'Bad Request: sourceQuestionId and targetQuestionId are required' }, { status: 400 });
    }

    if (sourceQuestionId === targetQuestionId) {
      return NextResponse.json({ error: 'Bad Request: source and target cannot be the same' }, { status: 400 });
    }

    // Check if both exist
    const [sourceQ, targetQ] = await Promise.all([
      prisma.question.findUnique({ where: { id: sourceQuestionId } }),
      prisma.question.findUnique({ where: { id: targetQuestionId } })
    ]);

    if (!sourceQ || !targetQ) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Execute merge in transaction
    await prisma.$transaction(async (tx) => {
      // 1. Merge AskedMatches (validations)
      const sourceAsked = await tx.askedMatch.findMany({
        where: { questionId: sourceQuestionId }
      });

      for (const sa of sourceAsked) {
        const targetExist = await tx.askedMatch.findUnique({
          where: {
            userId_questionId: {
              userId: sa.userId,
              questionId: targetQuestionId
            }
          }
        });

        if (targetExist) {
          // Collapse duplicate: delete the source match
          await tx.askedMatch.delete({
            where: {
              userId_questionId: {
                userId: sa.userId,
                questionId: sourceQuestionId
              }
            }
          });
          // Retain the earliest timestamp
          if (sa.createdAt < targetExist.createdAt) {
            await tx.askedMatch.update({
              where: {
                userId_questionId: {
                  userId: sa.userId,
                  questionId: targetQuestionId
                }
              },
              data: {
                createdAt: sa.createdAt
              }
            });
          }
        } else {
          // Re-point match from source to target
          await tx.askedMatch.update({
            where: {
              userId_questionId: {
                userId: sa.userId,
                questionId: sourceQuestionId
              }
            },
            data: {
              questionId: targetQuestionId
            }
          });
        }
      }

      // 2. Merge Bookmarks
      const sourceBookmarks = await tx.bookmark.findMany({
        where: { questionId: sourceQuestionId }
      });

      for (const sb of sourceBookmarks) {
        const targetExist = await tx.bookmark.findUnique({
          where: {
            userId_questionId: {
              userId: sb.userId,
              questionId: targetQuestionId
            }
          }
        });

        if (targetExist) {
          // Collapse duplicate: delete the source bookmark
          await tx.bookmark.delete({
            where: {
              userId_questionId: {
                userId: sb.userId,
                questionId: sourceQuestionId
              }
            }
          });
          // Retain the earliest timestamp
          if (sb.createdAt < targetExist.createdAt) {
            await tx.bookmark.update({
              where: {
                userId_questionId: {
                  userId: sb.userId,
                  questionId: targetQuestionId
                }
              },
              data: {
                createdAt: sb.createdAt
              }
            });
          }
        } else {
          // Re-point bookmark from source to target
          await tx.bookmark.update({
            where: {
              userId_questionId: {
                userId: sb.userId,
                questionId: sourceQuestionId
              }
            },
            data: {
              questionId: targetQuestionId
            }
          });
        }
      }

      // 3. Move Answers
      await tx.answer.updateMany({
        where: { questionId: sourceQuestionId },
        data: { questionId: targetQuestionId }
      });

      // 4. Soft-delete source question
      await tx.question.update({
        where: { id: sourceQuestionId },
        data: { deletedAt: new Date() }
      });

      // 5. Audit Log
      await tx.moderationLog.create({
        data: {
          adminId: user.id,
          action: 'merge',
          details: {
            from: sourceQuestionId,
            to: targetQuestionId,
            admin_id: user.id
          }
        }
      });
    });

    // Invalidate caches
    try {
      await redis.del(`question:detail:${sourceQuestionId}`);
      await redis.del(`question:detail:${targetQuestionId}`);
      const keys = await redis.keys('questions:list:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      console.error('Redis cache invalidation error:', err);
    }

    return NextResponse.json({
      success: true,
      message: 'Question merged successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error merging questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
