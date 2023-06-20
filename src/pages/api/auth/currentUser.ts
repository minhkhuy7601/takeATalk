import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '@/libs/prismadb';

import { authOptions } from './[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') res.status(500);
  const session = await getServerSession(req, res, authOptions);
  // console.log('session', session);
  if (!session?.user?.email) {
    res.status(200).json(null);
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  if (!currentUser) {
    res.status(200).json(null);
  }

  res.status(200).json(currentUser);
}
