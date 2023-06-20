import Sidebar from '@/components/sidebar/Sidebar';
import { Meta } from '@/layouts/Meta';
import UserList from '@/screens/users/UserList';
import { Main } from '@/templates/Main';

const ConversationsPage = () => {
  return (
    <Main meta={<Meta title="Messenger" description="Messenger" />}>
      <Sidebar>
        <div className="h-full">
          <UserList />
        </div>
      </Sidebar>
    </Main>
  );
};

export default ConversationsPage;
