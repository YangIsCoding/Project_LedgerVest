'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaWallet, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaEthereum, FaNetworkWired, FaUserCircle } from 'react-icons/fa';

export default function UserWalletButton() {
  const router = useRouter();

  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect: disconnectWallet } = useDisconnect();
  const chainId = useChainId();
  const { data: balanceData, isLoading: balanceIsLoading } = useBalance({ address });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopySuccess(true);
    }
  };

  const getExplorerUrl = () => {
    if (!address || !chainId) return '#';
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io/address/',
      59141: 'https://sepolia.etherscan.io/address/',
    };
    const baseUrl = explorers[chainId] || `https://etherscan.io/address/`;
    return `${baseUrl}${address}`;
  };

  const getNetworkName = (id: number | undefined): string => {
    if (!id) return 'Unknown Network';
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      59141: 'Linea Sepolia',
    };
    return networks[id] || `Chain ID: ${id}`;
  };

  const handleConnectWallet = () => {
    const injectedConnector = connectors.find(c => c.id === 'metaMaskSDK');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else {
      console.error("Injected connector not found");
    }
  };

  const handleDisconnect = () => {
    setIsMenuOpen(false);
    if (isConnected) {
      disconnectWallet();
      router.push('/');
    }
  };

  const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  // Loading state
  if (isConnecting) {
    return (
      <button className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed" disabled>
        <FaUserCircle className="mr-1" />
        <span>Connecting...</span>
      </button>
    );
  }

  // Not connected
  if (!isConnected || !address) {
    return (
      <button
        onClick={handleConnectWallet}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaWallet />
        <span>Connect Wallet</span>
      </button>
    );
  }

  // Connected
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaUserCircle className="mr-1" />
        <span>{formatAddress(address)}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20 overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 truncate max-w-[160px]" title={address}>
                {formatAddress(address)}
              </span>
              <div className="flex items-center space-x-2">
                {copySuccess && <span className="text-xs text-green-600">✓</span>}
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={copyAddress}
                  title="Copy address"
                >
                  <FaCopy />
                </button>
                <a
                  href={getExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="View on Explorer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaExternalLinkAlt size={14} />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center text-gray-600">
                <FaEthereum className="mr-1" size={12} /> Balance:
              </div>
              <span className="font-mono text-gray-800">
                {balanceIsLoading ? '...' : balanceData ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <FaNetworkWired className="mr-1" size={12} /> Network:
              </div>
              <span className="text-gray-800">{getNetworkName(chainId)}</span>
            </div>
          </div>

          <div className="p-2">
            <button
              className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
              onClick={handleDisconnect}
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
