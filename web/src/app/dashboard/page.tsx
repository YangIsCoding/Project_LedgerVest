'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/lib/context/WalletContext';
import { useAccount } from 'wagmi';
import { getCampaignContract, formatEther, getProvider , getFactoryContract} from '@/utils/ethers';
import CampaignsICreated from '@/components/dashboard/YourCreatedCampaigns';
import FundsRaisedChart from '@/components/dashboard/FundsRaisedChart';
import FinalizationsChart from '@/components/dashboard/FinalizationsChart';
import CampaignPerformanceChart from '@/components/dashboard/CampaignPerformanceChart';
import PendingVotes from '@/components/dashboard/PendingVotes';
import { FaSignInAlt } from 'react-icons/fa';
import { EventLog, LogDescription } from 'ethers';
import AdminActions from '@/components/dashboard/AdminActions';
import AdminDashboardSection from '@/components/dashboard/AdminDashboardSection';
import AdminStats from '@/components/dashboard/AdminStats';
import CampaignManagement from '@/components/dashboard/CampaignManagement';
import ContactSubmissions from '@/components/dashboard/ContactSubmissions';

interface CreatedCampaign {
  id: string;
  title: string;
  description: string;
  contractAddress: string;
  targetAmount: number;
  createdAt: number;
}

interface ChartData {
  date: string;
  totalAmount: number;
}

interface FinalizationData {
  date: string;
  amount: number;
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
  const { isConnected, address: account } = useAccount();
  const { campaigns, loadCampaigns } = useWallet();

  const ADMIN_WALLETS = ['0xaada21fd544da24b3b96e465c4c7074f4d6e8632'];
  const isAdmin = ADMIN_WALLETS.includes(account?.toLowerCase() || '');

  const [isLoading, setIsLoading] = useState(true);
  const [createdCampaigns, setCreatedCampaigns] = useState<CreatedCampaign[]>([]);
  const [fundsRaisedData, setFundsRaisedData] = useState<ChartData[]>([]);
  const [finalizationsData, setFinalizationsData] = useState<FinalizationData[]>([]);
  const [campaignPerformanceData, setCampaignPerformanceData] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [adminStats, setAdminStats] = useState({
    contributors: 0,
    totalFunds: '0',
    pendingRequests: 0,
    finalizedFunds: '0',
  });
  const [campaignSummaries, setCampaignSummaries] = useState<any[]>([]);

  const formatEtherSafe = (wei: string | number | bigint): string => {
    try {
      if (typeof wei === 'bigint') return formatEther(wei);
      if (typeof wei === 'string' && /^[0-9]+$/.test(wei)) return formatEther(BigInt(wei));
      const parsed = BigInt(Math.floor(Number(wei) * 1e18));
      return formatEther(parsed);
    } catch (e) {
      console.error('formatEtherSafe Error:', e, 'Input:', wei);
      return '0';
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadCampaigns();
    }
  }, [isConnected, loadCampaigns]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || campaigns.length === 0 || !account) {
        setIsLoading(false);
        return;
      }

      try {
        const provider = getProvider();
        const factory = await getFactoryContract();
        const iface = factory.interface;

        const fundsMap: Record<string, number> = {};
        const finalMap: Record<string, number> = {};
        const campaignPerfMap: Record<string, number> = {};
        const allPendingVotes: PendingRequest[] = [];
        const createdCamps: CreatedCampaign[] = [];

        const createdEvents = await factory.queryFilter(factory.filters.CampaignCreated(), 0, 'latest');

        for (const address of campaigns) {
          const campaign = await getCampaignContract(address);
          const summary = await campaign.getSummary();
          const manager = summary[4];

          // 僅記錄自己是 manager 的 campaign
          const isCreator = manager.toLowerCase() === account.toLowerCase();

          // Contributions
          const contributionEvents = await campaign.queryFilter(campaign.filters.ContributionReceived(), 0, 'latest');
          for (const log of contributionEvents) {
            const ev = log as unknown as EventLog;
            const { amount } = ev.args;
            const block = await provider.getBlock(log.blockNumber);
            if (!block) continue;
            const date = new Date(block.timestamp * 1000).toISOString().slice(0, 10);
            if (isCreator) {
              fundsMap[date] = (fundsMap[date] || 0) + parseFloat(formatEther(amount.toString()));
            }
          }

          // Finalized
          const finalizedEvents = await campaign.queryFilter(campaign.filters.RequestFinalized(), 0, 'latest');
          finalizedEvents.forEach((log) => {
            const ev = log as unknown as EventLog;
            const { amount, timestamp } = ev.args;
            const date = new Date(Number(timestamp) * 1000).toISOString().slice(0, 10);
            if (isCreator) {
              finalMap[date] = (finalMap[date] || 0) + parseFloat(formatEther(amount.toString()));
              campaignPerfMap[address] = (campaignPerfMap[address] || 0) + parseFloat(formatEther(amount.toString()));
            }
          });

          // Created Campaign Info
          if (isCreator) {
            const title = summary[5];
            const description = summary[6];
            const targetAmount = summary[7];
            const matchingEvent = createdEvents.find((log) => {
              const parsed = iface.parseLog(log) as LogDescription;
              return parsed.args.campaignAddress.toLowerCase() === address.toLowerCase();
            });
            let createdTimestamp = 0;
            if (matchingEvent) {
              const block = await provider.getBlock(matchingEvent.blockNumber);
              if (block) createdTimestamp = block.timestamp;
            }
            createdCamps.push({
              id: address,
              title,
              description,
              contractAddress: address,
              targetAmount: parseFloat(formatEther(targetAmount.toString())),
              createdAt: createdTimestamp,
            });
          }

          // Pending Votes
          const requestCount = Number(summary[2]);
          for (let i = 0; i < requestCount; i++) {
            const req = await campaign.getRequest(i);
            const hasApproved = await campaign.hasApproved(i, account);
            if (!req[3] && !hasApproved) {
              allPendingVotes.push({
                campaignAddress: address,
                requestIndex: i,
                description: req[0],
                value: formatEther(req[1].toString()),
                recipient: req[2],
                approvalCount: req[4].toString(),
              });
            }
          }
        }

        setFundsRaisedData(Object.entries(fundsMap).map(([date, totalAmount]) => ({ date, totalAmount })));
        setFinalizationsData(Object.entries(finalMap).map(([date, amount]) => ({ date, amount })));
        setCampaignPerformanceData(createdCamps.map((c) => ({
          title: c.title,
          targetAmount: c.targetAmount,
          finalizedAmount: campaignPerfMap[c.id] || 0
        })));
        setCreatedCampaigns(createdCamps);
        setPendingRequests(allPendingVotes);

        // Admin
        if (isAdmin) {
          const summaries = [];
          let totalContributors = 0;
          let totalBalance = 0;
          let totalPending = 0;
          let totalFinalized = 0;

          for (const address of campaigns) {
            const campaign = await getCampaignContract(address);
            const summary = await campaign.getSummary();
            const campaignSummary = {
              address,
              manager: summary[4],
              minimumContribution: summary[0].toString(),
              balance: summary[1].toString(),
              approversCount: Number(summary[3]),
              requestCount: Number(summary[2]),
            };
            totalContributors += campaignSummary.approversCount;
            totalBalance += Number(formatEther(summary[1].toString()));
            totalPending += campaignSummary.requestCount;
            totalFinalized += campaignPerfMap[address] || 0;
            summaries.push(campaignSummary);
          }

          setAdminStats({
            contributors: totalContributors,
            totalFunds: totalBalance.toString(),
            pendingRequests: totalPending,
            finalizedFunds: totalFinalized.toString(),
          });
          setCampaignSummaries(summaries);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [campaigns, isConnected, account]);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaSignInAlt className="text-5xl text-gray-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Wallet Connection Required</h1>
        <p className="text-gray-600">Please connect your wallet to access the dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your On-Chain Dashboard</h1>

      {isAdmin && (
        <>
          
          <AdminDashboardSection
            campaignsLength={campaigns.length}
            totalStats={adminStats}
            formatEther={formatEtherSafe}
            account={account!}
          />
          <AdminStats
            campaignsLength={campaigns.length}
            totalStats={adminStats}
            formatEther={formatEtherSafe}
          />
          <CampaignManagement
            campaignSummaries={campaignSummaries}
            formatEther={formatEtherSafe}
          />
          <AdminActions account={account!} />
          <ContactSubmissions />
        </>
      )}

      <CampaignsICreated createdCampaigns={createdCampaigns} />
      <FundsRaisedChart data={fundsRaisedData} />
      <FinalizationsChart data={finalizationsData} />
      <CampaignPerformanceChart data={campaignPerformanceData} />
      <PendingVotes pendingRequests={pendingRequests} formatEther={formatEtherSafe} />
    </div>
  );
}
