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
    const { message, image, conversationId } = req.body;
    // const invalidMessage = {
    //   body: message,
    //   conversationId,
    //   sender: session?.user,
    //   status: 'pending',
    // };
    // await pusherServer.trigger(conversationId, 'messages:new', invalidMessage);
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: message,
        image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: session?.user?.id },
        },
        seen: {
          connect: {
            id: session?.user?.id,
          },
        },
      },
    });
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });
    await pusherServer.trigger(conversationId, 'messages:new', {
      ...newMessage,
      status: 'success',
    });

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.forEach((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    res.status(200).json(newMessage);
  } catch (error: any) {
    res.status(500).json('Internal Error');
  }
}
