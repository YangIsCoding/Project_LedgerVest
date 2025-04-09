'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface Props {
  data: {
    title: string;
    targetAmount: number;
    finalizedAmount: number;
  }[];
}

export default function CampaignPerformanceChart({ data }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Campaign Performance</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No campaign data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip
            formatter={(value: number) => `${value} ETH`}
            labelFormatter={(label) => `Campaign: ${label}`}
            />
            <Legend />
            <Bar dataKey="targetAmount" fill="#d1d5db" name="Target Amount" />
            <Bar dataKey="finalizedAmount" fill="#3b82f6" name="Finalized Amount" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
