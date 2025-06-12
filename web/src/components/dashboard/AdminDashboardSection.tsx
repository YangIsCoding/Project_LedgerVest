import React from 'react';
import { FaUserShield } from 'react-icons/fa';

interface AdminDashboardSectionProps {
  campaignsLength: number;
  totalStats: {
    contributors: number;
    totalFunds: string;
    pendingRequests: number;
  };
  formatEther: (wei: string, decimals?: number) => string;
  account: string;
}

export default function AdminDashboardSection({
  campaignsLength,
  totalStats,
  formatEther,
  account
}: AdminDashboardSectionProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center">
          <FaUserShield className="mr-2 text-blue-600" /> Admin Dashboard
        </h2>
        <p className="text-gray-600 mb-2">
          Manage platform activities and monitor campaigns.
        </p>
        <p className="text-sm text-gray-500">
          Logged in as: <span className="font-mono">{account}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">Total Campaigns</p>
          <p className="text-2xl font-semibold text-blue-600">{campaignsLength}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">Total Contributors</p>
          <p className="text-2xl font-semibold text-green-600">{totalStats.contributors}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">Total Raised</p>
          <p className="text-2xl font-semibold text-purple-600">
            {formatEther(totalStats.totalFunds)} ETH
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
          <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
          <p className="text-2xl font-semibold text-red-600">{totalStats.pendingRequests}</p>
        </div>
      </div>
    </div>
  );
}
