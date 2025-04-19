'use client';

import { useState, useEffect } from "react";
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from "next/navigation";

export default function LinkAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams?.get("email") || "";

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Linking failed");
      } else {
        setSuccessMessage(data.message || "Account linked successfully");
        // Instead of redirecting to the login page, simply redirect to the home page
        // so that the user remains authenticated.
        // Binding flow: redirect to home page so the user remains logged in.
        if (prefillEmail) {
          // Re-authenticate the user using credentials after binding
          const loginResult = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });

          if (loginResult?.ok) {
            router.push("/");
          } else {
            setError("Binding succeeded, but login failed. Please try logging in manually.");
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Link Your Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        <p className="mb-4">
          An account with email <strong>{email}</strong> already exists. Enter your password below to
          link your Google account to your existing account.
        </p>
        <form onSubmit={handleSubmit}>
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
            Link Account
          </button>
        </form>
      </div>
    </div>
  );
}