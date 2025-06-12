import React from 'react';
import Link from 'next/link';

interface CreatedCampaign {
  id: string;
  title: string;
  description: string;
  contractAddress: string;
  targetAmount: number;
  createdAt: number; // timestamp seconds
}

interface Props {
  createdCampaigns: CreatedCampaign[];
}

export default function CampaignsICreated({ createdCampaigns }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-8">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold flex items-center">
          Campaigns I Have Created
        </h2>
      </div>
      <div className="p-4">
        {createdCampaigns.length === 0 ? (
          <div className="text-gray-500">You haven’t created any campaigns yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {createdCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded-lg overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="border-b p-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {campaign.title}
                  </h3>
                </div>
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-1">{campaign.description}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    Target: {campaign.targetAmount.toFixed(2)} ETH
                  </p>
                  <p className="text-sm text-gray-400 mb-1">
                    Created at: {new Date(campaign.createdAt * 1000).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    Address: <span className="font-mono">{campaign.contractAddress.slice(0, 10)}...</span>
                  </p>
                </div>
                <div className="p-4 border-t">
                  <Link
                    href={`/campaigns/${campaign.contractAddress}`}
                    className="inline-block bg-blue-600 text-white py-1 px-3 rounded-sm text-sm hover:bg-blue-700 transition-colors"
                  >
                    View Campaign →
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
