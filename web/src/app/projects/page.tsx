'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/lib/context/WalletContext';
import { getProvider, getCampaignContract } from '@/utils/ethers';
import ProjectsHeader from '@/components/projectsPage/ProjectsHeader';
import CampaignGrid from '@/components/projectsPage/CampaignGrid';
import NoCampaigns from '@/components/projectsPage/NoCampaigns';

// Campaign summary type
interface CampaignSummary {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
  isLoading: boolean;
}

export default function ProjectsPage() {
  const { isConnected, campaigns, loadCampaigns } = useWallet();
  const [campaignSummaries, setCampaignSummaries] = useState<CampaignSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
            const provider = getProvider(); // get the provider instance
            const balance = provider ? await provider.getBalance(address) : '0';

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
      } catch (error) {
        console.error("Error fetching campaign summaries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignSummaries();
  }, [campaigns, isConnected]);

  // Format the wei value to ETH with a given number of decimals
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
      <ProjectsHeader isConnected={isConnected} isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <NoCampaigns />
      ) : (
        <CampaignGrid campaignSummaries={campaignSummaries} formatEther={formatEther} />
      )}
    </div>
  );
}