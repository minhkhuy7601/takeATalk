import type { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

import type { FullConversationType } from '../types';

const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const other = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return other[0];
  }, [session.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
