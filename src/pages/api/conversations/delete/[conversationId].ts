import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';

import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') res.status(500);
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    res.status(200).json(null);
  }

  try {
    const { conversationId } = req.query;
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId as string,
      },
      include: {
        users: true,
      },
    });
    if (!existingConversation) {
      res.status(400).json('Invalid ID');
      return;
    }
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId as string,
        userIds: {
          hasSome: [session?.user?.id],
        },
      },
    });
    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          'conversation:remove',
          existingConversation
        );
      }
    });
    res.status(200).json(deletedConversation);
  } catch (error: any) {
    res.status(200).json(null);
  }
}
