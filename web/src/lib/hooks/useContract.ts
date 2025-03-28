// src/lib/hooks/useContract.ts
import { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { useWallet } from '@/lib/context/WalletContext';

// This hook allows you to interact with a smart contract
export function useContract(
  contractAddress: string,
  contractABI: any[]
): {
  contract: Contract | null;
  isLoading: boolean;
  error: string | null;
} {
  const { signer, provider } = useWallet();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (!contractAddress || !contractABI) {
        setIsLoading(false);
        return;
      }

      try {
        let contractInstance;

        if (signer) {
          // Connected contract instance that can make state changes (write operations)
          contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        } else if (provider) {
          // Read-only contract instance
          contractInstance = new ethers.Contract(contractAddress, contractABI, provider);
        } else {
          setError('No provider or signer available');
          setIsLoading(false);
          return;
        }

        setContract(contractInstance);
        setError(null);
      } catch (err: any) {
        console.error('Failed to initialize contract:', err);
        setError(err.message || 'Failed to initialize contract');
      } finally {
        setIsLoading(false);
      }
    };

    initContract();
  }, [contractAddress, contractABI, signer, provider]);

  return { contract, isLoading, error };
}

// Example ABI for a simple investment contract
export const INVESTMENT_CONTRACT_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function getProjectCount() view returns (uint256)",
  "function getProject(uint256 projectId) view returns (tuple(address owner, string title, string description, uint256 targetAmount, uint256 raisedAmount, uint256 interestRate, uint256 term, uint256 deadline, bool hasCollateral, bool isActive))",
  "function getInvestorProjects(address investor) view returns (uint256[])",
  "function getCompanyProjects(address company) view returns (uint256[])",
  "function getInvestmentAmount(uint256 projectId, address investor) view returns (uint256)",
  
  // Write functions
  "function createProject(string title, string description, uint256 targetAmount, uint256 interestRate, uint256 term, uint256 deadline, bool hasCollateral) payable returns (uint256)",
  "function invest(uint256 projectId) payable returns (bool)",
  "function withdrawFunds(uint256 projectId, uint256 amount, string purpose) returns (bool)",
  "function voteOnWithdrawal(uint256 projectId, uint256 withdrawalId, bool inFavor) returns (bool)",
  "function repayLoan(uint256 projectId) payable returns (bool)",
  
  // Events
  "event ProjectCreated(uint256 indexed projectId, address indexed owner, uint256 targetAmount)",
  "event InvestmentMade(uint256 indexed projectId, address indexed investor, uint256 amount)",
  "event WithdrawalRequested(uint256 indexed projectId, uint256 indexed withdrawalId, uint256 amount, string purpose)",
  "event WithdrawalApproved(uint256 indexed projectId, uint256 indexed withdrawalId)",
  "event WithdrawalRejected(uint256 indexed projectId, uint256 indexed withdrawalId)",
  "event FundsWithdrawn(uint256 indexed projectId, address indexed recipient, uint256 amount)",
  "event InterestPaid(uint256 indexed projectId, address indexed investor, uint256 amount)",
  "event LoanRepaid(uint256 indexed projectId)"
];