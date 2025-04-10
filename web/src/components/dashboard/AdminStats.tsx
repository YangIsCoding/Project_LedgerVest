import React from 'react';
import { FaChartBar, FaProjectDiagram, FaUsers, FaCoins, FaList } from 'react-icons/fa';

interface AdminStatsProps {
  campaignsLength: number;
  totalStats: {
    contributors: number;
    totalFunds: string;
    pendingRequests: number;
    finalizedFunds: string | number; // 確保包含 finalizedFunds
  };
  formatEther: (wei: string | number | bigint, decimals?: number) => string;
}

export default function AdminStats({
  campaignsLength,
  totalStats,
  formatEther
}: AdminStatsProps )
{
  console.log('Finalized Funds:', totalStats.finalizedFunds);
  return (
    <div className="bg-blue-50 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaChartBar className="mr-2 text-blue-600" /> Platform Stats
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaProjectDiagram className="text-blue-600 mr-2" />
            <span className="text-gray-700">Total Campaigns</span>
          </div>
          <span className="font-bold">{campaignsLength}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaUsers className="text-blue-600 mr-2" />
            <span className="text-gray-700">Total Contributors</span>
          </div>
          <span className="font-bold">{totalStats.contributors}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaCoins className="text-blue-600 mr-2" />
            <span className="text-gray-700">Funds not yet finalized</span>
          </div>
          <span className="font-bold">{formatEther(totalStats.totalFunds)} ETH</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaCoins className="text-green-600 mr-2" />
            <span className="text-gray-700">Funds been finalized</span>
          </div>
          <span className="font-bold">{totalStats.finalizedFunds !== '0'
      ? `${formatEther(totalStats.finalizedFunds)} ETH`
      : 'Loading...'} {/* 顯示占位符 */}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaList className="text-blue-600 mr-2" />
            <span className="text-gray-700">Pending Requests</span>
          </div>
          <span className="font-bold">{totalStats.pendingRequests}</span>
        </div>
      </div>
    </div>
  );
}