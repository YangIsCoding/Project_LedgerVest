import React from 'react';
import Link from 'next/link';
import { FaEthereum } from 'react-icons/fa';

interface PendingRequest {
  campaignAddress: string;
  requestIndex: number;
  description: string;
  value: string;
  recipient: string;
  approvalCount: string;
}

interface PendingVotesProps {
  pendingRequests: PendingRequest[];
  formatEther: (wei: string, decimals?: number) => string;
}

export default function PendingVotes({
  pendingRequests,
  formatEther
}: PendingVotesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold">Pending Votes</h2>
      </div>
      <div className="p-4">
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500 py-4">No pending requests require your vote at this time.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <tr key={`${request.campaignAddress}-${request.requestIndex}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.campaignAddress.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaEthereum className="mr-1 text-gray-700" />
                        {formatEther(request.value)} ETH
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{request.recipient.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/campaigns/${request.campaignAddress}/requests/${request.requestIndex}`}
                        className="bg-green-600 text-white py-1 px-3 rounded-sm hover:bg-green-700 text-xs"
                      >
                        Vote
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