import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';

import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') res.status(500);
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    res.status(200).json(null);
  }
  const { conversationId } = req.query;

  try {
    // Find existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId as string,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      res.status(400).json('Invalid ID');
      return;
    }

    // Find last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      res.status(200).json(conversation);
      return;
    }
    // Update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage?.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: session?.user?.id,
          },
        },
      },
    });

    // Update all connections with new seen
    await pusherServer.trigger(
      session?.user?.email as string,
      'conversation:update',
      {
        id: conversationId,
        messages: [updatedMessage],
      }
    );

    if (lastMessage.seenIds.indexOf(session?.user?.id) !== -1) {
      res.status(200).json(conversation);
      return;
    }
    // Update last message seen
    await pusherServer.trigger(
      conversationId!,
      'message:update',
      updatedMessage
    );
    res.status(200).json(null);
  } catch (error: any) {
    res.status(500).json(null);
  }
}
