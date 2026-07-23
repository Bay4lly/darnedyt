import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';

export default async function TermsPage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="font-display text-4xl font-black text-white">Terms of Service</h1>
        <p className="text-xs font-mono text-brand-pink">Last Updated: July 23, 2026</p>

        <div className="space-y-6 text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Acceptable Use</h2>
            <p>
              By accessing the DarNed Sponsorship Hub, you agree to submit legitimate business proposals. Spam, automated form submissions, or malicious uploads are strictly prohibited and subject to immediate IP banning.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Sponsorship Deliverables & Approval</h2>
            <p>
              All sponsored video integrations and Shorts require final script/concept review prior to publication. Rates and turnaround times agreed upon in ticket negotiations are binding upon contract execution.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Account Suspension</h2>
            <p>
              DarNed administrators reserve the right to suspend or delete accounts that violate these terms or upload unauthorized media.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
