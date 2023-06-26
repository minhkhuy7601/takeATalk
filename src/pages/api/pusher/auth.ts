import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { pusherServer } from '@/libs/pusher';

import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions);

  if (!session?.user?.email) {
    response.status(401);
    return;
  }

  try {
    const socketId = request.body.socket_id;
    const channel = request.body.channel_name;
    const data = {
      user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
    response.status(200).json(authResponse);
  } catch (error) {
    response.status(500).send(error);
  }
}
