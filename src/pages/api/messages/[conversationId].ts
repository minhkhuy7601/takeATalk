import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '@/libs/prismadb';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') res.status(500);
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    res.status(200).json([]);
  }
  const { conversationId } = req.query;

  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId as string,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(200).json([]);
  }
}
