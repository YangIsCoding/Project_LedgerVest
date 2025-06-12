import React from 'react';
import Link from 'next/link';
import { FaEthereum, FaUsers } from 'react-icons/fa';
import { CampaignSummary } from '@/types/campaign';

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
            {/* Title */}
            <h3 className="text-xl font-bold text-blue-600 mb-1 break-words">
              <Link href={`/campaigns/${campaign.address}`}>
                {campaign.title
                  ? campaign.title
                  : `Campaign @ ${campaign.address.substring(0, 10)}...`}
              </Link>
            </h3>

            {/* Manager */}
            <p className="text-gray-600 text-sm mb-1">
              Manager: {campaign.manager.substring(0, 10)}...
            </p>

            {/* Created At */}
            {typeof campaign.createdAt === 'number' && campaign.createdAt > 0 && (
              <p className="text-gray-400 text-sm mb-4">
                Created at:{' '}
                {new Date(campaign.createdAt * 1000).toLocaleDateString(undefined, {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}

          </div>

          {/* Middle Section */}
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-3 gap-4">
              {/* Minimum */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Minimum</div>
                <div className="font-medium flex items-center justify-center">
                  <FaEthereum className="mr-1 text-gray-700" />
                  <span>{formatEther(campaign.minimumContribution)} ETH</span>
                </div>
              </div>

              {/* Balance */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Balance</div>
                <div className="font-medium flex items-center justify-center">
                  <FaEthereum className="mr-1 text-gray-700" />
                  <span>{formatEther(campaign.balance)} ETH</span>
                </div>
              </div>

              {/* Contributors */}
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Contributors</div>
                <div className="font-medium flex items-center justify-center">
                  <FaUsers className="mr-1 text-gray-700" />
                  <span>{campaign.approversCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* View Details */}
          <div className="p-4 border-t flex justify-end">
            <Link
              href={`/campaigns/${campaign.address}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View Details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
