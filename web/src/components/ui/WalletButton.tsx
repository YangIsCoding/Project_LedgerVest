// src/components/ui/WalletButton.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { FaWallet, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaEthereum, FaNetworkWired } from 'react-icons/fa';

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId(); // Get the current chain ID
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: balanceData, isLoading: balanceIsLoading } = useBalance({
    address: address,
  });

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


  // Copy wallet address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopySuccess(true);
    }
  };

  // Get block explorer URL based on chain ID
  const getExplorerUrl = () => {
    if (!address || !chainId) return '#';

    // Define block explorers for different networks
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io/address/', // Ethereum Mainnet
      59141: 'https://sepolia.etherscan.io/address/',
    };

    const baseUrl = explorers[chainId] || 'https://etherscan.io/address/';
    return `${baseUrl}${address}`;
  };

  // Get network name based on chain ID
  const getNetworkName = (chainId: number | undefined): string => {
    if (!chainId) return 'Unknown Network';

    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      59141: 'Sepolia Testnet',
    };

    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  const handleConnect = (connector: any) => {
    connect({ connector });
    setIsMenuOpen(true); // Open the menu after connecting
  };

  const handleDisconnect = () => {
    disconnect();
    setIsMenuOpen(false); // Close the menu after disconnecting
  };

  // Format the address: show first 6 and last 4 characters
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {isConnected ? (
        <>
          <button
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaWallet className="mr-1" />
            <span>{address ? formatAddress(address) : 'N/A'}</span>
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
                    {address}
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
                  <span className="text-sm font-mono text-black">
                    {balanceIsLoading ? 'Loading...' : balanceData ? `${balanceData.formatted} ${balanceData.symbol}` : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaNetworkWired className="text-gray-500 mr-2" />
                    <span className="text-sm font-semibold text-gray-700">Network</span>
                  </div>
                  <span className="text-sm text-black">
                    {getNetworkName(chainId)}
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
                    handleDisconnect();
                    setIsMenuOpen(false);
                  }}
                >
                  <FaSignOutAlt className="mr-2" />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        connectors.map((connector) => (
          <button
            key={connector.id}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => handleConnect(connector)}
          >
            <FaWallet className="mr-1" />
            <span>Connect Wallet</span>
          </button>
        ))
      )}
    </div>
  );
}