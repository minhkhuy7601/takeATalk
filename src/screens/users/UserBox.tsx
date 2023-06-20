import type { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useMutation } from 'react-query';

import Avatar from '@/components/Avatar';
import { createNewConversation } from '@/services/api/conversations';

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => {
      return createNewConversation({ userId: data?.id });
    },
    onSuccess: (res) => {
      router.push(`/conversations/${res?.data?.id}`);
    },
  });

  const handleClick = useCallback(() => {
    mutation.mutate();
  }, [data, router]);

  return (
    <>
      {/* {isLoading && <LoadingModal />} */}
      <button
        type="button"
        onClick={handleClick}
        className="
          relative 
          flex 
          w-full 
          cursor-pointer 
          items-center 
          space-x-3 
          rounded-lg 
          bg-white
          p-3
          transition
          hover:bg-neutral-100
        "
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{data.name}</p>
            </div>
          </div>
        </div>
      </button>
    </>
  );
};

export default UserBox;
