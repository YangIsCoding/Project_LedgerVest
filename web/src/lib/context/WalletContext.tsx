'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback
} from 'react';
import { ethers } from 'ethers';
import { useAccount, useChainId } from 'wagmi';
import CampaignFactory from '@/utils/abis/CampaignFactory.json';
import { setCookie } from 'nookies';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  error: string | null;
  balance: string | null;
  networkName: string | null;
  factoryAddress: string | null;
  campaigns: string[];
  loadCampaigns: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [factoryAddress, setFactoryAddress] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 初始化 provider → 用 useEffect，避免 server-side 出錯
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
    } else {
      setProvider(null);
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    if (!provider) {
      setError('No provider available');
      return;
    }
    try {
      const { CampaignFactory: factoryAddr } = await import(
        '@/utils/abis/contract-address.json'
      );
      setFactoryAddress(factoryAddr);
      const factory = new ethers.Contract(factoryAddr, CampaignFactory.abi, provider);
      const deployedCampaigns = await factory.getDeployedCampaigns();
      setCampaigns(deployedCampaigns);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
      setError('Failed to load campaigns');
    }
  }, [provider]);

  const getNetworkName = useCallback((chainId: number): string => {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      59141: 'Sepolia Testnet',
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  }, []);

  useEffect(() => {
    if (provider && address) {
      provider
        .getSigner()
        .then((s) => setSigner(s))
        .catch((err) => {
          console.error('Error fetching signer:', err);
          setSigner(null);
        });
      provider
        .getBalance(address)
        .then((rawBalance) => {
          const formatted = ethers.formatEther(rawBalance);
          setBalance(parseFloat(formatted).toFixed(4));
        })
        .catch((err) => {
          console.error('Error fetching balance:', err);
          setBalance(null);
        });
    } else {
      setSigner(null);
      setBalance(null);
    }
  }, [provider, address]);

  useEffect(() => {
    if (isConnected && chainId) {
      setNetworkName(getNetworkName(chainId));
    } else {
      setNetworkName(null);
    }
  }, [isConnected, chainId, getNetworkName]);

  useEffect(() => {
    if (isConnected && address) {
      setCookie(null, 'walletAddress', address, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      console.log('[WalletProvider] cookie set:', address);
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected) {
      loadCampaigns();
    } else {
      setCampaigns([]);
      setFactoryAddress(null);
    }
  }, [isConnected, loadCampaigns]);

  const value: WalletContextType = {
    isConnected,
    account: address || null,
    chainId: chainId || null,
    provider,
    signer,
    error,
    balance,
    networkName,
    factoryAddress,
    campaigns,
    loadCampaigns
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

declare global {
  interface Window {
    ethereum?: any;
  }
}
