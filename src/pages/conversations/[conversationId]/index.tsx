import { useQuery } from 'react-query';

import EmptyState from '@/components/EmptyState';
import Sidebar from '@/components/sidebar/Sidebar';
import useConversation from '@/hooks/useConversation';
import { Meta } from '@/layouts/Meta';
import Body from '@/screens/conversationId/Body';
import Form from '@/screens/conversationId/Form';
import Header from '@/screens/conversationId/Header';
import { ClipLoading } from '@/screens/conversationId/Loading';
import ConversationList from '@/screens/conversations/ConversationList';
import { getConversationById } from '@/services/api/conversations';
import { Main } from '@/templates/Main';

const ConversationIdPage = () => {
  const { conversationId } = useConversation();
  const { isLoading, data: conversation } = useQuery(
    ['conversationById', conversationId],
    () => getConversationById(conversationId),
    { enabled: !!conversationId }
  );

  return (
    <Main meta={<Meta title="Messenger" description="Messenger" />}>
      <Sidebar>
        <div className="h-full">
          <ConversationList title="Messages" />
          <div className="h-full lg:pl-80">
            <div className="flex h-screen flex-col">
              {isLoading && <ClipLoading />}
              {!isLoading && !conversation && <EmptyState />}
              {!isLoading && conversation && (
                <>
                  <Header conversation={conversation} />
                  <Body />
                  <Form />
                </>
              )}
            </div>
          </div>
        </div>
      </Sidebar>
    </Main>
  );
};

export default ConversationIdPage;
