import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import prisma from '@/libs/prismadb';

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
    const { name, image } = req.body;
    const updatedUser = await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        image,
        name,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(500).json('Internal Error');
  }
}
