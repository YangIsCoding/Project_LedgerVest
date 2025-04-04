import React from 'react';
import { FaEthereum, FaUsers } from 'react-icons/fa';

interface CampaignDetailsProps {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: string;
  isManager: boolean;
  displayEther: (wei: string) => string;
}

export default function CampaignDetails({
  address,
  manager,
  minimumContribution,
  balance,
  approversCount,
  isManager,
  displayEther,
}: CampaignDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Campaign Details</h1>
        <p className="text-gray-500 break-all mb-4">Address: {address}</p>

        <div className="border-t pt-4 mt-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1">Campaign Manager</h2>
            <p className="text-gray-700 break-all">
              {manager}
              {isManager && <span className="ml-2 text-green-600 text-sm">(You)</span>}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Minimum Contribution</div>
              <div className="font-medium flex items-center">
                <FaEthereum className="mr-1 text-gray-700" />
                <span>{displayEther(minimumContribution)} ETH</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Campaign Balance</div>
              <div className="font-medium flex items-center">
                <FaEthereum className="mr-1 text-gray-700" />
                <span>{displayEther(balance)} ETH</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Contributors</div>
              <div className="font-medium flex items-center">
                <FaUsers className="mr-1 text-gray-700" />
                <span>{approversCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}