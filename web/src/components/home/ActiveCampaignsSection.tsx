'use client';

import React from 'react';
import Link from 'next/link';
import { FaPlus, FaWallet, FaEthereum, FaUsers } from 'react-icons/fa';

interface CampaignSummary {
  address: string;
  title: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
}

interface ActiveCampaignsSectionProps {
  isConnected: boolean;
  isLoading: boolean;
  campaignSummaries: CampaignSummary[];
  formatEther: (wei: string, decimals?: number) => string;
}

const ActiveCampaignsSection: React.FC<ActiveCampaignsSectionProps> = ({
  isConnected,
  isLoading,
  campaignSummaries,
  formatEther,
}) => {
  const displayedCampaigns = campaignSummaries.slice(0, 3);

  return (
    <section className="py-16 text-gray-800 dark:text-white-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Active Fundraising Campaigns</h2>
          <p className="text-xl max-w-3xl mx-auto">
            Browse our current campaigns and start investing today
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
            <FaPlus className="mr-2" /> Create Campaign
          </Link>
        </div>

        {!isConnected ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg shadow-xs">
            <FaWallet className="text-5xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-4">Connect your wallet to view active campaigns and participate in fundraising.</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : campaignSummaries.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No Campaigns Found</h3>
            <p className="mb-4 text-gray-600">Be the first to create a fundraising campaign!</p>
            <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 inline-flex items-center">
              <FaPlus className="mr-2" /> Create Campaign
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {displayedCampaigns.map((campaign) => (
              <div
                key={campaign.address}
                className="border rounded-lg shadow-xs overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <div className="border-b p-4">
                  <h2 className="font-semibold text-lg mb-1 break-all">
                  <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline">
                    {campaign.title ? campaign.title : `Campaign @ ${campaign.address.substring(0, 10)}...`}
                  </Link>
                </h2>
                  <p className="text-sm text-gray-500">Manager: {campaign.manager.substring(0, 10)}...</p>
                </div>

                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Minimum</div>
                      <div className="font-medium flex items-center justify-center">
                        <FaEthereum className="mr-1 text-gray-700" />
                        <span>{formatEther(campaign.minimumContribution, 2)} ETH</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Balance</div>
                      <div className="font-medium flex items-center justify-center">
                        <FaEthereum className="mr-1 text-gray-700" />
                        <span>{formatEther(campaign.balance, 2)} ETH</span>
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

        {isConnected && campaignSummaries.length > 3 && (
          <div className="text-center mt-8">
            <Link href="/projects" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 inline-block">
              View All Campaigns
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActiveCampaignsSection;
