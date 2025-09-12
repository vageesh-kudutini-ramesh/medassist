/*
MedAssist Landing Page — Single-file Next.js page (React + Tailwind)

How to use:
1. Create a Next.js app (Next 13+):
   npx create-next-app@latest medassist-site
2. Install Tailwind CSS (follow Tailwind + Next.js docs) or run:
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   // then configure tailwind.config.js and globals.css
3. Install EmailJS (optional) to make the contact form send emails from client:
   npm install emailjs-com

This file is a self-contained `pages/index.js` representation (or `app/page.tsx` for app router)
- Replace EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID with your EmailJS keys
- Replace placeholder images with your own assets in /public and update paths

Notes for Vercel:
- This is a static React page — works well on Vercel.
- If you use Next.js API routes instead of EmailJS, add an API handler at /pages/api/contact.js

Below is the React component code. Paste it into `pages/index.js` (or `app/page.jsx`) and adapt as required.
*/

'use client';

import React, { useState } from 'react';
import emailjs from 'emailjs-com';

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      // Using EmailJS client-side — replace these with your own IDs
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID || 'YOUR_USER_ID';

      const templateParams = {
        from_name: form.name || 'Anonymous',
        reply_to: form.email || '',
        message: form.message || '',
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  const features = [
    {
      title: 'Medicine Cards',
      icon: '💊',
      desc: 'Color, shape & emoji-based medicine cards so patients don\'t need to read.'
    },
    {
      title: 'Reminders',
      icon: '⏰',
      desc: 'Preset pictorial times (morning, afternoon, night) with audio reminders later.'
    },
    {
      title: 'Pictorial Guide',
      icon: '📘',
      desc: 'Visual info pages and short videos for each medicine.'
    },
    {
      title: 'History & Compliance',
      icon: '📅',
      desc: 'Timeline/calendar with ✅ or ❌ to show taken or missed doses.'
    },
    {
      title: 'Fitness & Wellness',
      icon: '👟',
      desc: 'Simple step/distance/heart metrics and quick exercise buttons.'
    },
    {
      title: 'Caregiver View',
      icon: '👪',
      desc: 'Remote monitoring and alerts for family or doctors (future).' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 text-gray-800">
      <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
            <span className="text-2xl">💙</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">MedAssist</h1>
            <p className="text-sm text-gray-500">Making medicine visual & simple</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-6 items-center text-sm">
          <a href="#features" className="hover:text-sky-700">Features</a>
          <a href="#demo" className="hover:text-sky-700">Demo</a>
          <a href="#roadmap" className="hover:text-sky-700">Roadmap</a>
          <a href="#contact" className="px-4 py-2 bg-sky-600 text-white rounded shadow hover:bg-sky-700">Get in touch</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">MedAssist — Visual medicine helper for everyone</h2>
            <p className="text-lg text-gray-600 mb-6">An app that helps patients with low literacy manage medications using colors, shapes, and simple icons — minimal text, maximum clarity.</p>
            <div className="flex gap-3">
              <a href="#features" className="px-5 py-3 bg-sky-600 text-white rounded shadow">See features</a>
              <a href="#demo" className="px-5 py-3 bg-white border border-gray-200 rounded shadow">View demo</a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="p-4 bg-white rounded shadow flex flex-col items-center gap-2">
                <div className="text-3xl">💊</div>
                <div className="text-sm text-gray-600">Medicine Cards</div>
              </div>
              <div className="p-4 bg-white rounded shadow flex flex-col items-center gap-2">
                <div className="text-3xl">⏰</div>
                <div className="text-sm text-gray-600">Reminders</div>
              </div>
              <div className="p-4 bg-white rounded shadow flex flex-col items-center gap-2">
                <div className="text-3xl">👪</div>
                <div className="text-sm text-gray-600">Caregiver View</div>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-center">
            {/* Placeholder device mockup */}
            <div className="w-64 h-128 bg-white rounded-3xl shadow-lg p-4">
              <div className="h-full flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">MedAssist</div>
                  <div className="text-xs text-gray-400">🔋 85%</div>
                </div>

                <div className="flex-1 bg-sky-50 rounded p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white rounded flex items-center gap-3">
                      <div className="text-2xl">❤️</div>
                      <div>
                        <div className="text-sm font-medium">Heart Pill</div>
                        <div className="text-xs text-gray-400">Morning • ✅</div>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded flex items-center gap-3">
                      <div className="text-2xl">🦴</div>
                      <div>
                        <div className="text-sm font-medium">Calcium</div>
                        <div className="text-xs text-gray-400">Night • ❌</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-white rounded p-3 text-center">
                    <div className="text-sm">Next dose</div>
                    <div className="text-lg font-semibold">8:00 AM • 💊</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-8">
          <h3 className="text-2xl font-semibold mb-4">Features</h3>
          <p className="text-gray-600 mb-6">Core features designed for ease-of-use and accessibility.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-5 bg-white rounded shadow hover:shadow-md transition">
                <div className="text-4xl">{f.icon}</div>
                <h4 className="mt-3 font-semibold">{f.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
                <div className="mt-4">
                  <a className="text-sky-600 text-sm">Learn more →</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo / Screenshots */}
        <section id="demo" className="py-8">
          <h3 className="text-2xl font-semibold mb-4">Demo Screenshots</h3>
          <p className="text-gray-600 mb-6">Pictorial mockups showing how the app will look and feel.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded shadow p-4 flex flex-col items-center gap-3">
              <div className="w-40 h-72 bg-sky-50 rounded-xl flex flex-col p-3">
                <div className="text-2xl">💊</div>
                <div className="mt-auto text-sm">Medicine Card</div>
              </div>
              <div className="text-sm text-gray-500">Card view with emoji, color & taken button</div>
            </div>

            <div className="bg-white rounded shadow p-4 flex flex-col items-center gap-3">
              <div className="w-40 h-72 bg-sky-50 rounded-xl flex flex-col p-3">
                <div className="text-2xl">⏰</div>
                <div className="mt-auto text-sm">Reminders</div>
              </div>
              <div className="text-sm text-gray-500">Simple pictorial reminder setup</div>
            </div>

            <div className="bg-white rounded shadow p-4 flex flex-col items-center gap-3">
              <div className="w-40 h-72 bg-sky-50 rounded-xl flex flex-col p-3">
                <div className="text-2xl">📅</div>
                <div className="mt-auto text-sm">History</div>
              </div>
              <div className="text-sm text-gray-500">Visual timeline with taken/missed status</div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="py-8">
          <h3 className="text-2xl font-semibold mb-4">Roadmap</h3>
          <ol className="space-y-4">
            <li className="p-4 bg-white rounded shadow flex gap-4 items-center">
              <div className="text-3xl">🚀</div>
              <div>
                <div className="font-semibold">Stage 1 — MVP</div>
                <div className="text-sm text-gray-600">Medicine cards, reminders, pictorial guides, contact support.</div>
              </div>
            </li>

            <li className="p-4 bg-white rounded shadow flex gap-4 items-center">
              <div className="text-3xl">🔊</div>
              <div>
                <div className="font-semibold">Stage 2 — Accessibility</div>
                <div className="text-sm text-gray-600">Audio reminders, multilingual support, larger UI for low vision.</div>
              </div>
            </li>

            <li className="p-4 bg-white rounded shadow flex gap-4 items-center">
              <div className="text-3xl">📸</div>
              <div>
                <div className="font-semibold">Stage 3 — AI Features</div>
                <div className="text-sm text-gray-600">Photo recognition of pills, caregiver dashboard, analytics.</div>
              </div>
            </li>
          </ol>
        </section>

        {/* Contact form */}
        <section id="contact" className="py-8">
          <h3 className="text-2xl font-semibold mb-4">Contact / Send feedback</h3>
          <p className="text-gray-600 mb-6">Have feature requests, partners, or caregiving organisations who want to help? Send us a message.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form className="p-6 bg-white rounded shadow" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded p-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded p-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded p-2 h-32" />
              </div>

              <div className="flex items-center gap-4">
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">Send message</button>
                <div>
                  {status === 'sending' && <span className="text-sm text-gray-500">Sending…</span>}
                  {status === 'sent' && <span className="text-sm text-green-600">Message sent — thank you!</span>}
                  {status === 'error' && <span className="text-sm text-red-600">Error sending message.</span>}
                </div>
              </div>
            </form>

            <div className="p-6 bg-white rounded shadow">
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="text-sm text-gray-600 mb-4">Phone: <strong>+1 (555) 555-5555</strong></p>
              <p className="text-sm text-gray-600 mb-4">Support: <strong>support@medassist.app</strong></p>
              <p className="text-sm text-gray-600">We also build caregiver dashboards and integrations for clinics. Tell us about your organisation!</p>
            </div>
          </div>
        </section>

      </main>

      <footer className="max-w-6xl mx-auto p-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MedAssist — Built with care.
      </footer>
    </div>
  );
}
