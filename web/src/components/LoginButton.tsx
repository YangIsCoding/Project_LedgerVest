'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-200">Welcome, {session.user?.name || session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
    >
      Sign in with Google
    </button>
  );
}
