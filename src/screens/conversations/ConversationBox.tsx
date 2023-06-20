'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import useOtherUser from '@/hooks/useOtherUser';
import type { FullConversationType } from '@/types';

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email]
  );

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return 'Started a conversation';
  }, [lastMessage]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        `
        relative 
        flex 
        w-full 
        cursor-pointer 
        items-center 
        space-x-3 
        rounded-lg
        p-3
        transition
        hover:bg-neutral-100
        `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-start focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="mb-1 flex w-full items-center justify-between">
            <p className="text-base font-medium text-gray-900">
              {data.name || otherUser?.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs 
                  font-light 
                  text-gray-400
                "
              >
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
              `,
              hasSeen ? 'text-gray-500' : 'font-medium text-black'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ConversationBox;
