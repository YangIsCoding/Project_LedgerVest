'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react'; // Import signOut
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function WalletAutoConnector() {
    const { data: session, status: sessionStatus } = useSession();
    const { address: connectedAddress, isConnected, isConnecting } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const router = useRouter(); // Initialize router
    const [connectionRefusedByMismatch, setConnectionRefusedByMismatch] = useState(false);
    const sessionStatusRef = useRef(sessionStatus);
    useEffect(() => {
        sessionStatusRef.current = sessionStatus;
    }, [sessionStatus]);
    // Log initial state
    console.log("WalletAutoConnector Render:", { sessionStatus, isConnected, isConnecting, sessionWalletAddress: session?.user?.walletAddress, connectionRefusedByMismatch });

    // Reset refusal state ONLY when authentication status or user ID changes
    useEffect(() => {
        // ✅ Log which dependency changed if needed for deep debugging:
        // console.log("WalletAutoConnector: Reset Effect triggered.", { sessionStatus, userId: session?.user?.id });
        console.log("WalletAutoConnector: Auth status or User ID changed, resetting refusal state.");
        setConnectionRefusedByMismatch(false);
        // ✅ Change dependency array to more stable values
    }, [sessionStatus, session?.user?.id]);

    // Effect 1: Initiate connection attempt
    useEffect(() => {
        const timestamp = new Date().toLocaleTimeString(); // Keep timestamp for debugging
        console.log(`[${timestamp}] WalletAutoConnector Effect 1 Check:`, { sessionStatus, sessionWalletAddress: session?.user?.walletAddress, isConnected, isConnecting, connectionRefusedByMismatch });
        console.log(`[${timestamp}] WalletAutoConnector Effect 1: Available Connectors:`, connectors.map(c => ({ id: c.id, name: c.name, ready: c.ready })));
        let connectTimer: NodeJS.Timeout | null = null;
        if (
            sessionStatus === 'authenticated' &&
            session?.user?.walletAddress &&
            !isConnected &&
            !isConnecting &&
            !connectionRefusedByMismatch // Check refusal flag
        ) {
            const targetConnectorId = 'metaMaskSDK';
            console.log(`[${timestamp}] WalletAutoConnector Effect 1: Conditions met. Searching for '${targetConnectorId}' connector...`);
            const targetConnector = connectors.find(c => c.id === targetConnectorId);

            if (targetConnector) {
                if (targetConnector.ready !== false) {
                    console.log(`[${timestamp}] WalletAutoConnector Effect 1: Found '${targetConnectorId}' connector and it seems ready. >>> ATTEMPTING CONNECT <<<`, targetConnector);
                    // --- Add Delay ---
                    connectTimer = setTimeout(() => {
                        const currentStatus = sessionStatusRef.current; // Read status from ref
                        console.log(`[${timestamp}] WalletAutoConnector Effect 1: Timeout check. Current sessionStatus: ${currentStatus}`);
                        // Re-check conditions *inside* the timeout
                        // Use the Ref for the most up-to-date sessionStatus check
                        if (
                            currentStatus === 'authenticated' &&
                            !isConnected && // Re-check isConnected, might have changed again
                            !isConnecting &&
                            !connectionRefusedByMismatch
                        ) {
                            console.log(`[${timestamp}] WalletAutoConnector Effect 1: Conditions still met after delay. >>> ATTEMPTING CONNECT <<<`);
                            connect({ connector: targetConnector });
                        } else {
                            console.log(`[${timestamp}] WalletAutoConnector Effect 1: Conditions changed during delay (likely logged out or already connected). Aborting connect.`);
                        }
                    }, 300); // Delay in milliseconds (adjust if needed, 100-200ms is usually enough)
                    // --- End Delay ---
                } else {
                    console.log(`[${timestamp}] WalletAutoConnector Effect 1: Found '${targetConnectorId}' connector, but it is NOT ready.`);
                }
            } else {
                console.log(`[${timestamp}] WalletAutoConnector Effect 1: Target connector '${targetConnectorId}' not found.`);
            }
        } else {
            console.log(`[${timestamp}] WalletAutoConnector Effect 1: Conditions NOT met (or connection refused).`);
        }
    }, [sessionStatus, session, isConnected, isConnecting, connect, connectors, connectionRefusedByMismatch]);

    // Effect 2: Validate connected address against session address
    useEffect(() => {
        let signoutTimer: NodeJS.Timeout | null = null;
        const timestamp = new Date().toLocaleTimeString(); // Keep timestamp for debugging
        console.log(`[${timestamp}] WalletAutoConnector Effect 2 Check:`, { isConnected, connectedAddress, sessionStatus, sessionWalletAddress: session?.user?.walletAddress });
        if (
            isConnected &&
            connectedAddress &&
            sessionStatus === 'authenticated' &&
            session?.user?.walletAddress
        ) {
            console.log(`[${timestamp}] WalletAutoConnector Effect 2: Conditions met. Comparing addresses...`);
            const sessionAddressLower = session.user.walletAddress.toLowerCase();
            const connectedAddressLower = connectedAddress.toLowerCase();

            console.log(`[${timestamp}] WalletAutoConnector Effect 2: Comparing Session[${sessionAddressLower}] vs Connected[${connectedAddressLower}]`);

            if (sessionAddressLower !== connectedAddressLower) {
                console.warn(
                    `[${timestamp}] WalletAutoConnector Effect 2: Mismatch detected! Disconnecting and setting refusal flag.`
                );
                alert(
                    `Wallet Connection Mismatch:\n\nThe connected wallet (${connectedAddressLower}) does not match the address linked to your account (${sessionAddressLower}).\n\nPlease switch to the correct account in your wallet and reconnect manually.`
                );

                // --- Add Delay Before Sign Out/Redirect ---
                signoutTimer = setTimeout(() => {
                    disconnect();
                    console.log(`[${timestamp}] WalletAutoConnector Effect 2: Delay finished. Signing out and redirecting...`);
                    // Sign out NextAuth session
                    signOut({ redirect: false }); // Don't let signOut handle redirect

                    // Redirect to login page with notification
                    const notifyMsg = encodeURIComponent("Logged out due to wallet mismatch. Please log in and connect the correct wallet.");
                    router.push(`/login?notify=${notifyMsg}`);
                }, 500); // Delay in milliseconds (e.g., 500ms = 0.5 seconds)
                // --- End Delay ---
            } else {
                console.log(`[${timestamp}] WalletAutoConnector Effect 2: Addresses match.`);
                // Ensure flag is false if addresses match (handles manual switch to correct account)
                // This might be slightly redundant if the session reset effect works correctly, but adds robustness.
                if (connectionRefusedByMismatch) {
                    console.log(`[${timestamp}] WalletAutoConnector Effect 2: Resetting refusal flag as addresses now match.`);
                    setConnectionRefusedByMismatch(false);
                }
            }
        } else {
            console.log(`[${timestamp}] WalletAutoConnector Effect 2: Conditions NOT met.`);
        }
        // Add connectionRefusedByMismatch to dependencies here as we read it
    }, [isConnected, connectedAddress, sessionStatus, session, disconnect, connectionRefusedByMismatch]);

    return null;
}