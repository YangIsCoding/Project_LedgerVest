import React from 'react';
import Link from 'next/link';
import { FaEthereum, FaPlus } from 'react-icons/fa';

interface CampaignSummary {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
  requestCount: number;
}

interface CampaignManagementProps {
  campaignSummaries: CampaignSummary[];
  formatEther: (wei: string, decimals?: number) => string;
}

export default function CampaignManagement({
  campaignSummaries,
  formatEther
}: CampaignManagementProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-8">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Campaign Management</h2>
        <div className="flex items-center space-x-2">
          <Link href="/create" className="bg-blue-600 text-white py-1 px-4 rounded-sm hover:bg-blue-700 text-sm flex items-center">
            <FaPlus className="mr-1" /> New
          </Link>
        </div>
      </div>
      <div className="p-4">
        {campaignSummaries.length === 0 ? (
          <p className="text-gray-500">No campaigns found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaignSummaries.map((campaign) => (
                  <tr key={campaign.address}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{campaign.address.substring(0, 10)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{campaign.manager.substring(0, 10)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaEthereum className="mr-1 text-gray-700" />
                        {formatEther(campaign.balance)} ETH
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{campaign.approversCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{campaign.requestCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Link
                        href={`/campaigns/${campaign.address}`}
                        className="inline-block text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded-sm"
                      >
                        View
                      </Link>
                      <Link
                        href={`/campaigns/${campaign.address}/requests`}
                        className="inline-block text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded-sm"
                      >
                        Requests
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
