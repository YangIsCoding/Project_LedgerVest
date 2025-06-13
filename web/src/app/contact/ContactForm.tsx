// src/app/contact/ContactForm.tsx
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('✅ Message sent!');
        setForm({ name: '', email: '', message: '' });
      } else {
        const { message = 'Unknown error.' } = await res.json();
        setStatus(`❌ Failed to send message: ${message}`);
      }
    } catch {
      setStatus('❌ Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Contact&nbsp;Us</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded h-32"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-2 rounded ${
            isSubmitting && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>

      {status && (
        <p
          className={`mt-4 text-sm ${
            status.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
