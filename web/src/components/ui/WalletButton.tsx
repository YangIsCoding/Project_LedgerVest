// filepath: /home/halcyon/root/fintech512-project_ledgervest/web/src/components/ui/UserWalletButton.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaWallet, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaEthereum, FaNetworkWired, FaUserCircle, FaSignInAlt, FaEdit } from 'react-icons/fa';

export default function UserWalletButton() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect: disconnectWallet } = useDisconnect();
  const chainId = useChainId();
  const { data: balanceData, isLoading: balanceIsLoading } = useBalance({ address });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Existing useEffects for dropdown closing and copy success ---
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
  // --- End of existing useEffects ---

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
      59141: 'https://sepolia.etherscan.io/address/', // Linea Sepolia Testnet
      // Add other networks as needed
    };
    const baseUrl = explorers[chainId] || `https://etherscan.io/address/`; // Default fallback
    return `${baseUrl}${address}`;
  };

  const getNetworkName = (id: number | undefined): string => {
    if (!id) return 'Unknown Network';
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      59141: 'Linea Sepolia',
      // Add other networks
    };
    return networks[id] || `Chain ID: ${id}`;
  };

  const handleConnectWallet = () => {
    // Find the injected connector (e.g., MetaMask)
    const injectedConnector = connectors.find(c => c.id === 'metaMaskSDK');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else {
      // Handle case where injected connector isn't available
      console.error("Injected connector not found");
      // Optionally connect with the first available connector
      // if (connectors.length > 0) {
      //   connect({ connector: connectors[0] });
      // }
    }
    // Keep menu open or closed based on preference, here closing it
    // setIsMenuOpen(false);
  };

  const handleDisconnect = async () => {
    setIsMenuOpen(false);
    if (isConnected) {
      disconnectWallet(); // Disconnect wagmi
    }
    await signOut({ redirect: false }); // Sign out from NextAuth, don't redirect automatically
    router.push('/'); // Manually redirect to home or login page after sign out
  };

  const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  // Loading state for session
  if (sessionStatus === 'loading') {
    return (
      <button className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed" disabled>
        <FaUserCircle className="mr-1" />
        <span>Loading...</span>
      </button>
    );
  }

  // Logged Out State
  if (sessionStatus === 'unauthenticated' || !session) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaSignInAlt className="mr-1" />
        <span>Sign in</span>
      </button>
    );
  }

  // Logged In State
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaUserCircle className="mr-1" />
        <span>{session.user?.username || session.user?.email || 'Account'}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20 overflow-hidden border border-gray-200">
          {/* User Info Section */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
             <div className="flex items-center mb-2">
                <FaUserCircle className="text-gray-500 mr-2" />
                <span className="text-sm font-semibold text-gray-800 truncate">{session.user?.username || 'N/A'}</span>
             </div>
             <div className="flex items-center">
                <span className="text-xs text-gray-500 truncate">{session.user?.email || 'No email'}</span>
             </div>
          </div>

          {/* Wallet Section */}
          <div className="p-4 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Wallet</span>
            {isConnected && address ? (
              <>
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
                      <FaExternalLinkAlt size={14}/>
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center text-gray-600">
                    <FaEthereum className="mr-1" size={12}/> Balance:
                  </div>
                  <span className="font-mono text-gray-800">
                    {balanceIsLoading ? '...' : balanceData ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center text-gray-600">
                     <FaNetworkWired className="mr-1" size={12}/> Network:
                   </div>
                  <span className="text-gray-800">{getNetworkName(chainId)}</span>
                </div>
              </>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                <FaWallet />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>

          {/* Actions Section */}
          <div className="p-2">
             <Link
                href="/profile-edit" // Adjust this path to your profile edit page
                className="flex w-full items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
             >
                <FaEdit className="mr-2" />
                Edit Profile
             </Link>
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