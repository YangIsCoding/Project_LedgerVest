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

// Types
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

  const ADMIN_WALLETS = ['0xaada21fd544da24b3b96e465c4c7074f4d6e8632'.toLowerCase()];
  const isAdmin = ADMIN_WALLETS.includes(account?.toLowerCase() || '');

  const [isLoading, setIsLoading] = useState(true);
  const [createdCampaigns, setCreatedCampaigns] = useState<CreatedCampaign[]>([]);
  const [fundsRaisedData, setFundsRaisedData] = useState<ChartData[]>([]);
  const [finalizationsData, setFinalizationsData] = useState<FinalizationData[]>([]);
  const [campaignPerformanceData, setCampaignPerformanceData] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

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

      // ⭐️ 抓所有 CampaignCreated events 先 cache 起來
      const createdEvents = await factory.queryFilter(factory.filters.CampaignCreated(), 0, 'latest');

      for (const address of campaigns) {
        const campaign = await getCampaignContract(address);

        // Contributions
        const contributionEvents = await campaign.queryFilter(
          campaign.filters.ContributionReceived(),
          0,
          'latest'
        );

        for (const log of contributionEvents) {
          const ev = log as unknown as EventLog;
          const { contributor, amount } = ev.args;
          const block = await provider.getBlock(log.blockNumber);
          if (!block) continue;
          const date = new Date(block.timestamp * 1000).toISOString().slice(0, 10); // yyyy-mm-dd

          fundsMap[date] = (fundsMap[date] || 0) + parseFloat(formatEther(amount.toString()));
        }

        // Finalizations + Performance
        const finalizedEvents = await campaign.queryFilter(
          campaign.filters.RequestFinalized(),
          0,
          'latest'
        );

        finalizedEvents.forEach((log) => {
          const ev = log as unknown as EventLog;
          const { amount, timestamp } = ev.args;
          const date = new Date(Number(timestamp) * 1000).toISOString().slice(0, 10); // yyyy-mm-dd

          finalMap[date] = (finalMap[date] || 0) + parseFloat(formatEther(amount.toString()));

          if (!campaignPerfMap[address]) campaignPerfMap[address] = 0;
          campaignPerfMap[address] += parseFloat(formatEther(amount.toString()));
        });

        // ⭐️ 抓該 campaign 的 createdAt timestamp
        let createdTimestamp = 0;
        const matchingEvent = createdEvents.find((log) => {
          const parsed = iface.parseLog(log) as LogDescription;
          const campaignAddress = parsed.args.campaignAddress;
          return campaignAddress.toLowerCase() === address.toLowerCase();
        });

        if (matchingEvent) {
          const block = await provider.getBlock(matchingEvent.blockNumber);
          if (block) {
            createdTimestamp = block.timestamp;
          } else {
            console.warn(`Block ${matchingEvent.blockNumber} not found for campaign ${address}`);
          }
        } else {
          console.warn(`CampaignCreated event not found for campaign ${address}`);
        }

        // Created campaigns
        const summary = await campaign.getSummary();
        const manager = summary[4];
        const title = summary[5];
        const description = summary[6];
        const targetAmount = summary[7];

        if (manager.toLowerCase() === account.toLowerCase()) {
          createdCamps.push({
            id: address,
            title,
            description,
            contractAddress: address,
            targetAmount: parseFloat(formatEther(targetAmount.toString())),
            createdAt: createdTimestamp, // ⭐️ 正確 timestamp
          });
        }

        // PendingVotes
        const requestCount = Number(summary[2]);
        for (let i = 0; i < requestCount; i++) {
          const req = await campaign.getRequest(i);
          const hasApproved = await campaign.hasApproved(i, account);
          const complete = req[3];

          if (!complete && !hasApproved) {
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

      // Build FundsRaisedChart data
      const fundsData = Object.entries(fundsMap)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, totalAmount]) => ({ date, totalAmount }));

      // Build FinalizationsChart data
      const finalsData = Object.entries(finalMap)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, amount]) => ({ date, amount }));

      // Build CampaignPerformanceChart data
      const perfData = Object.entries(campaignPerfMap).map(([addr, finalizedAmount]) => {
        const campaign = createdCamps.find((c) => c.contractAddress === addr);
        return {
          title: campaign ? campaign.title : addr.slice(0, 6) + '...',
          targetAmount: campaign ? campaign.targetAmount : 0,
          finalizedAmount,
        };
      });

      // Set states
      setFundsRaisedData(fundsData);
      setFinalizationsData(finalsData);
      setPendingRequests(allPendingVotes);
      setCreatedCampaigns(createdCamps);
      setCampaignPerformanceData(perfData);
    } catch (err) {
      console.error('Error fetching on-chain dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [campaigns, isConnected, account]);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-xs">
          <FaSignInAlt className="text-5xl text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Wallet Connection Required</h1>
          <p className="text-gray-600 mb-4">Please connect your wallet to access the dashboard.</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your On-Chain Dashboard</h1>
      <CampaignsICreated createdCampaigns={createdCampaigns} />
      <FundsRaisedChart data={fundsRaisedData} />
      <FinalizationsChart data={finalizationsData} />
      <CampaignPerformanceChart data={campaignPerformanceData} />
      <PendingVotes pendingRequests={pendingRequests} formatEther={formatEther} />
    </div>
  );
}
