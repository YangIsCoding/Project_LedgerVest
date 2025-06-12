import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface Props {
  data: { date: string; amount: number }[];
}

export default function FinalizationsChart({ data }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Finalizations I've Received</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No finalizations received yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `${value} ETH`} />
            <Tooltip
              formatter={(value: number | string) => `${value} ETH`}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
