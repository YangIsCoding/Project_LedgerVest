// filepath: /home/halcyon/root/fintech512-project_ledgervest/web/src/app/register/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';


export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams?.get('email') || '';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { connect } = useConnect();
  const { address: walletAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect(); // Get disconnect function

  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!isConnected || !walletAddress) {
      setError('Please connect your wallet first.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Determine if it's a binding or standard registration flow
    const routeUrl = prefillEmail ? '/api/auth/bind' : '/api/auth/register';
    const payload = { username, email, password, walletAddress }; // Include walletAddress

    try {
      const res = await fetch(routeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        // Handle specific errors from the backend
        if (res.status === 400 || res.status === 409) {
          if (data.message.toLowerCase().includes('username')) {
            setError('Username already exists.');
          } else if (data.message.toLowerCase().includes('email')) {
            setError('Email already registered.');
          } else if (data.message.toLowerCase().includes('wallet')) {
            setError('Wallet address already linked.');
          } else {
            setError(data.message || 'An error occurred.');
          }
        } else {
          setError(data.message || 'Registration/Binding failed.');
        }
      } else {
        setSuccessMessage(data.message || 'Success!');
        // If binding, sign in the user. If registering, redirect to login.
        if (prefillEmail) {
          // Attempt to sign in with credentials after binding
          const signInRes = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
          });
          if (signInRes?.ok) {
            router.push('/'); // Redirect to dashboard after successful bind & login
          } else {
            setError(signInRes?.error || 'Binding successful, but login failed. Please log in manually.');
            // Optionally redirect to login page even on login failure after bind
            // router.push('/login');
          }
        } else {
          // Redirect to login page after standard registration
          const successMessage = encodeURIComponent("Registration successful. Please log in again.");
          router.push(`/login?notify=${successMessage}`);
        }
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      setError('An unexpected error occurred. Please try again.');
    }
  }

  const handleConnectWallet = () => {
    setError(''); // Clear previous errors
    connect({ connector: injected() });
  };

  // Determine button text based on flow
  const submitButtonText = prefillEmail ? 'Complete Registration' : 'Register';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {prefillEmail ? 'Complete Your Registration' : 'Register'}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
              readOnly={!!prefillEmail} // Make email read-only if prefilled (binding flow)
              disabled={!!prefillEmail}
            />
          </div>

          {/* Password Inputs */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>

          {/* Wallet Connection Section */}
          <div className="mb-6 p-4 border rounded bg-gray-50">
            <label className="block text-gray-700 mb-2">Wallet Address</label>
            {isConnected && walletAddress ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono truncate text-green-700">{walletAddress}</span>
                {/* Add Change Wallet Button */}
                <button
                  type="button"
                  onClick={() => disconnect()} // Call disconnect directly
                  className="text-xs bg-red-600 text-white py-2 rounded text-600 hover:bg-red-700 transition-colors"
                >
                  Change Wallet
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectWallet}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isConnected || !walletAddress} // Disable if wallet not connected
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitButtonText}
          </button>
        </form>

        {/* Link to Login or OAuth options */}
        {!prefillEmail && ( // Only show these options for standard registration
          <div className="mt-6 text-center">
            <p className="mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}