import React from 'react';
import Link from 'next/link';

export default function NoCampaigns() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">No Campaigns Found</h3>
      <p className="mb-4 text-gray-600">Be the first to create a fundraising campaign!</p>
      <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 inline-flex items-center">
        Create Campaign
      </Link>
    </div>
  );
}