import React from 'react';
import { FaUserCircle, FaHandHoldingUsd, FaVoteYea, FaWallet } from 'react-icons/fa';

interface UserDashboardSectionProps {
  userContributionsLength: number;
  pendingRequestsLength: number;
  account: string;
}

export default function UserDashboardSection({
  userContributionsLength,
  pendingRequestsLength,
  account
}: UserDashboardSectionProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        <FaUserCircle className="mr-2 text-blue-600" /> User Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        Welcome back! View your contributions and voting opportunities.
      </p>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Your Contributions</h3>
            <FaHandHoldingUsd className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{userContributionsLength}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pending Votes</h3>
            <FaVoteYea className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold">{pendingRequestsLength}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Connected Wallet</h3>
            <FaWallet className="text-blue-600" />
          </div>
          <p className="text-sm font-medium">
            {account
              ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
              : 'Not connected'}
          </p>
        </div>
      </div>
    </div>
  );
}
