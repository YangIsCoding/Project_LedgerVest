import React from 'react';
import { FaUserCircle, FaHandHoldingUsd, FaVoteYea } from 'react-icons/fa';

interface UserStatsProps {
  userContributionsLength: number;
  pendingRequestsLength: number;
}

export default function UserStats({
  userContributionsLength,
  pendingRequestsLength
}: UserStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold flex items-center">
          <FaUserCircle className="mr-2 text-blue-600" /> Your User Account
        </h2>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Your Investments</div>
            <div className="text-2xl font-bold flex items-center">
              <FaHandHoldingUsd className="mr-2 text-blue-600" />
              {userContributionsLength}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Pending Votes</div>
            <div className="text-2xl font-bold flex items-center">
              <FaVoteYea className="mr-2 text-blue-600" />
              {pendingRequestsLength}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
