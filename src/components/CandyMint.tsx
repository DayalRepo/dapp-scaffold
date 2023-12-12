// Import necessary dependencies
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback, useMemo } from 'react';
import { notify } from '../utils/notifications';
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, transactionBuilder, publicKey, some } from '@metaplex-foundation/umi';
import { fetchCandyMachine, mintV2, mplCandyMachine, safeFetchCandyGuard } from '@metaplex-foundation/mpl-candy-machine';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';
import { clusterApiUrl } from '@solana/web3.js';
import * as bs58 from 'bs58';
import ConfettiComponent from './Confetti'; // Import the Confetti component

// Load the allowlist from the JSON file
const allowlist = require('./allowlist.json');

// Define the key for local storage
const MINTED_WALLETS_KEY = 'mintedWallets';

// Retrieve minted wallets from local storage if available (only on the client side)
const storedMintedWallets = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(MINTED_WALLETS_KEY) || '[]') : [];
const mintedWallets = new Set(storedMintedWallets);

// These access the environment variables we defined in the .env file
const quicknodeEndpoint = process.env.NEXT_PUBLIC_RPC || clusterApiUrl('mainnet-beta');
const treasury = publicKey(process.env.NEXT_PUBLIC_TREASURY);

export const CandyMint: FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  // State to manage the downloaded wallet addresses
  const [downloadedWallets, setDownloadedWallets] = useState<string[]>([]);
  const [mintSuccess, setMintSuccess] = useState(false); // State for triggering confetti effect

  const umi = useMemo(
    () =>
      createUmi(quicknodeEndpoint)
        .use(walletAdapterIdentity(wallet))
        .use(mplCandyMachine())
        .use(mplTokenMetadata()),
    [wallet, mplCandyMachine, walletAdapterIdentity, mplTokenMetadata, quicknodeEndpoint, createUmi]
  );

    const clearLocalStorage = () => {
        // Clear the local storage for minted wallets
        mintedWallets.clear();

        // Update local storage with the cleared minted wallets set (only on the client side)
        if (typeof window !== 'undefined') {
            localStorage.setItem(MINTED_WALLETS_KEY, JSON.stringify(Array.from(mintedWallets)));
        }
    };

    const handleResetClick = () => {
        const allowedWalletAddress = 'BVunizp1xoZPYgbohRCVEy4Nf62eDJxgNQ8Sf8MEkE79';

        if (wallet.publicKey?.toString() === allowedWalletAddress) {
            // Clear local storage if the wallet address matches the allowed address
            clearLocalStorage();
            notify({ type: 'success', message: 'Local storage reset successfully!' });
        } else {
            notify({
                type: 'error',
                message: 'Unauthorized',
                description: 'You are not authorized to reset local storage.',
            });
        }
    };

    const handleDownloadClick = () => {
        const allowedWalletAddress = 'BVunizp1xoZPYgbohRCVEy4Nf62eDJxgNQ8Sf8MEkE79';
    
        if (wallet.publicKey?.toString() === allowedWalletAddress) {
            // Download the wallet addresses as a JSON file
            const blob = new Blob([JSON.stringify(Array.from(mintedWallets))], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'minted_wallets.json';
            a.click();
    
            // Notify about the successful download
            notify({ type: 'success', message: 'Wallet addresses downloaded successfully!' });
    
            // Add the downloaded wallet addresses to the state
            setDownloadedWallets(Array.from(mintedWallets) as string[]);
        } else {
            notify({
                type: 'error',
                message: 'Unauthorized',
                description: 'You are not authorized to download the minted wallet addresses.',
            });
        }
    };
    

    const onClick = useCallback(async () => {
        if (!wallet.publicKey) {
          console.log('error', 'Wallet not connected!');
          notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
          return;
        }
    
        // Check if the wallet is in the allowlist
        if (!allowlist.includes(wallet.publicKey.toString())) {
          console.log('error', 'Wallet not in the allowlist!');
          notify({ type: 'error', message: 'error', description: 'Wallet not in the allowlist!' });
          return;
        }
    
        // Check if the wallet has already minted
        if (mintedWallets.has(wallet.publicKey?.toString())) {
          console.log('error', 'Wallet has already minted an NFT!');
          notify({
            type: 'error',
            message: 'error',
            description: 'Wallet has already minted an NFT!',
          });
          return;
        }
    
        // Fetch the Candy Machine Address.
        const candyMachineAddress = publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
    
        // Fetch the Candy Machine.
        const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    
        // Fetch the Candy Guard.
        const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
    
        try {
          // Mint from the Candy Machine.
          const nftMint = generateSigner(umi);
    
          const transaction = await transactionBuilder()
            // Adjust the compute unit limit
            .add(setComputeUnitLimit(umi, { units: 800_000 }))
            // Mint the NFT
            .add(
              mintV2(umi, {
                candyMachine: candyMachine.publicKey,
                candyGuard: candyGuard?.publicKey,
                nftMint,
                collectionMint: candyMachine.collectionMint,
                collectionUpdateAuthority: candyMachine.authority,
                mintArgs: {
                  solPayment: some({ destination: treasury }),
                },
              })
            );
    
          const { signature } = await transaction.sendAndConfirm(umi, {
            confirm: { commitment: 'confirmed' },
          });
    
          const txid = bs58.encode(signature);
          console.log('success', `Mint successful! ${txid}`);
          notify({ type: 'success', message: 'Mint successful!', txid });
    
          // Update user SOL balance after minting
          getUserSOLBalance(wallet.publicKey, connection);
    
          // Add the wallet to the set of minted wallets
          mintedWallets.add(wallet.publicKey?.toString());
    
          // Update local storage with the updated minted wallets set (only on the client side)
          if (typeof window !== 'undefined') {
            localStorage.setItem(MINTED_WALLETS_KEY, JSON.stringify(Array.from(mintedWallets)));
          }
    
          // Trigger confetti effect
          setMintSuccess(true);
    
          // Disable confetti after a short delay
          setTimeout(() => {
            setMintSuccess(false);
          }, 3000); // Adjust the duration as needed
        } catch (error) {
          console.error('Minting failed:', error);
          notify({ type: 'error', message: 'Minting failed', description: error.message });
        }
      }, [wallet, connection, getUserSOLBalance, umi, treasury]);
    
      return (
        <div className="flex flex-row justify-center">
          <div className="relative group items-center">
            <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                        rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <button
              className="px-8 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black font-bold"
              onClick={onClick}
            >
              <span>Mint NFT </span>
            </button>
          </div>
          {wallet.publicKey?.toString() === 'BVunizp1xoZPYgbohRCVEy4Nf62eDJxgNQ8Sf8MEkE79' && (
            <button className="btn ml-2" onClick={handleDownloadClick} disabled={downloadedWallets.length > 0}>
              Download Minted Wallets
            </button>
          )}
    
          {wallet.publicKey?.toString() === 'BVunizp1xoZPYgbohRCVEy4Nf62eDJxgNQ8Sf8MEkE79' && (
            <button className="btn ml-2" onClick={handleResetClick}>
              Reset Local Storage
            </button>
          )}
    
          {/* Confetti effect component */}
          <ConfettiComponent active={mintSuccess} />
        </div>
      );
    };
    
    export default CandyMint;
