'use client';

import type { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';

import useRoutes from '@/hooks/useRoutes';

import Avatar from '../Avatar';
import DesktopItem from './DesktopItem';
import SettingsModal from './SettingsModal';

const DesktopSidebar: React.FC = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const currentUser = useMemo(() => session?.user, [session]);

  return (
    <>
      <SettingsModal
        currentUser={currentUser as User}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div
        className="
        hidden 
        justify-between 
        lg:fixed 
        lg:inset-y-0 
        lg:left-0 
        lg:z-40 
        lg:flex
        lg:w-20 
        lg:flex-col 
        lg:overflow-y-auto
        lg:border-r-[1px]
        lg:bg-white
        lg:pb-4
        xl:px-6
      "
      >
        <nav className="mt-4 flex flex-col justify-between">
          <ul className="flex flex-col items-center space-y-1">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col items-center justify-between">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="cursor-pointer transition hover:opacity-75"
          >
            <Avatar user={currentUser as User} />
          </button>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
