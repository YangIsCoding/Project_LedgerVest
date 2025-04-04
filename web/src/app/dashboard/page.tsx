'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { getCampaignContract } from '@/utils/ethers';
import { 
  FaUsers, FaProjectDiagram, FaCoins, FaList,
  FaVoteYea, FaUserCircle, FaUserShield, FaWallet, 
  FaChartBar, FaHandHoldingUsd, FaFileContract, FaPlusCircle,
  FaEthereum, FaPlus
} from 'react-icons/fa';

// Admin wallet addresses - replace with the actual admin addresses
const ADMIN_WALLETS = [
  '0xb7695977d25D95d23b45BD6f9ACB74A5d332D28d'
];

interface CampaignSummary {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
  requestCount: number;
}

interface PendingRequest {
  campaignAddress: string;
  requestIndex: number;
  description: string;
  value: string;
  recipient: string;
  approvalCount: string;
}

export default function Dashboard() {
  const { isConnected, account, campaigns, loadCampaigns } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userContributions, setUserContributions] = useState<CampaignSummary[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [campaignSummaries, setCampaignSummaries] = useState<CampaignSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    contributors: 0,
    totalFunds: '0',
    pendingRequests: 0
  });
  
  // Check if connected wallet is an admin
  useEffect(() => {
    if (isConnected && account) {
      // Check if the wallet address is in the admin list
      setIsAdmin(ADMIN_WALLETS.includes(account));
    }
  }, [isConnected, account]);
  
  // Load campaigns when wallet connects
  useEffect(() => {
    if (isConnected) {
      loadCampaigns();
    }
  }, [isConnected, loadCampaigns]);
  
  // Fetch campaign data
  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!isConnected || campaigns.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        const summariesPromises = campaigns.map(async (address) => {
          try {
            const campaign = await getCampaignContract(address);
            
            // Get individual properties directly
            const manager = await campaign.manager();
            const minimumContribution = await campaign.minimumContribution();
            const approversCount = await campaign.approversCount();
            
            // For requestCount, we'll need to check if the property exists
            let requestCount = 0;
            if (campaign.requestsCount) {
              requestCount = Number(await campaign.requestsCount());
            } else if (campaign.getRequestsCount) {
              requestCount = Number(await campaign.getRequestsCount());
            }
            
            // Get balance from provider
            const provider = campaign.runner;
            const balance = await provider.getBalance(address);
            
            return {
              address,
              manager,
              minimumContribution: minimumContribution.toString(),
              balance: balance.toString(),
              approversCount: Number(approversCount),
              requestCount,
            };
          } catch (error) {
            console.error(`Error fetching data for campaign ${address}:`, error);
            return {
              address,
              manager: 'Error loading',
              minimumContribution: '0',
              balance: '0',
              approversCount: 0,
              requestCount: 0
            };
          }
        });
        
        const results = await Promise.all(summariesPromises);
        setCampaignSummaries(results);
        
        // If user is admin, calculate platform stats
        if (isAdmin) {
          const totalContributors = results.reduce((sum, campaign) => sum + campaign.approversCount, 0);
          const totalFunds = results.reduce((sum, camp) => 
            sum + (parseFloat(camp.balance) || 0), 0).toString();
          const totalPendingRequests = results.reduce((sum, camp) => sum + camp.requestCount, 0);
          
          setTotalStats({
            contributors: totalContributors,
            totalFunds: totalFunds,
            pendingRequests: totalPendingRequests
          });
        }
        
        // For regular users, find campaigns they've contributed to
        if (!isAdmin) {
          const userContributions = [];
          const userRequests = [];
          
          for (const address of campaigns) {
            const campaign = await getCampaignContract(address);
            
            try {
              const isContributor = await campaign.approvers(account);
              
              if (isContributor) {
                // Get individual properties directly
                const manager = await campaign.manager();
                const minimumContribution = await campaign.minimumContribution();
                const approversCount = await campaign.approversCount();
                
                // For requestCount, we'll need to check if the property exists
                let requestCount = 0;
                if (campaign.requestsCount) {
                  requestCount = Number(await campaign.requestsCount());
                } else if (campaign.getRequestsCount) {
                  requestCount = Number(await campaign.getRequestsCount());
                }
                
                const provider = campaign.runner;
                const balance = await provider.getBalance(address);
                
                userContributions.push({
                  address,
                  manager,
                  minimumContribution: minimumContribution.toString(),
                  balance: balance.toString(),
                  approversCount: Number(approversCount),
                  requestCount
                });
                
                // Get requests that need user's vote
                for (let i = 0; i < requestCount; i++) {
                  // Check if the contract has requests method
                  let request;
                  let hasApproved;
                  
                  try {
                    request = await campaign.requests(i);
                    hasApproved = await campaign.approvals(i, account);
                  } catch (error) {
                    console.error("Error fetching request details:", error);
                    continue;
                  }
                  
                  if (!request.complete && !hasApproved) {
                    userRequests.push({
                      campaignAddress: address,
                      requestIndex: i,
                      description: request.description,
                      value: request.value.toString(),
                      recipient: request.recipient,
                      approvalCount: request.approvalCount.toString()
                    });
                  }
                }
              }
            } catch (error) {
              console.error(`Error checking user contributions for ${address}:`, error);
            }
          }
          
          setUserContributions(userContributions);
          setPendingRequests(userRequests);
        }
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCampaignData();
  }, [campaigns, isConnected, account, isAdmin]);
  
  // Format wei to ETH
  const formatEther = (wei, decimals = 4) => {
    try {
      const ethValue = parseFloat(wei) / 1e18;
      return ethValue.toFixed(decimals);
    } catch (error) {
      return '0';
    }
  };
  
  // If wallet is not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
          <FaWallet className="text-5xl text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-4">Connect your wallet to view your dashboard.</p>
        </div>
      </div>
    );
  }
  
  // If data is loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  // Admin Dashboard (including user functionality)
  if (isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <FaUserShield className="mr-2 text-blue-600" /> Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage platform activities and monitor campaigns.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main admin section - Left sidebar */}
          <div className="lg:col-span-1">
            {/* Admin Stats */}
            <div className="bg-blue-50 rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaChartBar className="mr-2 text-blue-600" /> Platform Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaProjectDiagram className="text-blue-600 mr-2" />
                    <span className="text-gray-700">Total Campaigns</span>
                  </div>
                  <span className="font-bold">{campaigns.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaUsers className="text-blue-600 mr-2" />
                    <span className="text-gray-700">Total Contributors</span>
                  </div>
                  <span className="font-bold">{totalStats.contributors}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaCoins className="text-blue-600 mr-2" />
                    <span className="text-gray-700">Total Funds</span>
                  </div>
                  <span className="font-bold">{formatEther(totalStats.totalFunds)} ETH</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaList className="text-blue-600 mr-2" />
                    <span className="text-gray-700">Pending Requests</span>
                  </div>
                  <span className="font-bold">{totalStats.pendingRequests}</span>
                </div>
              </div>
            </div>
            
            {/* Admin Actions */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b p-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FaUserShield className="mr-2 text-blue-600" /> Admin Actions
                </h2>
              </div>
              <div className="p-4 space-y-3">
                <Link href="/create" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center w-full">
                  <FaPlusCircle className="mr-2" /> Create New Campaign
                </Link>
                <Link href="/projects" className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 flex items-center justify-center w-full">
                  <FaProjectDiagram className="mr-2" /> View All Projects
                </Link>
                <hr className="my-3" />
                <h3 className="font-semibold text-gray-700">Your Admin Wallet</h3>
                <div className="text-sm font-medium truncate bg-gray-50 p-2 rounded">
                  {account}
                </div>
              </div>
            </div>
            
            {/* User Stats Section (for Admin) */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b p-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FaUserCircle className="mr-2 text-blue-600" /> Your User Account
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-sm text-gray-500">Your Investments</div>
                    <div className="text-xl font-bold flex items-center">
                      <FaHandHoldingUsd className="mr-1 text-blue-600" />
                      {userContributions.length}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-sm text-gray-500">Pending Votes</div>
                    <div className="text-xl font-bold flex items-center">
                      <FaVoteYea className="mr-1 text-blue-600" />
                      {pendingRequests.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content area - Right side */}
          <div className="lg:col-span-2">
            {/* Campaign Management */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Campaign Management</h2>
                <div className="flex items-center space-x-2">
                  <Link href="/create" className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700 text-sm flex items-center">
                    <FaPlus className="mr-1" /> New
                  </Link>
                </div>
              </div>
              <div className="p-4">
                {campaignSummaries.length === 0 ? (
                  <p className="text-gray-500">No campaigns found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributors</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {campaignSummaries.map((campaign) => (
                          <tr key={campaign.address}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{campaign.address.substring(0, 10)}...</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{campaign.manager.substring(0, 10)}...</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center">
                                <FaEthereum className="mr-1 text-gray-700" />
                                {formatEther(campaign.balance)} ETH
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{campaign.approversCount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <Link 
                                href={`/campaigns/${campaign.address}`} 
                                className="inline-block text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded"
                              >
                                View
                              </Link>
                              <Link 
                                href={`/campaigns/${campaign.address}/requests`} 
                                className="inline-block text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded"
                              >
                                Requests
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            
            {/* User's Investments (Admin can see their personal investments) */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="border-b p-4">
                <h2 className="text-xl font-bold">Your Investments</h2>
              </div>
              <div className="p-4">
                {userContributions.length === 0 ? (
                  <div className="text-center py-8">
                    <FaHandHoldingUsd className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">You haven't invested in any campaigns yet.</p>
                    <Link href="/projects" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                      Browse Campaigns
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userContributions.map((campaign) => (
                      <div key={campaign.address} className="border rounded-lg overflow-hidden">
                        <div className="border-b p-4">
                          <h3 className="font-semibold truncate">
                            <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline">
                              Campaign @ {campaign.address.substring(0, 10)}...
                            </Link>
                          </h3>
                        </div>
                        <div className="p-4 bg-gray-50">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Balance</p>
                              <p className="font-medium flex items-center">
                                <FaEthereum className="mr-1 text-gray-700" />
                                {formatEther(campaign.balance)} ETH
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Contributors</p>
                              <p className="font-medium">{campaign.approversCount}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-t">
                          <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline text-sm">
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Pending Requests to Vote On (Admin's personal votes) */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b p-4">
                <h2 className="text-xl font-bold">Your Pending Votes</h2>
              </div>
              <div className="p-4">
                {pendingRequests.length === 0 ? (
                  <p className="text-gray-500 py-4">No pending requests require your vote at this time.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingRequests.map((request) => (
                          <tr key={`${request.campaignAddress}-${request.requestIndex}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.campaignAddress.substring(0, 8)}...</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{request.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center">
                                <FaEthereum className="mr-1 text-gray-700" />
                                {formatEther(request.value)} ETH
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{request.recipient.substring(0, 8)}...</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link 
                                href={`/campaigns/${request.campaignAddress}/requests/${request.requestIndex}`}
                                className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 text-xs"
                              >
                                Vote
                              </Link>
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
        </div>
      </div>
    );
  }
  
  // User Dashboard
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <FaUserCircle className="mr-2 text-blue-600" /> User Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! View your investments and voting opportunities.
        </p>
      </div>
      
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Your Investments</h3>
            <FaHandHoldingUsd className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{userContributions.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pending Votes</h3>
            <FaVoteYea className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{pendingRequests.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Wallet</h3>
            <FaWallet className="text-blue-600" />
          </div>
          <p className="text-sm font-medium truncate">{account}</p>
        </div>
      </div>
      
      {/* Campaigns You've Invested In */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b p-4">
          <h2 className="text-xl font-bold">Your Investments</h2>
        </div>
        <div className="p-4">
          {userContributions.length === 0 ? (
            <div className="text-center py-8">
              <FaHandHoldingUsd className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">You haven't invested in any campaigns yet.</p>
              <Link href="/projects" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                Browse Campaigns
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userContributions.map((campaign) => (
                <div key={campaign.address} className="border rounded-lg overflow-hidden">
                  <div className="border-b p-4">
                    <h3 className="font-semibold truncate">
                      <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline">
                        Campaign @ {campaign.address.substring(0, 10)}...
                      </Link>
                    </h3>
                  </div>
                  <div className="p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Balance</p>
                        <p className="font-medium flex items-center">
                          <FaEthereum className="mr-1 text-gray-700" />
                          {formatEther(campaign.balance)} ETH
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contributors</p>
                        <p className="font-medium">{campaign.approversCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline text-sm">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Pending Requests to Vote On */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b p-4">
          <h2 className="text-xl font-bold">Pending Votes</h2>
        </div>
        <div className="p-4">
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 py-4">No pending requests require your vote at this time.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingRequests.map((request) => (
                    <tr key={`${request.campaignAddress}-${request.requestIndex}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.campaignAddress.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaEthereum className="mr-1 text-gray-700" />
                          {formatEther(request.value)} ETH
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{request.recipient.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link 
                          href={`/campaigns/${request.campaignAddress}/requests/${request.requestIndex}`}
                          className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 text-xs"
                        >
                          Vote
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Create Campaign CTA */}
      <div className="mt-8 text-center">
        <Link href="/create" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 inline-flex items-center">
          <FaFileContract className="mr-2" /> Create Your Own Campaign
        </Link>
      </div>
    </div>
  );
}