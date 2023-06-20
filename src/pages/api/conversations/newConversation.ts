import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') res.status(500);
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    res.status(400).json('Unauthorized');
    return;
  }

  try {
    const { userId, isGroup, members, name } = req.body;
    if (isGroup && (!members || members.length < 2 || !name)) {
      res.status(400).json('Invalid data');
      return;
    }
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: session?.user?.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      // Update all connections with new conversation
      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      });

      res.status(200).json(newConversation);
      return;
    }
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [session?.user?.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, session?.user?.id],
            },
          },
        ],
      },
    });
    const singleConversation = existingConversations[0];
    if (singleConversation) {
      res.status(200).json(singleConversation);
      return;
    }
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: session?.user?.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    newConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });
    res.status(200).json(newConversation);
  } catch (error: any) {
    res.status(500).json('Internal Error');
  }
}
