'use client';

import clsx from 'clsx';
import { find } from 'lodash';
import router from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { useQuery } from 'react-query';

import GroupChatModal from '@/components/modals/GroupChatModal';
import useConversation from '@/hooks/useConversation';
import { pusherClient } from '@/libs/pusher';
import { getListConversations } from '@/services/api/conversations';
import { getListUsers } from '@/services/api/users';
import type { FullConversationType } from '@/types';

import ConversationBox from './ConversationBox';
import SkeletonBox from './SkeletonBox';

interface ConversationListProps {
  title?: string;
}

const ConversationList: React.FC<ConversationListProps> = () => {
  const [items, setItems] = useState<FullConversationType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const session = useSession();

  // const router = useRouter();
  const { isLoading, data: conversations } = useQuery(
    'listConversations',
    getListConversations
  );
  const { data: users, isLoading: isLoadingUser } = useQuery(
    'listUsers',
    getListUsers
  );

  const { conversationId } = useConversation();

  useEffect(() => {
    setItems(conversations ?? []);
  }, [conversations]);

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });
    };

    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:remove', removeHandler);
  }, [pusherKey, router]);

  return (
    <>
      <GroupChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
      />
      <aside
        className={clsx(
          `
        fixed 
        inset-y-0 
        overflow-y-auto
        border-r
        border-gray-200 
        pb-20 
        lg:left-20
        lg:block 
        lg:w-80 
        lg:pb-0 
      `,
          // isOpen ? 'hidden' : 'left-0 block w-full'
          'left-0 block w-full'
        )}
      >
        <div className="px-5">
          <div className="mb-4 flex justify-between pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            {isLoadingUser ? (
              <div
                className="
                h-9
                w-9
                animate-pulse 
                rounded-full 
                bg-gray-100 
                p-2 
              "
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="
                cursor-pointer 
                rounded-full 
                bg-gray-100 
                p-2 
                text-gray-600 
                transition 
                hover:opacity-75
              "
              >
                <MdOutlineGroupAdd size={20} />
              </button>
            )}
          </div>
          {isLoading &&
            Array.from(Array(5).keys()).map((item) => (
              <SkeletonBox key={item} />
            ))}
          {!isLoading &&
            items.map((item) => (
              <ConversationBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
              />
            ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
