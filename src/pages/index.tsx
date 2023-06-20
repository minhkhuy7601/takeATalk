import Image from 'next/image';

import { Meta } from '@/layouts/Meta';
import AuthForm from '@/screens/auth/AuthForm';
import { Main } from '@/templates/Main';

const Index = () => {
  return (
    <Main meta={<Meta title="Messenger" description="Messenger" />}>
      <div
        className="
        flex 
        min-h-screen 
        flex-col 
        justify-center 
        bg-gray-100 
        py-12 
        sm:px-6 
        lg:px-8
      "
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            height="48"
            width="48"
            className="mx-auto w-auto"
            src="/assets/images/logo.png"
            alt="Logo"
          />
          <h2
            className="
            mt-6 
            text-center 
            text-3xl 
            font-bold 
            tracking-tight 
            text-gray-900
          "
          >
            Sign in to your account
          </h2>
        </div>
        <AuthForm />
      </div>
      );
    </Main>
  );
};

export default Index;
