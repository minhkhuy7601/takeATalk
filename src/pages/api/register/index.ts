import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/libs/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') res.status(500);
  const body = await req.body;

  const { email, name, password } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });
  res.status(200).json(user);
}
