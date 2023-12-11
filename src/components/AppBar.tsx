import dynamic from 'next/dynamic';
import React, { useState } from "react";
import { useAutoConnect } from '../contexts/AutoConnectProvider';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const AppBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useAutoConnect();

  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex flex-col md:flex-row md:mb-2 shadow-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800 border-b border-gray-600 rounded-md">
        <div className="navbar-start flex items-center ml-4">
          {/* Add your logo/image here */}
          <img src="/new-logo2.jpg" alt="Logo" className="h-12" />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto mr-4">
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Nav Links */}
        <div className={`navbar-center md:flex items-center flex-grow ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          {/* Twitter Buttons */}
          <div className="md:flex items-center gap-4">
            <button className="btn rounded-full bg-blue-500 hover:bg-blue-600">
              <a href="https://twitter.com/your_twitter_account" target="_blank" rel="noopener noreferrer">
                Twitter 1
              </a>
            </button>
            <button className="btn rounded-full bg-blue-500 hover:bg-blue-600">
              <a href="https://twitter.com/your_other_twitter_account" target="_blank" rel="noopener noreferrer">
                Twitter 2
              </a>
            </button>
          </div>
        </div>

        {/* Wallet/Select Wallet Button */}
        <div className="navbar-end flex items-center md:mr-4">
          <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg" />
        </div>
      </div>
    </div>
  );
};

export default AppBar;
