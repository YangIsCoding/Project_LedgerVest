'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { getCampaignContract, formatEther, getProvider } from '@/utils/ethers';
import { FaWallet, FaFileContract } from 'react-icons/fa';
import { useSession } from 'next-auth/react';


// Components
import CampaignsICreated from '@/components/dashboard/YourCreatedCampaigns';
import FundsRaisedChart from '@/components/dashboard/FundsRaisedChart';
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


// Constants
const ADMIN_WALLETS: string[] = [
  '0xc3DbC713d5dd66CD2f529c6162Cf06dc9fe18b01',
  '0xb7695977d25D95d23b45BD6f9ACB74A5d332D28d'
];

const ADMIN_EMAILS: string[] = [
  'chrisliu504638@gmail.com',
  'Junjieja.li2@gmail.com',
  'freddyplati@gmail.com',
  'howdywu@gmail.com',
  'allanustw@gmail.com'
];

// Types
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

interface ChartData {
  date: string;
  totalAmount: number;
}

interface FinalizationData {
  date: string;
  amount: number;
}

interface CampaignPerformance {
  title: string;
  targetAmount: number;
  finalizedAmount: number;
}

export default function Dashboard ()
{
  const { data: session, status } = useSession();
  const { isConnected, account, campaigns, loadCampaigns } = useWallet();
  // 從 session 拿到 email
  const userEmail = session?.user?.email;

  // 判斷是不是 admin
  const isEmailAdmin = ADMIN_EMAILS.includes(userEmail || '');
  const isWalletAdmin = ADMIN_WALLETS.includes(account || '');
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Updating isAdmin:', { isWalletAdmin, isEmailAdmin });
      setIsAdmin(isWalletAdmin || isEmailAdmin);
    }
  }, [isWalletAdmin, isEmailAdmin]);

  useEffect(() => {
    if (isConnected) {
      loadCampaigns();
    }
  }, [isConnected, loadCampaigns]);

  //hooks
  const [isLoading, setIsLoading] = useState(true);
  const [userContributions, setUserContributions] = useState<CampaignSummary[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [campaignSummaries, setCampaignSummaries] = useState<CampaignSummary[]>([]);
  const [createdCampaigns, setCreatedCampaigns] = useState<CreatedCampaign[]>([]);
  const [fundsRaisedData, setFundsRaisedData] = useState<ChartData[]>([]);
  const [finalizationsData, setFinalizationsData] = useState<FinalizationData[]>([]);
  const [campaignPerformanceData, setCampaignPerformanceData] = useState<CampaignPerformance[]>([]);
  const [ totalStats, setTotalStats ] = useState( { contributors: 0, totalFunds: '0', pendingRequests: 0, finalizedFunds: '0' } );
  
  


  useEffect( () =>
  {
    console.log('fetchData called');
    const fetchData = async () => {
      if (!isConnected || campaigns.length === 0) return setIsLoading(false);

      try {
        if (account) {
          const [createdRes, fundChartRes, finalRes, perfRes] = await Promise.all([
            fetch(`/api/created-campaigns?walletAddress=${account}`),
            fetch(`/api/stats/funds-raised?walletAddress=${account}`),
            fetch(`/api/stats/finalizations-received?walletAddress=${account}`),
            fetch(`/api/stats/campaign-performance?walletAddress=${account}`)
          ]);

          if (createdRes.ok) setCreatedCampaigns(await createdRes.json());
          if (fundChartRes.ok) {
            const contributions = await fundChartRes.json();
            const daily: Record<string, number> = {};
            contributions.forEach((c: { amount: number; timestamp: string }) => {
              const date = new Date(c.timestamp).toLocaleDateString();
              daily[date] = (daily[date] || 0) + c.amount;
            });
            let total = 0;
            const formatted: ChartData[] = Object.entries(daily).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, amount]) => ({ date, totalAmount: total += amount }));
            setFundsRaisedData(formatted);
          }

          if (finalRes.ok) {
            const finals = await finalRes.json();
            console.log('Finalizations:', finals);
            const finalDaily: Record<string, number> = {};
            finals.forEach((f: { amount: number; timestamp: string }) => {
              const date = new Date(f.timestamp).toLocaleDateString();
              finalDaily[date] = (finalDaily[date] || 0) + f.amount;
            } );
            
            let cumulative = 0;
            const finalChart: FinalizationData[] = Object.entries(finalDaily)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, amount]) => ({ date, amount: Number((cumulative += amount).toFixed(4)) }));
            setFinalizationsData( finalChart );

            const totalFinalizedFunds = finals.reduce(
              (sum: number, f: { amount: string }) => sum + parseFloat(f.amount),
              0
            );
            setTotalStats((prevStats) => {
              const updatedStats = {
                ...prevStats,
                finalizedFunds: totalFinalizedFunds.toString(),
              };
              console.log('Updated Total Stats:', updatedStats);
              return updatedStats;
            });
          }

          if (perfRes.ok) {
            const perfData = await perfRes.json();
            const normalized = perfData.map((item: any) => ({
              ...item,
              finalizedAmount: Number((item.finalizedAmount / 1e18).toFixed(4)),
            }));
            setCampaignPerformanceData(normalized);
          }
        }

        const summaries = await Promise.all(campaigns.map(async (address) => {
          try {
            const campaign = await getCampaignContract(address);
            const [manager, minContrib, approversCount] = await Promise.all([
              campaign.manager(),
              campaign.minimumContribution(),
              campaign.approversCount()
            ]);
            const requestCount = campaign.requestsCount
              ? Number(await campaign.requestsCount())
              : campaign.getRequestsCount
                ? Number(await campaign.getRequestsCount())
                : 0;
            const provider = getProvider();
            const balance = await provider.getBalance(address);
            return {
              address,
              manager,
              minimumContribution: minContrib.toString(),
              balance: balance.toString(),
              approversCount: Number(approversCount),
              requestCount
            };
          } catch {
            return {
              address,
              manager: 'Error loading',
              minimumContribution: '0',
              balance: '0',
              approversCount: 0,
              requestCount: 0
            };
          }
        }));

        setCampaignSummaries(summaries);

        if (isAdmin) {
          const contributors = summaries.reduce((sum, c) => sum + c.approversCount, 0);
          const totalFunds = summaries.reduce((sum, c) => sum + parseFloat(c.balance), 0).toString();
          const pending = summaries.reduce((sum, c) => sum + c.requestCount, 0);
          setTotalStats((prevStats) => ({
            ...prevStats,
            contributors,
            totalFunds,
            pendingRequests: pending,
            finalizedFunds: prevStats.finalizedFunds, // 保留 finalizedFunds 的值
          } ) );
          
          // 確保 admin 也更新 userContributions
          const contributions: CampaignSummary[] = summaries.filter((summary) =>
            campaigns.includes(summary.address)
          );
          setUserContributions(contributions);
        } else if (account) {
          const contributions: CampaignSummary[] = [];
          const requests: PendingRequest[] = [];

          for (const address of campaigns) {
            const campaign = await getCampaignContract(address);
            if (await campaign.approvers(account)) {
              const [manager, minContrib, approversCount] = await Promise.all([
                campaign.manager(),
                campaign.minimumContribution(),
                campaign.approversCount()
              ]);
              const requestCount = campaign.requestsCount
                ? Number(await campaign.requestsCount())
                : campaign.getRequestsCount
                  ? Number(await campaign.getRequestsCount())
                  : 0;
              const provider = getProvider();
              const balance = await provider.getBalance(address);
              contributions.push({ address, manager, minimumContribution: minContrib.toString(), balance: balance.toString(), approversCount: Number(approversCount), requestCount });

              for (let i = 0; i < requestCount; i++) {
                try {
                  const request = await campaign.requests(i);
                  const hasApproved = await campaign.approvals(i, account);
                  if (!request.complete && !hasApproved) {
                    requests.push({
                      campaignAddress: address,
                      requestIndex: i,
                      description: request.description,
                      value: request.value.toString(),
                      recipient: request.recipient,
                      approvalCount: request.approvalCount.toString()
                    });
                  }
                } catch { continue; }
              }
            }
          }

          setUserContributions(contributions);
          setPendingRequests(requests);
        }
      } catch (err) {
        console.error('Error fetching campaign data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ campaigns, isConnected, account, isAdmin ] );

  if (status !== 'authenticated') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-xs">
          <FaWallet className="text-5xl text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Sign in Required</h1>
          <p className="text-gray-600 mb-4">You must sign in with Google to access the dashboard.</p>
        </div>
      </div>
    );
  }


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <AdminDashboardSection campaignsLength={campaigns.length} totalStats={totalStats} formatEther={formatEther} account={account || ''} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span--1">
            <AdminStats
              campaignsLength={campaigns.length}
              totalStats={{
                contributors: totalStats.contributors,
                totalFunds: totalStats.totalFunds,
                pendingRequests: totalStats.pendingRequests,
                finalizedFunds: totalStats.finalizedFunds || '0',
              }}
              formatEther={(wei, decimals) => formatEther(typeof wei === 'number' ? BigInt(wei).toString() : wei, decimals)} // 確保類型正確
            />
            <AdminActions account={account || ''} />
            <UserStats userContributionsLength={userContributions.length} pendingRequestsLength={pendingRequests.length} />
          </div>
          <div className="lg:col-span-2">
            <CampaignManagement campaignSummaries={campaignSummaries} formatEther={formatEther} />
            <YourInvestments userContributions={userContributions} formatEther={formatEther} />
            <CampaignsICreated createdCampaigns={createdCampaigns} />
            <FundsRaisedChart data={fundsRaisedData} />
            <FinalizationsChart data={finalizationsData} />
            <CampaignPerformanceChart data={campaignPerformanceData} />
            <PendingVotes pendingRequests={pendingRequests} formatEther={formatEther} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <UserDashboardSection userContributionsLength={userContributions.length} pendingRequestsLength={pendingRequests.length} account={account || ''} />
      <YourInvestments userContributions={userContributions} formatEther={formatEther} />
      <CampaignsICreated createdCampaigns={createdCampaigns} />
      <FundsRaisedChart data={fundsRaisedData} />
      <FinalizationsChart data={finalizationsData} />
      <CampaignPerformanceChart data={campaignPerformanceData} />
      <PendingVotes pendingRequests={pendingRequests} formatEther={formatEther} />
      <div className="mt-8 text-center">
        <Link href="/create" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 inline-flex items-center">
          <FaFileContract className="mr-2" /> Create Your Own Campaign
        </Link>
      </div>
    </div>
  );
}
