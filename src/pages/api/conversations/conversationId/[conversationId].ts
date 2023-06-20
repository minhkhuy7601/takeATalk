import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '@/libs/prismadb';

import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') res.status(500);
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    res.status(200).json(null);
  }
  const { conversationId } = req.query;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId as string,
      },
      include: {
        users: true,
      },
    });
    res.status(200).json(conversation);
  } catch (error: any) {
    res.status(200).json(null);
  }
}
