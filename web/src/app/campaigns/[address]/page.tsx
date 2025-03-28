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
import { FaArrowLeft, FaEthereum, FaUsers, FaWallet, FaPlus, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

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
  const { address } = useParams();
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
        const isCurrentManager = account && mgr.toLowerCase() === account.toLowerCase();
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
      
      // Convert ETH to Wei
      const valueInWei = ethers.parseEther(contributionAmount);
      
      // Get signer contract
      const campaignWithSigner = await getCampaignContractWithSigner(address as string);
      
      // Send contribution transaction
      const tx = await campaignWithSigner.contribute({ value: valueInWei });
      
      // Wait for transaction to complete
      setMessage({ text: 'Processing transaction...', type: 'info' });
      await tx.wait();
      
      // Update UI
      setMessage({ text: 'Contribution successful!', type: 'success' });
      setContributionAmount('');
      setIsApprover(true);
      
      // Reload data
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
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
          <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
          <p className="mb-4 text-gray-600">Please connect your wallet to view campaign details.</p>
        </div>
      </div>
    );
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
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 
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
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">Campaign Details</h1>
              <p className="text-gray-500 break-all mb-4">Address: {address}</p>
              
              <div className="border-t pt-4 mt-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1">Campaign Manager</h2>
                  <p className="text-gray-700 break-all">
                    {manager}
                    {isManager && <span className="ml-2 text-green-600 text-sm">(You)</span>}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Minimum Contribution</div>
                    <div className="font-medium flex items-center">
                      <FaEthereum className="mr-1 text-gray-700" />
                      <span>{displayEther(minimumContribution)} ETH</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Campaign Balance</div>
                    <div className="font-medium flex items-center">
                      <FaEthereum className="mr-1 text-gray-700" />
                      <span>{displayEther(balance)} ETH</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Contributors</div>
                    <div className="font-medium flex items-center">
                      <FaUsers className="mr-1 text-gray-700" />
                      <span>{approversCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Spending Requests</h2>
                {isManager && (
                  <button 
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center text-sm"
                  >
                    <FaPlus className="mr-2" />
                    {showCreateForm ? 'Cancel' : 'New Request'}
                  </button>
                )}
              </div>
              
              {showCreateForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">Create New Request</h3>
                  <form onSubmit={handleCreateRequest}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={requestDescription}
                        onChange={(e) => setRequestDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Purpose of the spending request"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value (ETH)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEthereum className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          value={requestAmount}
                          onChange={(e) => setRequestAmount(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border rounded-lg"
                          placeholder="Amount in ETH"
                          step="0.0001"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                      <input
                        type="text"
                        value={requestRecipient}
                        onChange={(e) => setRequestRecipient(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="0x..."
                        required
                      />
                    </div>
                    
                    <div className="text-right">
                      <button
                        type="submit"
                        disabled={isCreatingRequest}
                        className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 ${
                          isCreatingRequest ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isCreatingRequest ? 'Creating...' : 'Create Request'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {requests.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No spending requests have been created yet.</p>
                  {isManager && !showCreateForm && (
                    <button 
                      onClick={() => setShowCreateForm(true)}
                      className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                    >
                      <FaPlus className="mr-2" />
                      Create First Request
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approvals</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {requests.map((request) => (
                        <tr key={request.index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.index}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{displayEther(request.value)} ETH</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${request.recipient.substring(0, 6)}...${request.recipient.substring(request.recipient.length - 4)}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.approvalCount}/{request.approvers}
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${(request.approvalCount / request.approvers) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {request.complete ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Completed
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {!request.complete && isApprover && (
                              <button
                                onClick={() => handleApproveRequest(request.index)}
                                disabled={request.hasApproved}
                                className={`text-blue-600 hover:text-blue-900 mr-4 ${
                                  request.hasApproved ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                {request.hasApproved ? 'Approved' : 'Approve'}
                              </button>
                            )}
                            {!request.complete && isManager && (
                              <button
                                onClick={() => handleFinalizeRequest(request.index)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Finalize
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Contribute to Campaign</h2>
              
              {isApprover ? (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <FaCheckCircle className="text-green-500 inline mr-2" />
                  <span className="text-green-700">You're already a contributor!</span>
                </div>
              ) : null}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Contribute (ETH)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEthereum className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
                    placeholder="0.00"
                    step="0.0001"
                    min={displayEther(minimumContribution)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">ETH</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Minimum: {displayEther(minimumContribution)} ETH
                </p>
              </div>
              
              <button
                onClick={handleContribute}
                disabled={isContributing}
                className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center ${
                  isContributing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isContributing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaWallet className="mr-2" />
                    Contribute
                  </>
                )}
              </button>
              
              <div className="mt-4 text-sm text-gray-500">
                By contributing, you'll become an approver and be able to vote on spending requests.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}