'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  walletAddress: string;
  email: string;
  userType: 'normal' | 'admin';
  isBlocked: boolean;
  createdAt: string;
}

export default function UserManagementPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch('/api/user/list');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
    setLoading(false);
  };

  const toggleBlock = async (walletAddress: string, block: boolean) => {
    const res = await fetch('/api/user/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, block }),
    });

    if (res.ok) {
      fetchUsers(); // refresh list
    } else {
      alert('Failed to update user status.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <table className="min-w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Wallet</th>
            <th className="px-4 py-2">User Type</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.walletAddress} className="border-t">
              <td className="px-4 py-2 font-mono">
                {`${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`}
              </td>
              <td className="px-4 py-2 capitalize">{user.userType}</td>
              <td className="px-4 py-2">{user.isBlocked ? '❌ Blocked' : '✅ Active'}</td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => toggleBlock(user.walletAddress, !user.isBlocked)}
                  className={`px-3 py-1 rounded text-white ${
                    user.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
