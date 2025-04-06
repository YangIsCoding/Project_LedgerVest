'use client';

import {
	createContext,
	useContext,
	ReactNode,
	useState,
	useEffect,
	useCallback,
	useMemo
} from 'react';
import { ethers } from 'ethers';
import { useAccount, useChainId } from 'wagmi';
import CampaignFactory from '@/utils/abis/CampaignFactory.json';

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
	const [balance, setBalance] = useState<string | null>(null);
	const [networkName, setNetworkName] = useState<string | null>(null);
	const [factoryAddress, setFactoryAddress] = useState<string | null>(null);
	const [campaigns, setCampaigns] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

	// Memoize provider so it doesn't get recreated on every render
	const provider = useMemo(() => {
		if (typeof window !== 'undefined' && window.ethereum) {
			return new ethers.BrowserProvider(window.ethereum);
		}
		return null;
	}, []);

	// Load campaigns from factory contract
	const loadCampaigns = useCallback(async () => {
		if (!provider) {
			setError('No provider available');
			return;
		}
		try {
			// Load factory address from config (assumes you have a contract-address.json)
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

	// Map chainId to network name
	const getNetworkName = useCallback((chainId: number): string => {
		const networks: Record<number, string> = {
			1: 'Ethereum Mainnet',
			59141: 'Sepolia Testnet',
		};
		return networks[chainId] || `Chain ID: ${chainId}`;
	}, []);

	// Update signer and Fetch account balance when provider and address are available
	useEffect(() => {
		if (provider && address) {
			// Update signer
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


	// Reload campaigns when wallet connects
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