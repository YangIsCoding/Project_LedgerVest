'use client';
import { useEffect, useState } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function ContactSubmissions() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setContacts(data);
        } else {
          console.error('📛 Invalid data format:', data);
          setError('Failed to load contact submissions.');
        }
      })
      .catch((err) => {
        console.error('📛 Fetch error:', err);
        setError('Something went wrong while fetching data.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Contact Form Submissions</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : contacts.length === 0 ? (
        <p>No contact submissions found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {contacts.map((c) => (
            <li key={c.id} className="py-4">
              <p><strong>{c.name}</strong> ({c.email})</p>
              <p className="text-sm text-gray-600">{c.message}</p>
              <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
