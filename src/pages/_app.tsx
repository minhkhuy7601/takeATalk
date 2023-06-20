import '../styles/global.css';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

import ActiveStatus from '@/components/ActiveStatus';
import AuthContext from '@/context/AuthContext';
import ToasterContext from '@/context/ToasterContext';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => (
  <AuthContext>
    <ToasterContext />
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
    <ActiveStatus />
  </AuthContext>
);

export default MyApp;
