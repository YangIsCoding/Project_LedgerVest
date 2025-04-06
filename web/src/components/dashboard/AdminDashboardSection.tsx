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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <FaUserShield className="mr-2 text-blue-600" /> Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage platform activities and monitor campaigns.
        </p>
      </div>
    </div>
  );
}