import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';

export default async function PrivacyPage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="font-display text-4xl font-black text-white">Privacy Policy</h1>
        <p className="text-xs font-mono text-brand-pink">Last Updated: July 23, 2026</p>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              When you submit a sponsorship proposal, register a user account, or contact the DarNed team, we collect your full name, email address, company name, phone number, and campaign specifications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. How Information Is Used</h2>
            <p>
              Your data is exclusively used to evaluate sponsorship inquiries, communicate campaign deliverables, issue invoices, and manage support tickets. We do not sell or share personal data with third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Security & Cookies</h2>
            <p>
              We implement HTTP-only encrypted session cookies, bcrypt password hashing, and SSL encryption to ensure account security.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Data Deletion Requests</h2>
            <p>
              You may request account deactivation or total data erasure at any time by submitting a request to <strong>umran3639828@gmail.com</strong>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
