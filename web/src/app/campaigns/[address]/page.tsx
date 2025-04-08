'use client';

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import {
  getProvider,
  getCampaignContract,
  getCampaignContractWithSigner,
  formatEther
} from '@/utils/ethers';
import { FaArrowLeft, FaCheckCircle, FaEthereum, FaExclamationTriangle, FaPlus, FaUsers, FaWallet } from 'react-icons/fa';
import CampaignDetails from '@/components/campaigns/CampaignDetails';
import SpendingRequests from '@/components/campaigns/SpendingRequests';
import ContributeSection from '@/components/campaigns/ContributeSection';

// Request type interface
interface Request {
  description: string;
  value: string;
  recipient: string;
  complete: boolean;
  approvalCount: number;
  approvers: number;
  index: number;
  hasApproved?: boolean;
}

export default function CampaignPage() {
  const router = useRouter();
  const params = useParams();
  const address = params?.address as string | undefined;

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Invalid campaign address.</p>
      </div>
    );
  }
  const { isConnected, account } = useWallet();

  // Campaign state
  const [manager, setManager] = useState("");
  const [minimumContribution, setMinimumContribution] = useState("0");
  const [balance, setBalance] = useState("0");
  const [approversCount, setApproversCount] = useState("0");
  const [requests, setRequests] = useState<Request[]>([]);
  const [isApprover, setIsApprover] = useState(false);
  const [isManager, setIsManager] = useState(false);

  // UI state
  const [contributionAmount, setContributionAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isContributing, setIsContributing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Create request form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [requestDescription, setRequestDescription] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [requestRecipient, setRequestRecipient] = useState("");
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);

  // Load campaign data
  useEffect(() => {
    if (!isConnected) return;

    async function loadCampaignData() {
      try {
        setIsLoading(true);

        // Get campaign contract
        const campaign = await getCampaignContract(address as string);

        // Get basic campaign info
        const mgr = await campaign.manager();
        const minContr = await campaign.minimumContribution();
        const approversCountBN = await campaign.approversCount();

        // Check if current user is manager
        const isCurrentManager = !!(account && mgr.toLowerCase() === account.toLowerCase());
        setIsManager(isCurrentManager);

        // Check if current user is an approver
        if (account) {
          const isUserApprover = await campaign.approvers(account);
          setIsApprover(isUserApprover);
        }

        // Get contract balance
        const provider = getProvider();
        const bal = await provider.getBalance(address as string);

        // Update state
        setManager(mgr);
        setMinimumContribution(minContr.toString());
        setBalance(bal.toString());
        setApproversCount(approversCountBN.toString());

        // Load requests
        await loadRequests();

        setIsLoading(false);
      } catch (err) {
        console.error("Error loading campaign data:", err);
        setIsLoading(false);
        setMessage({
          text: 'Failed to load campaign data. The campaign may not exist or the network may be unavailable.',
          type: 'error'
        });
      }
    }

    loadCampaignData();
  }, [address, isConnected, account]);

  // Load requests
  async function loadRequests() {
    try {
      const campaign = await getCampaignContract(address as string);

      // Get request count
      let requestCount = 0;
      let currentIndex = 0;
      let foundRequest = true;

      // Since there's no direct way to get request count, we'll try getting requests
      // until we find an error, which means we've reached the end
      const requestsArray: Request[] = [];

      while (foundRequest) {
        try {
          const request = await campaign.requests(currentIndex);

          // Add to requests array
          requestsArray.push({
            description: request.description,
            value: request.value.toString(),
            recipient: request.recipient,
            complete: request.complete,
            approvalCount: Number(request.approvalCount),
            approvers: Number(await campaign.approversCount()),
            index: currentIndex
          });

          currentIndex++;
        } catch (error) {
          // No more requests
          foundRequest = false;
        }
      }

      // If user is an approver, check which requests they've approved
      if (isApprover && account) {
        const updatedRequests = await Promise.all(
          requestsArray.map(async (request) => {
            try {
              // Unfortunately, we can't directly access the approvals mapping from outside
              // so this would require a contract modification to expose this information
              // For now, we'll leave this as a placeholder
              return { ...request, hasApproved: false };
            } catch (error) {
              return { ...request, hasApproved: false };
            }
          })
        );

        setRequests(updatedRequests);
      } else {
        setRequests(requestsArray);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
    }
  }

  // Contribute to campaign
  async function handleContribute() {
    if (!contributionAmount) {
      setMessage({ text: 'Please enter a contribution amount', type: 'error' });
      return;
    }

    try {
      setIsContributing(true);
      setMessage({ text: '', type: '' });

      const valueInWei = ethers.parseEther(contributionAmount);
      const campaignWithSigner = await getCampaignContractWithSigner(address as string);
      
      // 發送交易
      const tx = await campaignWithSigner.contribute({ value: valueInWei });

      setMessage({ text: 'Processing transaction...', type: 'info' });
      const receipt = await tx.wait();

      // 計算 gas cost（ETH）
      const gasCost = tx.gasPrice && receipt.gasUsed
        ? ethers.formatEther(tx.gasPrice * receipt.gasUsed)
        : '0';

      // 送資料到 API 儲存 contribution
      await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: receipt.hash,
          contributorAddress: account,
          campaignAddress: address,
          amount: contributionAmount,
          gasCost,
          note: '' // optional: 可讓用戶自訂備註
        })
      });

      // 更新 UI
      setMessage({ text: 'Contribution successful!', type: 'success' });
      setContributionAmount('');
      setIsApprover(true);

      const provider = getProvider();
      const newBalance = await provider.getBalance(address as string);
      setBalance(newBalance.toString());

      const campaign = await getCampaignContract(address as string);
      const approversCountBN = await campaign.approversCount();
      setApproversCount(approversCountBN.toString());
    } catch (err: any) {
      console.error("Contribute failed:", err);
      setMessage({
        text: err.reason || err.message || 'Contribution failed. Please try again.',
        type: 'error'
      });
    } finally {
      setIsContributing(false);
    }
  }


  // Create a new request
  async function handleCreateRequest(e: React.FormEvent) {
    e.preventDefault();

    if (!requestDescription || !requestAmount || !requestRecipient) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }

    try {
      setIsCreatingRequest(true);
      setMessage({ text: '', type: '' });

      // Convert ETH to Wei
      const valueInWei = ethers.parseEther(requestAmount);

      // Get signer contract
      const campaignWithSigner = await getCampaignContractWithSigner(address as string);

      // Create request transaction
      const tx = await campaignWithSigner.createRequest(
        requestDescription,
        valueInWei,
        requestRecipient
      );

      // Wait for transaction to complete
      setMessage({ text: 'Processing transaction...', type: 'info' });
      await tx.wait();

      // Update UI
      setMessage({ text: 'Request created successfully!', type: 'success' });
      setRequestDescription('');
      setRequestAmount('');
      setRequestRecipient('');
      setShowCreateForm(false);

      // Reload requests
      await loadRequests();
    } catch (err: any) {
      console.error("Create request failed:", err);
      setMessage({
        text: err.reason || err.message || 'Failed to create request. Please try again.',
        type: 'error'
      });
    } finally {
      setIsCreatingRequest(false);
    }
  }

  // Approve a request
  async function handleApproveRequest(index: number) {
    try {
      setMessage({ text: '', type: '' });

      // Get signer contract
      const campaignWithSigner = await getCampaignContractWithSigner(address as string);

      // Approve request transaction
      const tx = await campaignWithSigner.approveRequest(index);

      // Wait for transaction to complete
      setMessage({ text: 'Processing approval...', type: 'info' });
      await tx.wait();

      // Update UI
      setMessage({ text: 'Request approved successfully!', type: 'success' });

      // Reload requests
      await loadRequests();
    } catch (err: any) {
      console.error("Approve request failed:", err);
      setMessage({
        text: err.reason || err.message || 'Failed to approve request. Please try again.',
        type: 'error'
      });
    }
  }

  // Finalize a request
  async function handleFinalizeRequest(index: number) {
    try {
      setMessage({ text: '', type: '' });

      // Get signer contract
      const campaignWithSigner = await getCampaignContractWithSigner(address as string);

      // Finalize request transaction
      const tx = await campaignWithSigner.finalizeRequest(index);

      // Wait for transaction to complete
      setMessage({ text: 'Processing finalization...', type: 'info' });
      await tx.wait();

      // Update UI
      setMessage({ text: 'Request finalized successfully!', type: 'success' });

      // Reload data
      const provider = getProvider();
      const newBalance = await provider.getBalance(address as string);
      setBalance(newBalance.toString());

      // Reload requests
      await loadRequests();
    } catch (err: any) {
      console.error("Finalize request failed:", err);
      setMessage({
        text: err.reason || err.message || 'Failed to finalize request. Please try again.',
        type: 'error'
      });
    }
  }

  // Display formatted ETH amount
  function displayEther(wei: string) {
    try {
      return formatEther(wei);
    } catch (error) {
      return '0';
    }
  }


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Campaigns
      </Link>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' :
            message.type === 'success' ? 'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'
          }`}>
          {message.type === 'error' ? <FaExclamationTriangle className="inline mr-2" /> :
            message.type === 'success' ? <FaCheckCircle className="inline mr-2" /> : null}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CampaignDetails
            address={address as string}
            manager={manager}
            minimumContribution={minimumContribution}
            balance={balance}
            approversCount={approversCount}
            isManager={isManager}
            displayEther={displayEther}
          />

          <SpendingRequests
            isManager={isManager}
            showCreateForm={showCreateForm}
            setShowCreateForm={setShowCreateForm}
            handleCreateRequest={handleCreateRequest}
            requestDescription={requestDescription}
            setRequestDescription={setRequestDescription}
            requestAmount={requestAmount}
            setRequestAmount={setRequestAmount}
            requestRecipient={requestRecipient}
            setRequestRecipient={setRequestRecipient}
            isCreatingRequest={isCreatingRequest}
            requests={requests}
            displayEther={displayEther}
            handleApproveRequest={handleApproveRequest}
            handleFinalizeRequest={handleFinalizeRequest}
            isApprover={isApprover}
          />
        </div>

        <div className="lg:col-span-1">
          <ContributeSection
            isApprover={isApprover}
            contributionAmount={contributionAmount}
            setContributionAmount={setContributionAmount}
            minimumContribution={minimumContribution}
            handleContribute={handleContribute}
            isContributing={isContributing}
            displayEther={displayEther}
          />
        </div>
      </div>
    </div>
  );
}