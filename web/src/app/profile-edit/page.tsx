
'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function EditProfilePage() {
    const router = useRouter();
    const { isConnected, address } = useAccount();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Optional: 如果你有存 email
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await fetch('/api/user/profile');
                if (!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();
                setUsername(data.username || '');
                setEmail(data.email || ''); // Optional
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            }
        };

        if (isConnected && address) {
            fetchUserProfile();
        } else {
            router.push('/');
        }
    }, [isConnected, address, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to update profile.');
            }

            setSuccessMessage(data.message || 'Profile updated successfully!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded shadow-md">
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                {/* Email (Read-only, optional) */}
                {email && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                            readOnly
                            disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                    </div>
                )}

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}
