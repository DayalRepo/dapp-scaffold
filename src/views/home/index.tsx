import { FC, useEffect } from 'react';
import Link from 'next/link';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { CandyMint } from '../../components/CandyMint';
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

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

  const nftImagePaths = Array.from({ length: 30 }, (_, index) => `/nft_images/${index + 1}.jpg`); // Assuming images are named 1.jpg, 2.jpg, ..., 20.jpg

  return (
    <div className="flex flex-col h-screen">
      {/* Full Background Gradient */}
      <div className="bg-gradient-to-r from-purple-800 to-blue-500 h-full">
        {/* NavBar / Header */}
        <nav className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex justify-between items-center">
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
    href="https://twitter.com/YourTwitterAccount1"
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full bg-blue-400 hover:bg-blue-500 text-black font-bold px-4 py-2 transition-all duration-300 hidden md:inline mr-5"
  >
    AO Click
  </a>

  <a
    href="https://twitter.com/YourTwitterAccount1"
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full bg-blue-400 hover:bg-blue-500 text-black font-bold px-4 py-2 transition-all duration-300 hidden md:inline mr-5"
  >
    AO Space
  </a>

  <a
    href="https://twitter.com/YourTwitterAccount1"
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full bg-blue-400 hover:bg-blue-500 text-black font-bold px-4 py-2 transition-all duration-300 hidden md:inline mr-5"
  >
    Twitter
  </a>

  <a
    href="https://twitter.com/YourTwitterAccount2"
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full bg-purple-400 hover:bg-purple-500 text-black font-bold px-4 py-2 transition-all duration-300 hidden md:inline mr-5"
  >
    Discord
  </a>
</div>


          {/* Wallet/Select Wallet Button */}
          <div className="flex items-center">
            <WalletMultiButtonDynamic className="rounded-full bg-purple-400 hover:bg-purple-500 text-black font-bold px-4 py-2 transition-all duration-300" />
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
            {/* Text below CandyMint */}
            <p className="text-white mt-4">
              Explore the world of decentralized sweetness with Amigos Odyssey! 🍬 Mint your Amigos Odyssey NFT now and be part of the confectionery revolution.
            </p>
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
