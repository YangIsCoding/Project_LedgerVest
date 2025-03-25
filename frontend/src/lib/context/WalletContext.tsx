// src/lib/context/WalletContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
  balance: string | null;
  networkName: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize wallet connection if already connected
  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Setup event listeners
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);
          window.ethereum.on('disconnect', handleDisconnect);
          
          // Check if already connected
          await checkConnection();
        } catch (err) {
          console.error("Error setting up wallet connection:", err);
        }
      }
    };

    init();

    // Cleanup event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  // Update account balance when account changes
  useEffect(() => {
    if (provider && account) {
      fetchBalance();
    }
  }, [provider, account]);

  // Helper function to get network name
  const getNetworkName = (chainId: number): string => {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
      56: 'BNB Smart Chain',
      97: 'BNB Testnet',
      42161: 'Arbitrum One',
      421613: 'Arbitrum Goerli',
      10: 'Optimism',
      420: 'Optimism Goerli',
      43114: 'Avalanche C-Chain',
      43113: 'Avalanche Fuji'
    };
    
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  // Fetch account balance
  const fetchBalance = async () => {
    if (provider && account) {
      try {
        const rawBalance = await provider.getBalance(account);
        // Format balance to show in ETH with 4 decimal places
        const formattedBalance = ethers.utils.formatEther(rawBalance);
        const trimmedBalance = parseFloat(formattedBalance).toFixed(4);
        setBalance(trimmedBalance);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setBalance(null);
      }
    }
  };

  // Check if wallet is already connected
  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Create ethers provider
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Get accounts
        const accounts = await ethersProvider.listAccounts();
        
        if (accounts && accounts.length > 0) {
          const network = await ethersProvider.getNetwork();
          const ethersSigner = ethersProvider.getSigner();
          
          setIsConnected(true);
          setAccount(accounts[0]);
          setChainId(network.chainId);
          setNetworkName(getNetworkName(network.chainId));
          setProvider(ethersProvider);
          setSigner(ethersSigner);
        }
      } catch (err) {
        console.error("Failed to check wallet connection:", err);
        setError("Failed to check wallet connection");
      }
    }
  };

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    setError(null);
    
    if (typeof window === 'undefined') return;
    
    if (!window.ethereum) {
      setError("No Ethereum wallet found. Please install MetaMask.");
      return;
    }
    
    try {
      // Show loading state if needed
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Create ethers provider
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await ethersProvider.getNetwork();
      const ethersSigner = ethersProvider.getSigner();
      
      // Update state
      setIsConnected(true);
      setAccount(accounts[0]);
      setChainId(network.chainId);
      setNetworkName(getNetworkName(network.chainId));
      setProvider(ethersProvider);
      setSigner(ethersSigner);
    } catch (err: any) {
      // Handle user rejected request
      if (err.code === 4001) {
        setError("Connection request rejected");
      } else {
        console.error("Failed to connect wallet:", err);
        setError(err.message || "Failed to connect wallet");
      }
    }
  };

  // Disconnect wallet (for UI purposes only - MetaMask doesn't actually disconnect)
  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setNetworkName(null);
    setProvider(null);
    setSigner(null);
    setBalance(null);
  };

  // Handle account change events
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else {
      // User switched accounts
      setAccount(accounts[0]);
    }
  };

  // Handle network change events
  const handleChainChanged = (chainIdHex: string) => {
    // Need to reload provider on chain change
    window.location.reload();
  };

  // Handle disconnect events
  const handleDisconnect = (error: { code: number; message: string }) => {
    console.log("Wallet disconnected:", error);
    disconnectWallet();
  };

  const value = {
    isConnected,
    account,
    chainId,
    networkName,
    provider,
    signer,
    balance,
    connectWallet,
    disconnectWallet,
    error
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Add a type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}