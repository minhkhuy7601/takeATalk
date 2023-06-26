import '../styles/global.css';
import 'nprogress/nprogress.css';

import type { AppProps } from 'next/app';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import ActiveStatus from '@/components/ActiveStatus';
import AuthContext from '@/context/AuthContext';
import ToasterContext from '@/context/ToasterContext';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const start = () => {
      NProgress.start();
      console.log('start');
    };
    const end = () => {
      NProgress.done();
      console.log('dones');
    };
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);
  return (
    <AuthContext>
      <ToasterContext />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
      <ActiveStatus />
    </AuthContext>
  );
};

export default MyApp;
