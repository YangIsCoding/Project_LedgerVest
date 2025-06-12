'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/lib/context/WalletContext';
import { getProvider, getCampaignContract, getFactoryContract } from '@/utils/ethers';
import ProjectsHeader from '@/components/projectsPage/ProjectsHeader';
import CampaignGrid from '@/components/projectsPage/CampaignGrid';
import NoCampaigns from '@/components/projectsPage/NoCampaigns';
import { Interface } from 'ethers';

export interface CampaignSummary {
  address: string;
  title: string; // ⭐️ 補抓 title
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
  isLoading: boolean;
  createdAt: number;
}

export default function ProjectsPage() {
  const { isConnected } = useWallet();
  const [campaignSummaries, setCampaignSummaries] = useState<CampaignSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (isConnected) {
      fetchCampaignSummaries();
    } else {
      setCampaignSummaries([]);
      setIsLoading(false);
    }
  }, [isConnected]);

  async function fetchCampaignSummaries() {
    try {
      setIsLoading(true);

      const provider = getProvider();
      const factory = await getFactoryContract();

      const iface = factory.interface as Interface;
      const events = await factory.queryFilter(factory.filters.CampaignCreated(), 0, 'latest');

      console.log('CampaignCreated events:', events);

      const summariesPromises = events.map(async (log) => {
        const parsed = (() => {
          try {
            return iface.parseLog(log);
          } catch {
            console.warn('Skipping non-matching log:', log);
            return null;
          }
        })();

        if (!parsed) return null;

        const campaignAddress = parsed.args.campaignAddress;
        const block = await provider.getBlock(log.blockNumber);

        if (!block) {
          console.warn(`Block ${log.blockNumber} not found, skipping campaign ${campaignAddress}`);
          return null;
        }

        try {
          const campaign = await getCampaignContract(campaignAddress);

          const manager = await campaign.manager();
          const title = await campaign.title(); // ⭐️ 抓 title
          const minimumContribution = await campaign.minimumContribution();
          const approversCount = await campaign.approversCount();
          const balance = await provider.getBalance(campaignAddress);

          return {
            address: campaignAddress,
            title,
            manager,
            minimumContribution: minimumContribution.toString(),
            balance: balance.toString(),
            approversCount: Number(approversCount),
            isLoading: false,
            createdAt: block.timestamp
          };
        } catch (error) {
          console.error(`Error loading campaign at ${campaignAddress}:`, error);
          return null;
        }
      });

      const results = await Promise.all(summariesPromises);
      const cleanResults = results.filter((x): x is CampaignSummary => x !== null);

      setCampaignSummaries(cleanResults);
    } catch (error) {
      console.error('Error fetching campaign summaries:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatEther = (wei: string, decimals = 4) => {
    try {
      const ethValue = parseFloat(wei) / 1e18;
      return ethValue.toFixed(decimals);
    } catch (error) {
      return '0';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectsHeader
        isConnected={isConnected}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      {!isConnected ? (
        <div className="text-center py-12 text-gray-500">
          Please connect your wallet to view campaigns.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : campaignSummaries.length === 0 ? (
        <NoCampaigns />
      ) : (
        <CampaignGrid campaignSummaries={campaignSummaries} formatEther={formatEther} />
      )}
    </div>
  );
}
