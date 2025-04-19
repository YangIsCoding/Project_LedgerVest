'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const registrationSuccess = searchParams?.get("fromRegister") || null;
    const notifyMessage = searchParams?.get("notify") || null; // new query param for custom notify message

    const errorMapping: Record<string, string> = {
        CredentialsSignin: "Invalid email or password, please check your credentials or register",
        OAuthSignin: "Error during OAuth sign in",
        OAuthCallback: "Error during OAuth callback",
        OAuthCreateAccount: "Could not create account with OAuth",
        EmailCreateAccount: "Could not create account with email",
        Callback: "An error occurred during sign in",
        OAuthAccountExists: "An account linked to this google Oauth already exists, please log in",
        OAuthAccountNotLinked: "Please sign in with the same account used previously"
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });
        if (res?.error) {
            const errorMessage = errorMapping[res.error] ?? "An unknown error occurred";
            setError(errorMessage);
        } else {
            setTimeout(() => {
                router.push('/');
            }, 500);
        }
    }

    async function handleOAuthLogin() {
        signIn('google', { callbackUrl: '/' });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {notifyMessage ? (
                    <p className="text-green-600 mb-4">{notifyMessage}</p>
                ) : registrationSuccess ? (
                    <p className="text-green-600 mb-4">
                        Registration successful. Please log in with your new credentials.
                    </p>
                ) : null}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
                            required
                        />
                    </div>
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
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={handleOAuthLogin}
                        className="flex items-center justify-center w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200 transition-colors"
                    >
                        <FcGoogle className="mr-2" size={24} />
                        <span>Sign in with Google OAuth</span>
                    </button>
                    <p className="mt-4">
                        First time here?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Register an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}