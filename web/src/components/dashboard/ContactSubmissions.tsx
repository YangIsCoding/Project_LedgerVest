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

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then(setContacts)
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Contact Form Submissions</h2>
      {contacts.length === 0 ? (
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
