// filepath: /home/halcyon/root/fintech512-project_ledgervest/web/src/app/profile/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi'; // Import useAccount and useDisconnect

export default function EditProfilePage() {
    // Use update function to refresh session data locally after update
    const { data: session, status, update: updateSession } = useSession();
    const router = useRouter();
    const { disconnect } = useDisconnect(); // Get disconnect function
    const { isConnected } = useAccount(); // Get connection status

    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Pre-fill username from session
    useEffect(() => {
        if (session?.user?.username) {
            setUsername(session.user.username);
        }
    }, [session]);
    
    useEffect(() => {
        // Redirect logic - runs always, but effect depends on status/router
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]); // Dependency array handles when it re-runs


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        // --- Validation ---
        const passwordChangeRequested = newPassword || currentPassword;
        if (passwordChangeRequested && newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            setIsLoading(false);
            return;
        }
        if (passwordChangeRequested && !currentPassword) {
            setError('Current password is required to change password.');
            setIsLoading(false);
            return;
        }
        if (passwordChangeRequested && !newPassword) {
            setError('New password cannot be empty.');
            setIsLoading(false);
            return;
        }
        // --- End Validation ---

        const payload: { username?: string; currentPassword?: string; newPassword?: string } = {};
        // Only include username if it has changed
        if (username !== session?.user?.username) {
            payload.username = username;
        }
        // Include password fields only if a change is requested
        if (passwordChangeRequested) {
            payload.currentPassword = currentPassword;
            payload.newPassword = newPassword;
        }

        // If nothing changed, don't submit
        if (Object.keys(payload).length === 0) {
            setSuccessMessage('No changes detected.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to update profile.');
            }

            if (payload.newPassword) {
                console.log("Password changed successfully. Disconnecting, signing out, and redirecting...");

                // 1. Disconnect wallet if connected
                if (isConnected) {
                    disconnect();
                }

                // 2. Construct the callback URL with the notification
                const notifyMsg = encodeURIComponent("Password updated successfully. Please log in again with your new password.");
                const callbackUrl = `/login?notify=${notifyMsg}`;

                // 3. Sign out user AND redirect using callbackUrl
                await signOut({ redirect: true, callbackUrl: callbackUrl });

                // Important: Return here to prevent further state updates in this component
                return;
            } else {
                // Only username (or nothing) was changed
                setSuccessMessage(data.message || 'Profile updated successfully!');
                // Clear password fields (they weren't submitted anyway, but good practice)
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');

                // If username was changed, update the session locally
                if (payload.username) {
                    await updateSession({ username: payload.username });
                }
            }

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

                {/* Email (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={session?.user?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                        readOnly
                        disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>

                {/* Password Section */}
                <fieldset className="border p-4 rounded">
                    <legend className="text-sm font-medium text-gray-700 px-1">Change Password (Optional)</legend>
                    <div className="space-y-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                    </div>
                </fieldset>

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