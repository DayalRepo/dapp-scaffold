// Import statements remain unchanged
import { FC, useEffect } from 'react';
import Link from 'next/link';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { CandyMint } from '../../components/CandyMint';
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import React from 'react';
import { useAutoConnect } from '../../contexts/AutoConnectProvider';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const HomeView: FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  useAutoConnect();

  const nftImagePaths = Array.from({ length: 30 }, (_, index) => `/nft_images/${index + 1}.jpg`);

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <meta name="twitter:site" content="@amigosodyssey" />
        <meta name="twitter:title" content="AMIGOS ODYSSEY" />
        <meta
          name="twitter:description"
          content="Explore the world of decentralized sweetness with Amigos Odyssey! 🍬 Mint your Amigos Odyssey NFT now and be part of the confectionery revolution."
        />
        <meta name="twitter:image" content="https://x.com/amigosodyssey/status/1737330549709242827?s=20" />
        <title>AMIGOS ODYSSEY MINT</title>
      </Head>

      {/* Full Background Gradient with Background Image */}
       <div
        className="bg-gradient-to-r from-purple-800 to-blue-500 h-full"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/6.png')`,
          backgroundSize: 'cover',  // This ensures the image covers the entire container
          backgroundPosition: 'center',  // This centers the image
          minHeight: '100vh',  // Ensure the div takes at least the full height of the viewport
        }}
      >
        {/* NavBar / Header */}
        <nav className="p-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="logo.jpg" // Replace with your logo path
              alt="Logo"
              className="mr-9"
              style={{
                width: '50px',
                height: '50px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px',
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center space-2">

            <a
              href="https://twitter.com/amigosodyssey"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-green-400 hover:bg-green-500 text-black font-bold justify-center  px-4 py-2 transition-all duration-300 hidden md:inline mr-5"
            >
              TWITTER
            </a>

            <a
              href="https://discord.com/invite/xjVx6AekJs"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-green-400 hover:bg-green-500 text-black font-bold px-4 py-2 justify-center transition-all duration-300 hidden md:inline mr-5"
            >
             DISCORD
            </a>
          </div>

          {/* Wallet/Select Wallet Button */}
          <div className="rounded-full bg-green-400 hover:bg-darkgreen-500 text-black font-bold px-1 py-1 transition-all duration-300" >
            <WalletMultiButtonDynamic />
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-grow flex flex-col items-center justify-center overflow-x-hidden mt-4">
          <div className="hero-content flex flex-col items-center">
            <img
              src="home.gif"
              alt="Your GIF"
              className="mb-6 rounded"
              style={{ borderRadius: '30px' }}
              width={500}
              height={500}
            />
            <CandyMint />
             {/* Minting Note */}
            <p className="text-white font-bold mt-4">
              Minting has not started yet! 🚀 Stay tuned for updates. Follow our social media pages for the latest details.
            </p>
          </div>

          {/* Gallery of NFT Images */}
          <div className="flex-grow flex flex-col justify-center overflow-x-hidden mt-4"></div>
          <div className="flex flex-wrap justify-center mt-6">
            {nftImagePaths.map((imagePath, index) => (
              <img
                key={index}
                src={imagePath}
                alt={`NFT ${index + 1}`}
                className="mb-6 rounded"
                style={{ borderRadius: '30px' }}
                width={500}
                height={500}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
