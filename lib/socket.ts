import { prisma } from './prisma';
import { redis } from './redis';

export interface SendNotificationParams {
  userId: string;
  type: 'upvote' | 'validation' | 'answer';
  title: string;
  message: string;
  link: string;
}

export async function createAndSendNotification(params: SendNotificationParams) {
  try {
    // 1. Create notification in DB
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
      },
    });

    // 2. Publish to Redis channel
    await redis.publish('notifications', JSON.stringify(notification));
    return notification;
  } catch (error) {
    console.error('Error creating/sending notification:', error);
    return null;
  }
}
