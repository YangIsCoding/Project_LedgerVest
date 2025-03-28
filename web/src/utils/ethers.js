// src/utils/ethers.js
import { ethers } from "ethers";
import factoryArtifact from "./abis/CampaignFactory.json";
import campaignArtifact from "./abis/Campaign.json";
import contractAddress from "./abis/contract-address.json";

/**
 * Get MetaMask (or other injected wallet) Provider.
 * If no window.ethereum is detected, fallback to default provider (e.g. sepolia)
 */
export function getProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    // MetaMask is installed - ethers v6 uses BrowserProvider
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    // No wallet installed, fallback to Infura/Alchemy RPC
    return ethers.getDefaultProvider("sepolia");
  }
}

/**
 * Get CampaignFactory contract instance (read-only)
 */
export async function getFactoryContract() {
  const provider = getProvider();
  const factoryAddr = contractAddress.CampaignFactory;
  const contract = new ethers.Contract(factoryAddr, factoryArtifact.abi, provider);
  return contract;
}

/**
 * Get CampaignFactory contract instance (with signer for transactions)
 * - Requests wallet authorization first
 */
export async function getFactoryContractWithSigner() {
  const provider = getProvider();
  
  // Request account access
  await provider.send("eth_requestAccounts", []); 
  
  // In ethers v6, getSigner() is async
  const signer = await provider.getSigner();

  const factoryAddr = contractAddress.CampaignFactory;
  const contract = new ethers.Contract(factoryAddr, factoryArtifact.abi, signer);
  return contract;
}

/**
 * Get a specific Campaign contract (read-only)
 * @param {string} address - Campaign contract address
 */
export async function getCampaignContract(address) {
  const provider = getProvider();
  const contract = new ethers.Contract(address, campaignArtifact.abi, provider);
  return contract;
}

/**
 * Get a specific Campaign contract with signer (for transactions)
 * @param {string} address - Campaign contract address
 */
export async function getCampaignContractWithSigner(address) {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  
  // In ethers v6, getSigner() is async
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(address, campaignArtifact.abi, signer);
  return contract;
}

/**
 * Format Ethereum balance for display
 * @param {string|BigInt} wei - Amount in wei
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} Formatted ETH amount
 */
export function formatEther(wei, decimals = 4) {
  try {
    // Use ethers.formatEther which now returns a string in v6
    const ethValue = ethers.formatEther(wei);
    return parseFloat(ethValue).toFixed(decimals);
  } catch (error) {
    return '0';
  }
}

/**
 * Parse user input to wei
 * @param {string|number} amount - Amount in ETH
 * @returns {bigint} Amount in wei
 */
export function parseEther(amount) {
  return ethers.parseEther(String(amount));
}