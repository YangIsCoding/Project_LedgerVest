
'use client';
export const dynamic = 'force-dynamic';
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
  requestId: string | null;
  hasApproved?: boolean;
  timestamp: string; 
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
  const [ isManager, setIsManager ] = useState( false );
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [campaignTargetAmount, setCampaignTargetAmount] = useState('');
  const [ campaignCreatedAt, setCampaignCreatedAt ] = useState( '' );
  const [campaignContactInfo, setCampaignContactInfo] = useState('');


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
        const campaign = await getCampaignContract( address as string );
        const createdAt = await campaign.createdAt();
        setCampaignCreatedAt(new Date(Number(createdAt) * 1000).toLocaleString());

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
        setApproversCount( approversCountBN.toString() );
        const title = await campaign.title();
        const description = await campaign.description();
        const targetAmount = await campaign.targetAmount();
        const contactInfo = await campaign.contactInfo();

        setCampaignTitle(title);
        setCampaignDescription(description);
        setCampaignTargetAmount(targetAmount.toString());
        setCampaignContactInfo(contactInfo);

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

async function loadRequests() {
  try {
    const campaign = await getCampaignContract(address as string);

    const filter1 = campaign.filters.RequestCreated();
    const requestEvents = await campaign.queryFilter(filter1, 0, 'latest');

    const provider = getProvider();
    const filter = campaign.filters.RequestApproved(null, null);
    const approvalEvents = await campaign.queryFilter(filter, 0, 'latest');

    const approversCountBN = await campaign.approversCount();
    const approversCount = Number(approversCountBN);

    const requestsArray: Request[] = await Promise.all(requestEvents.map(async (ev, index) => {
      const eventLog = ev as ethers.EventLog;

      // ⭐ call getRequest(index) → 確保拿到最新狀態
      const [desc, val, recipient, complete, approvalCount] = await campaign.getRequest(index);

      const hasApproved = approvalEvents.some(
        (approvalEv) => {
          const approvalEventLog = approvalEv as ethers.EventLog;
          return approvalEventLog.args &&
            Number(approvalEventLog.args.index) === index &&
            approvalEventLog.args.approver.toLowerCase() === account?.toLowerCase();
        }
      );

      const timestamp = eventLog.args?.timestamp
      ? new Date(Number(eventLog.args.timestamp) * 1000).toLocaleString()
      : 'N/A';

      return {
        description: desc,
        value: val.toString(),
        recipient,
        complete,
        approvalCount: Number(approvalCount),
        approvers: approversCount,
        index,
        requestId: `${address}-${index}`,
        hasApproved,
        timestamp
      };
    }));

    console.log('Final requestsArray:', requestsArray);
    setRequests(requestsArray);
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

      const valueInWei = ethers.parseEther(requestAmount);
      const campaignWithSigner = await getCampaignContractWithSigner(address as string);

      const tx = await campaignWithSigner.createRequest(
        requestDescription,
        valueInWei,
        requestRecipient
      );

      setMessage({ text: 'Processing transaction...', type: 'info' });
      const receipt = await tx.wait();

      // 計算 gas 成本
      const gasCost = tx.gasPrice && receipt.gasUsed
        ? ethers.formatEther(tx.gasPrice * receipt.gasUsed)
        : '0';
      setMessage({ text: 'Request created successfully!', type: 'success' });
      setRequestDescription('');
      setRequestAmount('');
      setRequestRecipient('');
      setShowCreateForm(false);

      // Refresh requests
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
  // Approve a request
  async function handleApproveRequest ( index: number )
  {
  const requestId = requests[index]?.requestId;
  console.log('Approving request with:', { index, requestId }); // 調試用

  try {
    setMessage({ text: '', type: '' });

    const campaignWithSigner = await getCampaignContractWithSigner(address as string);
    const tx = await campaignWithSigner.approveRequest(index);

    setMessage({ text: 'Processing approval...', type: 'info' });
    await tx.wait();

    setMessage({ text: 'Request approved successfully!', type: 'success' });

    // 重新載入 requests → 從鏈上 event + /api/requests 抓最新狀態
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
  try
  {
    const requestId = requests[index]?.requestId;
    setMessage({ text: '', type: '' });

    const campaignWithSigner = await getCampaignContractWithSigner(address as string);
    const tx = await campaignWithSigner.finalizeRequest(index);

    setMessage({ text: 'Finalizing request...', type: 'info' });
    const receipt = await tx.wait();

    const gasCost = tx.gasPrice && receipt.gasUsed
      ? ethers.formatEther(tx.gasPrice * receipt.gasUsed)
      : '0';

    setMessage({ text: 'Request finalized successfully!', type: 'success' });
    await loadRequests();
    const provider = getProvider();
    const newBalance = await provider.getBalance(address as string);
    setBalance(newBalance.toString());
  } catch (err: any) {
    console.error("Finalize request failed:", err);
    setMessage({
      text: err.reason || err.message || 'Failed to finalize request.',
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
          {campaignTitle && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{campaignTitle}</h2>
              <p className="text-gray-600 mt-1">{campaignDescription}</p>
             <p className="text-sm text-gray-500 mt-2">
              🎯 Target: {formatEther(campaignTargetAmount)} ETH ({campaignTargetAmount} Wei)
            </p>
              <p className="text-sm text-gray-400">📅 Created at: {campaignCreatedAt}</p>
              <p className="text-sm text-gray-400">📩 Contact: {campaignContactInfo}</p>
            </div>
          )}
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