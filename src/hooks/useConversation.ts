import { useRouter } from 'next/router';
import { useMemo } from 'react';

const useConversation = () => {
  const router = useRouter();

  const conversationId = useMemo(() => {
    if (!router?.query.conversationId) {
      return '';
    }

    return router?.query.conversationId as string;
  }, [router?.query?.conversationId]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  );
};

export default useConversation;
