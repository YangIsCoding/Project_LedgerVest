import React from 'react';
import Link from 'next/link';
import { FaEthereum, FaUsers } from 'react-icons/fa';

interface CampaignSummary {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
  isLoading: boolean;
}

interface CampaignGridProps {
  campaignSummaries: CampaignSummary[];
  formatEther: (wei: string, decimals?: number) => string;
}

export default function CampaignGrid({ campaignSummaries, formatEther }: CampaignGridProps) {
  return (
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
  );
}