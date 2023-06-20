import type { User } from '@prisma/client';
import { useQuery } from 'react-query';

import { getListUsers } from '@/services/api/users';

import SkeletonBox from './SkeletonBox';
import UserBox from './UserBox';

const UserList: React.FC = () => {
  const { isLoading, data: users } = useQuery('listUsers', getListUsers);

  return (
    <aside
      className="
        fixed 
        inset-y-0 
        left-0
        block
        w-full 
        overflow-y-auto 
        border-r
        border-gray-200 
        pb-20 
        lg:left-20
        lg:block lg:w-80 lg:pb-0
      "
    >
      <div className="px-5">
        <div className="flex-col">
          <div
            className="
              py-4 
              text-2xl 
              font-bold 
              text-neutral-800
            "
          >
            People
          </div>
        </div>
        {isLoading &&
          Array.from(Array(5).keys()).map((item) => <SkeletonBox key={item} />)}

        {!isLoading &&
          users.map((item: User) => <UserBox key={item.id} data={item} />)}
      </div>
    </aside>
  );
};

export default UserList;
