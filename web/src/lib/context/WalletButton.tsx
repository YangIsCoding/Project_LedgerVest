// src/components/ui/WalletButton.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/lib/context/WalletContext';
import { FaWallet, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaEthereum, FaNetworkWired } from 'react-icons/fa';

export default function WalletButton() {
  const { 
    isConnected, 
    account, 
    balance, 
    networkName,
    connectWallet, 
    disconnectWallet, 
    chainId, 
    error 
  } = useWallet();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset copy success message after 2 seconds
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  // Format address for display (e.g., 0x1234...5678)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Copy wallet address to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopySuccess(true);
    }
  };

  // Get block explorer URL based on chain ID
  const getExplorerUrl = () => {
    if (!account) return '#';
    
    // Define block explorers for different networks
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io/address/', // Ethereum Mainnet
      5: 'https://goerli.etherscan.io/address/', // Goerli Testnet
      11155111: 'https://sepolia.etherscan.io/address/', // Sepolia Testnet
      137: 'https://polygonscan.com/address/', // Polygon Mainnet
      80001: 'https://mumbai.polygonscan.com/address/', // Mumbai Testnet
      56: 'https://bscscan.com/address/', // BSC Mainnet
      97: 'https://testnet.bscscan.com/address/', // BSC Testnet
      42161: 'https://arbiscan.io/address/', // Arbitrum One
      421613: 'https://goerli.arbiscan.io/address/', // Arbitrum Goerli
      10: 'https://optimistic.etherscan.io/address/', // Optimism
      420: 'https://goerli-optimism.etherscan.io/address/', // Optimism Goerli
      43114: 'https://snowtrace.io/address/', // Avalanche C-Chain
      43113: 'https://testnet.snowtrace.io/address/' // Avalanche Fuji
    };
    
    const baseUrl = explorers[chainId || 1] || 'https://etherscan.io/address/';
    return `${baseUrl}${account}`;
  };

  // Show error as tooltip or notification if needed
  if (error) {
    console.error("Wallet error:", error);
    // You could add a toast notification here
  }

  if (isConnected && account) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaWallet className="mr-1" />
          <span>{formatAddress(account)}</span>
        </button>
        
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Account</span>
                {copySuccess ? (
                  <span className="text-xs text-green-600">✓ Copied!</span>
                ) : null}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate max-w-[150px]">
                  {account}
                </span>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={copyAddress}
                >
                  <FaCopy />
                </button>
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FaEthereum className="text-gray-500 mr-2" />
                  <span className="text-sm font-semibold text-gray-700">Balance</span>
                </div>
                <span className="text-sm font-mono">
                  {balance ? `${balance} ETH` : 'Loading...'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaNetworkWired className="text-gray-500 mr-2" />
                  <span className="text-sm font-semibold text-gray-700">Network</span>
                </div>
                <span className="text-sm">
                  {networkName || 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="p-2">
              <a
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                href={getExplorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaExternalLinkAlt className="mr-2" />
                View on Explorer
              </a>
              
              <button
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  disconnectWallet();
                  setIsMenuOpen(false);
                }}
              >
                <FaSignOutAlt className="mr-2" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      onClick={connectWallet}
    >
      <FaWallet className="mr-1" />
      <span>Connect Wallet</span>
    </button>
  );
}