import React from 'react';
import Link from 'next/link';
import { FaEthereum, FaHandHoldingUsd } from 'react-icons/fa';

interface CampaignSummary {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
  requestCount: number;
}

interface YourInvestmentsProps {
  userContributions: CampaignSummary[];
  formatEther: (wei: string, decimals?: number) => string;
}

export default function YourInvestments({
  userContributions,
  formatEther
}: YourInvestmentsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-8">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold">Your Investments</h2>
      </div>
      <div className="p-4">
        {userContributions.length === 0 ? (
          <div className="text-center py-8">
            <FaHandHoldingUsd className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't invested in any campaigns yet.</p>
            <Link href="/projects" className="bg-blue-600 text-white py-2 px-4 rounded-sm hover:bg-blue-700">
              Browse Campaigns
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userContributions.map((campaign) => (
              <div key={campaign.address} className="border rounded-lg overflow-hidden">
                <div className="border-b p-4">
                  <h3 className="font-semibold truncate">
                    <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline">
                      Campaign @ {campaign.address.substring(0, 10)}...
                    </Link>
                  </h3>
                </div>
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="font-medium flex items-center">
                        <FaEthereum className="mr-1 text-gray-700" />
                        {formatEther(campaign.balance)} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contributors</p>
                      <p className="font-medium">{campaign.approversCount}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline text-sm">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}