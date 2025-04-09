'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { getCampaignContract, formatEther, getProvider } from '@/utils/ethers';
import { FaWallet, FaFileContract } from 'react-icons/fa';
import CampaignsICreated from '@/components/dashboard/YourCreatedCampaigns';
import FundsRaisedChart from '@/components/dashboard/FundsRaisedChart';


// Import the new components
import AdminDashboardSection from '@/components/dashboard/AdminDashboardSection';
import UserDashboardSection from '@/components/dashboard/UserDashboardSection';
import AdminStats from '@/components/dashboard/AdminStats';
import AdminActions from '@/components/dashboard/AdminActions';
import UserStats from '@/components/dashboard/UserStats';
import CampaignManagement from '@/components/dashboard/CampaignManagement';
import YourInvestments from '@/components/dashboard/YourInvestments';
import PendingVotes from '@/components/dashboard/PendingVotes';
import FinalizationsChart from '@/components/dashboard/FinalizationsChart';
import CampaignPerformanceChart from '@/components/dashboard/CampaignPerformanceChart';


// Admin wallet addresses - replace with the actual admin addresses
const ADMIN_WALLETS = [

  '0xc3DbC713d5dd66CD2f529c6162Cf06dc9fe18b01',
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

interface CreatedCampaign {
  id: string;
  title: string;
  description: string;
  contractAddress: string;
  targetAmount: number;
  createdAt: string;
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
  } );
  const [createdCampaigns, setCreatedCampaigns] = useState<CreatedCampaign[]>([]);
  const [ fundsRaisedData, setFundsRaisedData ] = useState<{ date: string; totalAmount: number }[]>( [] );
  const [finalizationsData, setFinalizationsData] = useState<{ date: string, amount: number }[]>([]);
  const [campaignPerformanceData, setCampaignPerformanceData] = useState<
  { title: string; targetAmount: number; finalizedAmount: number }[]
    >( [] );
  

  




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

      if (account) {
        try {
          // 取得使用者創建的 campaign
          const res = await fetch(`/api/created-campaigns?walletAddress=${account}`);
          if (res.ok) {
            const data = await res.json();
            setCreatedCampaigns(data);
          } else {
            console.error("Failed to load created campaigns.");
          }

          // 取得該使用者募資資料
          const chartRes = await fetch(`/api/stats/funds-raised?walletAddress=${account}`);
          if (chartRes.ok) {
            const contributions = await chartRes.json();

            // 整理成每日累積金額資料
            const dailyTotals: Record<string, number> = {};
            contributions.forEach((c: { amount: number; timestamp: string }) => {
              const date = new Date(c.timestamp).toLocaleDateString();
              dailyTotals[date] = (dailyTotals[date] || 0) + c.amount;
            });

            const chartData: { date: string; totalAmount: number }[] = [];
            let runningTotal = 0;

            Object.entries(dailyTotals).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .forEach(([date, amount]) => {
                runningTotal += amount;
                chartData.push({ date, totalAmount: runningTotal });
              });


            setFundsRaisedData(chartData);
          } else {
            console.error("Failed to load fund chart data.");
          }




          const finalRes = await fetch(`/api/stats/finalizations-received?walletAddress=${account}`);
          if (finalRes.ok) {
            const finals = await finalRes.json();

            const daily: Record<string, number> = {};
            finals.forEach((f: { amount: number; timestamp: string }) => {
              const date = new Date(f.timestamp).toLocaleDateString();
              daily[date] = (daily[date] || 0) + f.amount;
            });

            const finalChartData: { date: string; amount: number }[] = [];
            let total = 0;

            Object.entries(daily)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .forEach(([date, amount]) => {
                total += amount;
                finalChartData.push({ date, amount: Number(total.toFixed(4)) });
            });


            setFinalizationsData(finalChartData);
          } else {
            console.error("Failed to load finalizations chart data.");
          }



          // 取得 campaign performance 資料
          const perfRes = await fetch(`/api/stats/campaign-performance?walletAddress=${account}`);
          if (perfRes.ok) {
            const perfData = await perfRes.json();

            // 👉 轉換 wei 為 ETH
            const normalized = perfData.map((item: any) => ({
              ...item,
              finalizedAmount: Number((item.finalizedAmount / 1e18).toFixed(4)),
            }));

            setCampaignPerformanceData(normalized);
          } else {
            console.error("Failed to load campaign performance data.");
          }


          
          

        } catch (err) {
          console.error("Error fetching created campaigns or fund chart data:", err);
        }
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
            const provider = getProvider();
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

                const provider = getProvider();
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

  // If wallet is not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-xs">
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
        <AdminDashboardSection
          campaignsLength={campaigns.length}
          totalStats={totalStats}
          formatEther={formatEther}
          account={account || ''}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main admin section - Left sidebar */}
          <div className="lg:col-span-1">
            <AdminStats
              campaignsLength={campaigns.length}
              totalStats={totalStats}
              formatEther={formatEther}
            />

            <AdminActions
              account={account || ''}
            />

            <UserStats
              userContributionsLength={userContributions.length}
              pendingRequestsLength={pendingRequests.length}
            />
          </div>

          {/* Main content area - Right side */}
          <div className="lg:col-span-2">
            <CampaignManagement
              campaignSummaries={campaignSummaries}
              formatEther={formatEther}
            />

            <YourInvestments
              userContributions={userContributions}
              formatEther={formatEther}
            />
            <CampaignsICreated createdCampaigns={createdCampaigns} />
            <FundsRaisedChart data={fundsRaisedData} />
            <FinalizationsChart data={finalizationsData} />
            <CampaignPerformanceChart data={campaignPerformanceData} />
            
            <PendingVotes
              pendingRequests={pendingRequests}
              formatEther={formatEther}
            />
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  return (
    <div className="container mx-auto px-4 py-16">
      <UserDashboardSection
        userContributionsLength={userContributions.length}
        pendingRequestsLength={pendingRequests.length}
        account={account || ''}
      />

      {/* Campaigns You've Invested In */}
      <YourInvestments
        userContributions={userContributions}
        formatEther={formatEther}
      />
      <CampaignsICreated createdCampaigns={createdCampaigns} />
      <FundsRaisedChart data={fundsRaisedData} />
      <FinalizationsChart data={finalizationsData} />
      <CampaignPerformanceChart data={campaignPerformanceData} />

      {/* Pending Requests to Vote On */}
      <PendingVotes
        pendingRequests={pendingRequests}
        formatEther={formatEther}
      />

      {/* Create Campaign CTA */}
      <div className="mt-8 text-center">
        <Link href="/create" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 inline-flex items-center">
          <FaFileContract className="mr-2" /> Create Your Own Campaign
        </Link>
      </div>
    </div>
  );
}