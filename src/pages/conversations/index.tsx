import Sidebar from '@/components/sidebar/Sidebar';
import { Meta } from '@/layouts/Meta';
import ConversationList from '@/screens/conversations/ConversationList';
import { Main } from '@/templates/Main';

const ConversationsPage = () => {
  return (
    <Main meta={<Meta title="Messenger" description="Messenger" />}>
      <Sidebar>
        <div className="h-full">
          <ConversationList title="Messages" />
        </div>
      </Sidebar>
    </Main>
  );
};

export default ConversationsPage;
