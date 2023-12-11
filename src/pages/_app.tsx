import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import Notifications from '../components/Notification';
import '@solana/wallet-adapter-react-ui/styles.css';
import '../styles/globals.css';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>AMIGOS ODYSSEY MINT</title>
      </Head>

      <ContextProvider>
        <div className="flex flex-col h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-gray-800">
          <Notifications />
          <Component {...pageProps} />
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
