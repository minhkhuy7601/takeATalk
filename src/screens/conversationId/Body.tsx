import { find } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

import useConversation from '@/hooks/useConversation';
import { pusherClient } from '@/libs/pusher';
import { seenMessage } from '@/services/api/conversations';
import { getMessagesByConversationId } from '@/services/api/messages';
import type { FullMessageType } from '@/types';

import MessageBox from './MessageBox';

const Body: React.FC = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<FullMessageType[]>([]);

  const { conversationId } = useConversation();

  const { data: messagesFetched } = useQuery(
    ['messagesByConversationId', conversationId],
    () => getMessagesByConversationId(conversationId),
    { enabled: !!conversationId }
  );

  useEffect(() => {
    setMessages(messagesFetched);
  }, [messagesFetched]);

  useEffect(() => {
    seenMessage(conversationId);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      seenMessage(conversationId);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
