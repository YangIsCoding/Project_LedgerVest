'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-200">
          Welcome, {session.user?.name || session.user?.email}
        </p>
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          <FaSignOutAlt className="mr-1" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      <FaSignInAlt className="mr-1" />
      <span>Sign in with Google</span>
    </button>
  );
}