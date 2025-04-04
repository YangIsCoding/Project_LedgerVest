'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/context/WalletContext';
import { getCampaignContract } from '@/utils/ethers';
import { FaUsers, FaProjectDiagram, FaCoins, FaEthereum, 
         FaTachometerAlt, FaClipboardList, FaUserShield, FaMoneyBillWave,
         FaExclamationTriangle, FaBell, FaCog, FaChartBar, FaWallet,
         FaPlus, FaArrowRight } from 'react-icons/fa';

// Campaign summary type
interface CampaignSummary {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
  isLoading: boolean;
}

// Admin addresses - add your admin wallet addresses here
const ADMIN_ADDRESSES = [
  '0x123...', // Replace with actual admin wallet addresses
  '0x456...'
];

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected, account, campaigns, loadCampaigns } = useWallet();
  const [campaignSummaries, setCampaignSummaries] = useState<CampaignSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userContributions, setUserContributions] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected && !isLoading) {
      router.push('/');
    }
  }, [isConnected, isLoading, router]);

  // Check if user is admin when account changes
  useEffect(() => {
    if (account) {
      const adminCheck = ADMIN_ADDRESSES.map(addr => addr.toLowerCase()).includes(account.toLowerCase());
      setIsAdmin(adminCheck);
    } else {
      setIsAdmin(false);
    }
  }, [account]);

  // Load campaign list when wallet connects
  useEffect(() => {
    if (isConnected) {
      loadCampaigns();
    }
  }, [isConnected, loadCampaigns]);

  // Get summary data for each campaign
  useEffect(() => {
    const fetchCampaignSummaries = async () => {
      if (!isConnected || campaigns.length === 0) {
        setIsLoading(false);
        return;
      }

      // Initialize with loading state
      const initialSummaries = campaigns.map(address => ({
        address,
        manager: '',
        minimumContribution: '0',
        balance: '0',
        approversCount: 0,
        isLoading: true
      }));
      
      setCampaignSummaries(initialSummaries);
      
      // Fetch data for each campaign
      try {
        const summariesPromises = campaigns.map(async (address) => {
          try {
            const campaign = await getCampaignContract(address);
            
            const manager = await campaign.manager();
            const minimumContribution = await campaign.minimumContribution();
            const approversCount = await campaign.approversCount();
            
            // Get balance from provider
            const provider = campaign.runner;
            const balance = await provider.getBalance(address);
            
            return {
              address,
              manager,
              minimumContribution: minimumContribution.toString(),
              balance: balance.toString(),
              approversCount: Number(approversCount),
              isLoading: false
            };
          } catch (error) {
            console.error(`Error fetching data for campaign ${address}:`, error);
            return {
              address,
              manager: 'Error loading',
              minimumContribution: '0',
              balance: '0',
              approversCount: 0,
              isLoading: false
            };
          }
        });
        
        // Update with loaded data
        const results = await Promise.all(summariesPromises);
        setCampaignSummaries(results);
        
        // Simulate some user data for the dashboard
        // In real implementation, you would fetch this data from the blockchain
        if (account) {
          // Mock data for user contributions
          const mockContributions = results.slice(0, 2).map(campaign => ({
            campaignAddress: campaign.address,
            amount: (Math.random() * parseFloat(formatEther(campaign.balance)) * 0.3).toFixed(4),
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }));
          
          setUserContributions(mockContributions);
          setPendingRequests(Math.floor(Math.random() * 5));
          
          // Mock recent activity data
          const activityTypes = ['contribution', 'request_created', 'request_approved', 'request_finalized'];
          const mockActivity = Array(5).fill(null).map((_, i) => ({
            id: i,
            type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
            campaign: results[Math.floor(Math.random() * results.length)].address,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            amount: (Math.random() * 2).toFixed(4),
            user: `0x${Math.random().toString(16).substring(2, 10)}...`
          }));
          
          // Sort by timestamp (most recent first)
          mockActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setRecentActivity(mockActivity);
        }
      } catch (error) {
        console.error("Error fetching campaign summaries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignSummaries();
  }, [campaigns, isConnected, account]);

  // Format the wei value to ETH with a given number of decimals
  const formatEther = (wei: string, decimals = 4) => {
    try {
      const ethValue = parseFloat(wei) / 1e18;
      return ethValue.toFixed(decimals);
    } catch (error) {
      return '0';
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get activity text based on type
  const getActivityText = (activity: any) => {
    const campaignShort = `${activity.campaign.substring(0, 6)}...`;
    
    switch (activity.type) {
      case 'contribution':
        return `${activity.user} contributed ${activity.amount} ETH to campaign ${campaignShort}`;
      case 'request_created':
        return `New spending request created for ${activity.amount} ETH in campaign ${campaignShort}`;
      case 'request_approved':
        return `${activity.user} approved a spending request in campaign ${campaignShort}`;
      case 'request_finalized':
        return `Spending request for ${activity.amount} ETH was finalized in campaign ${campaignShort}`;
      default:
        return '';
    }
  };

  // Calculate total platform stats
  const platformStats = {
    totalBalance: campaignSummaries.reduce((sum, campaign) => sum + parseFloat(formatEther(campaign.balance)), 0).toFixed(4),
    totalCampaigns: campaignSummaries.length,
    totalContributors: campaignSummaries.reduce((sum, campaign) => sum + campaign.approversCount, 0)
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <FaWallet className="text-6xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to access your dashboard.
          </p>
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/')}
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  return isAdmin ? (
    // Admin Dashboard
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-indigo-600 rounded-full p-3 mr-4">
                <FaMoneyBillWave className="text-xl text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Balance</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {platformStats.totalBalance} ETH
                </h3>
              </div>
            </div>
          </div>
            
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-indigo-600 rounded-full p-3 mr-4">
                <FaProjectDiagram className="text-xl text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Campaigns</p>
                <h3 className="text-2xl font-bold text-gray-800">{platformStats.totalCampaigns}</h3>
              </div>
            </div>
          </div>
            
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-indigo-600 rounded-full p-3 mr-4">
                <FaUsers className="text-xl text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Contributors</p>
                <h3 className="text-2xl font-bold text-gray-800">{platformStats.totalContributors}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-600 rounded-full p-3 mr-4">
                <FaPlus className="text-xl text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <Link 
                  href="/create"
                  className="text-green-600 font-semibold hover:underline inline-flex items-center"
                >
                  Create Campaign <FaArrowRight className="ml-1 text-sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Campaigns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold">Active Campaigns</h2>
                <Link href="/admin/campaigns" className="text-indigo-600 text-sm hover:underline">
                  Manage All
                </Link>
              </div>
              
              <div className="p-4">
                {campaignSummaries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributors</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {campaignSummaries.slice(0, 5).map((campaign) => (
                          <tr key={campaign.address}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {campaign.address.substring(0, 8)}...
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {campaign.manager.substring(0, 8)}...
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center">
                                <FaEthereum className="mr-1 text-gray-500" />
                                {formatEther(campaign.balance)} ETH
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {campaign.approversCount}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <Link 
                                  href={`/campaigns/${campaign.address}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  View
                                </Link>
                                <Link 
                                  href={`/admin/campaigns/${campaign.address}`}
                                  className="text-indigo-600 hover:underline"
                                >
                                  Edit
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded p-4 text-center">
                    <p className="text-gray-500">No campaigns found.</p>
                    <Link href="/create" className="mt-2 inline-block text-indigo-600 hover:underline">
                      Create New Campaign
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Admin Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Quick Actions</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/admin/campaigns" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaClipboardList className="text-2xl text-indigo-600 mb-2" />
                    <span className="text-sm text-center">Manage Campaigns</span>
                  </Link>
                  
                  <Link href="/admin/users" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaUsers className="text-2xl text-indigo-600 mb-2" />
                    <span className="text-sm text-center">Manage Users</span>
                  </Link>
                  
                  <Link href="/admin/settings" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaCog className="text-2xl text-indigo-600 mb-2" />
                    <span className="text-sm text-center">Platform Settings</span>
                  </Link>
                  
                  <Link href="/admin/analytics" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaChartBar className="text-2xl text-indigo-600 mb-2" />
                    <span className="text-sm text-center">Analytics</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Recent Activity</h2>
              </div>
              <div className="p-4">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                        <p className="text-sm">{getActivityText(activity)}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // User Dashboard
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Dashboard</h1>
        
        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-full p-3 mr-4">
                <FaWallet className="text-xl text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Your Contributions</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {userContributions.reduce((sum, contrib) => sum + parseFloat(contrib.amount), 0).toFixed(4)} ETH
                </h3>
              </div>
            </div>
          </div>
            
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-600 rounded-full p-3 mr-4">
                <FaClipboardList className="text-xl text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Campaigns Supported</p>
                <h3 className="text-2xl font-bold text-gray-800">{userContributions.length}</h3>
              </div>
            </div>
          </div>
            
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${pendingRequests > 0 ? 'bg-amber-500' : 'bg-gray-400'} rounded-full p-3 mr-4`}>
                <FaExclamationTriangle className="text-xl text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Requests</p>
                <h3 className="text-2xl font-bold text-gray-800">{pendingRequests}</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - User Contributions */}
          <div className="lg:col-span-2">
            {/* User Contributions */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold">Your Contributions</h2>
                <Link href="/my-contributions" className="text-blue-600 text-sm hover:underline">
                  View All
                </Link>
              </div>
              <div className="p-4">
                {userContributions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userContributions.map((contribution, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {contribution.campaignAddress.substring(0, 8)}...
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center">
                                <FaEthereum className="mr-1 text-gray-500" />
                                {contribution.amount} ETH
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{contribution.date}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <Link 
                                href={`/campaigns/${contribution.campaignAddress}`}
                                className="text-blue-600 hover:underline"
                              >
                                View Campaign
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded p-4 text-center">
                    <p className="text-gray-500">You haven't contributed to any campaigns yet.</p>
                    <Link href="/projects" className="mt-2 inline-block text-blue-600 hover:underline">
                      Browse Campaigns
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recommended Campaigns */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Recommended Campaigns</h2>
              </div>
              <div className="p-4">
                {campaignSummaries.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaignSummaries.slice(0, 4).map((campaign) => (
                      <div key={campaign.address} className="border rounded-lg overflow-hidden">
                        <div className="p-4 border-b">
                          <h3 className="font-medium text-blue-600 hover:underline">
                            <Link href={`/campaigns/${campaign.address}`}>
                              Campaign {campaign.address.substring(0, 6)}...
                            </Link>
                          </h3>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-gray-500 mr-2">Balance:</span>
                            <span className="font-medium flex items-center inline-block">
                              <FaEthereum className="mr-1 text-gray-500" />
                              {formatEther(campaign.balance)} ETH
                            </span>
                          </div>
                          <Link 
                            href={`/campaigns/${campaign.address}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded p-4 text-center">
                    <p className="text-gray-500">No campaigns available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pending Votes/Requests */}
            {pendingRequests > 0 && (
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-bold">Pending Requests</h2>
                </div>
                <div className="p-4">
                  <div className="bg-yellow-50 rounded-lg p-4 flex items-center">
                    <FaBell className="text-yellow-500 mr-3 text-xl" />
                    <div>
                      <p className="font-medium text-gray-800">You have {pendingRequests} spending requests waiting for your vote</p>
                      <Link 
                        href="/my-votes" 
                        className="text-blue-600 text-sm hover:underline inline-block mt-2"
                      >
                        Review and Vote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Recent Activity</h2>
              </div>
              <div className="p-4">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                        <p className="text-sm">{getActivityText(activity)}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No recent activity</p>
                )}
              </div>
              <div className="p-4 border-t">
                <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full block text-center">
                  Create New Campaign
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}