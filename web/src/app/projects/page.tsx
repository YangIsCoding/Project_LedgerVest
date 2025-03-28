'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { getCampaignContract } from '@/utils/ethers';
import { FaFilter, FaSort, FaEthereum, FaUsers } from 'react-icons/fa';

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
  }, [isConnected]);

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

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Investment Opportunities</h1>
          <div className="flex space-x-2">
            <button 
              className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              disabled={true}
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
            
            <div className="relative">
              <button 
                className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
                disabled={true}
              >
                <FaSort className="mr-2" />
                Sort
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Wallet Not Connected</h3>
          <p className="text-gray-600 mb-4">Connect your wallet to view active campaigns and participate in fundraising.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Investment Opportunities</h1>
        <div className="flex space-x-2">
          <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center mr-2">
            Create Campaign
          </Link>
          <button 
            className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              <FaSort className="mr-2" />
              Sort
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No Campaigns Found</h3>
          <p className="mb-4 text-gray-600">Be the first to create a fundraising campaign!</p>
          <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 inline-flex items-center">
            Create Campaign
          </Link>
        </div>
      ) : (
        /* Project Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaignSummaries.map((campaign) => (
            <div key={campaign.address} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b p-4">
                <h3 className="text-xl font-semibold mb-1 break-all">
                  <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline">
                    Campaign @ {campaign.address.substring(0, 10)}...
                  </Link>
                </h3>
                <p className="text-sm text-gray-500">Manager: {campaign.manager.substring(0, 10)}...</p>
              </div>
              
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Minimum</div>
                    <div className="font-medium flex items-center justify-center">
                      <FaEthereum className="mr-1 text-gray-700" />
                      <span>{formatEther(campaign.minimumContribution)} ETH</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Balance</div>
                    <div className="font-medium flex items-center justify-center">
                      <FaEthereum className="mr-1 text-gray-700" />
                      <span>{formatEther(campaign.balance)} ETH</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Contributors</div>
                    <div className="font-medium flex items-center justify-center">
                      <FaUsers className="mr-1 text-gray-700" />
                      <span>{campaign.approversCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t flex justify-end">
                <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline text-sm">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}