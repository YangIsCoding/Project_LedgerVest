// client-side components wrapper

'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useWallet } from '@/lib/context/WalletContext';
import { getCampaignContract, getProvider, formatEther } from '@/utils/ethers';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ActiveCampaignsSection from '@/components/home/ActiveCampaignsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CallToActionSection from '@/components/home/CallToActionSection';

// Campaign summary type for a campaign
interface CampaignSummary {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
  title: string;
}
export const metadata = {
  title: 'LedgerVest',
  description: 'Decentralized investment platform',
  openGraph: {
    title: 'LedgerVest',
    description: 'Secure Investments Through Blockchain Technology',
    images: [
      {
        url: '@/../public/hero-image.png',
        width: 1200,
        height: 630,
        alt: 'LedgerVest Preview Image',
      },
    ],
  },
};

export default function Home() {
  // entry point for the Home page component
  const { isConnected, campaigns, loadCampaigns } = useWallet(); //use the custom wallet context to get connection status and campaigns
  const [campaignSummaries, setCampaignSummaries] = useState<CampaignSummary[]>([]); // state to hold the summaries of campaigns

  // Load campaign list when wallet connects
  useEffect(() => {

    if (isConnected) {
      loadCampaigns();
    }

  }, [isConnected, loadCampaigns]);

  // Get summary data for each campaign
  useEffect(() => {
    console.log("Fetching campaign summaries...");
    const fetchCampaignSummaries = async () => {
      const provider = getProvider(); // get the provider instance
      if (!isConnected || campaigns.length === 0) {
        // If not connected or no campaigns, reset summaries and loading state
        console.log("No campaigns to load or not connected. Resetting summaries.");
        setCampaignSummaries([]);
        return;
      }

      try {
        const summariesPromises = campaigns.map(async (address) => {
          // Fetch each campaign's details asynchronously
          try {
            const campaign = await getCampaignContract(address); // get the campaign contract instance
            const manager = await campaign.manager(); // get the manager's address
            const minimumContribution = await campaign.minimumContribution(); // get the minimum contribution required
            const approversCount = await campaign.approversCount(); // get the number of approvers
            const balance = await provider.getBalance( address ); // get the balance of the campaign contract
            const title = await campaign.title();

            return {
              address,
              title,
              manager,
              minimumContribution: minimumContribution.toString(),
              balance: balance.toString(),
              approversCount: Number(approversCount),
            };
          } catch (error) {
            console.error(`Error fetching data for campaign ${address}:`, error);
            return {
              address,
              title: 'Error loading',
              manager: 'Error loading',
              minimumContribution: '0',
              balance: '0',
              approversCount: 0,
            };
          }
        });
        const results = await Promise.all(summariesPromises);
        setCampaignSummaries(results);
      } catch (error) {
        console.error("Error fetching campaign summaries:", error);
        setCampaignSummaries([]);
      }
    };

    fetchCampaignSummaries();
  }, [campaigns, isConnected]);


  return (
    <>
      <HeroSection
        isConnected={isConnected}
      />
      <StatsSection />
      <HowItWorksSection />
      <ActiveCampaignsSection
        isConnected={isConnected}
        isLoading={false}
        campaignSummaries={campaignSummaries}
        formatEther={formatEther}
      />
      <FeaturesSection />
      <CallToActionSection />
    </>
  );
}