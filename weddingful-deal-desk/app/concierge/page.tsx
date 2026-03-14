/**
 * Concierge checkout page.
 *
 * TODO: Wire Stripe Checkout
 *   1. Install: npm install stripe @stripe/stripe-js
 *   2. Add env vars: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *   3. Create a Stripe Price ID for the $999 concierge product and set STRIPE_CONCIERGE_PRICE_ID
 *   4. Create /api/checkout/route.ts that calls stripe.checkout.sessions.create()
 *      with success_url=/concierge/success and cancel_url=/concierge
 *   5. Replace the placeholder form below with a redirect to /api/checkout
 */

import Link from "next/link";

const STRIPE_CONFIGURED =
  !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CONCIERGE_PRICE_USD = 999;

interface Props {
  searchParams: Promise<{ leadId?: string }>;
}

export default async function ConciergePage({ searchParams }: Props) {
  const { leadId } = await searchParams;

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <a href="/" className="text-rose-600 font-bold text-xl">
            Weddingful
          </a>
          <h1 className="text-3xl font-bold mt-6 mb-2">Weddingful Concierge Audit</h1>
          <p className="text-gray-500">Your AI wedding assistant + our team perform a real quote audit and negotiate for you.</p>
        </div>

        {/* What you get */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-lg mb-4">What&apos;s included</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            {[
              ["Dedicated planning advisor + AI assistant", "Human guidance plus a personalized AI assistant that keeps your strategy and decisions aligned."],
              ["Full vendor RFP & negotiation", "We send RFPs to 5–10 vendors per category and negotiate on your behalf."],
              ["Contract review", "We flag unfavorable clauses before you sign anything."],
              ["Booking management", "Deposits, payments, and reminders handled for you."],
              ["Day-of checklist", "A comprehensive logistics checklist for the week of your wedding."],
              ["Savings guarantee", "If we don't save you at least $999, we refund the difference."],
            ].map(([title, desc]) => (
              <li key={title} className="flex gap-3">
                <span className="text-rose-500 mt-0.5 shrink-0">✓</span>
                <div>
                  <span className="font-medium">{title}</span>
                  <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Checkout card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-2xl font-bold">${CONCIERGE_PRICE_USD.toLocaleString()}</span>
            <span className="text-gray-400 text-sm">one-time, flat fee</span>
          </div>

          {STRIPE_CONFIGURED ? (
            /* TODO: Replace with actual Stripe redirect form */
            <form action="/api/checkout" method="POST">
              <input type="hidden" name="leadId" value={leadId ?? ""} />
              <button
                type="submit"
                className="w-full bg-rose-600 text-white font-bold py-3.5 rounded-full hover:bg-rose-700 transition-colors"
              >
                Pay ${CONCIERGE_PRICE_USD.toLocaleString()} & Unlock Concierge
              </button>
            </form>
          ) : (
            <div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-sm text-amber-800">
                <strong>Stripe not configured.</strong> Set{" "}
                <code className="font-mono text-xs bg-amber-100 px-1 rounded">
                  STRIPE_SECRET_KEY
                </code>{" "}
                and{" "}
                <code className="font-mono text-xs bg-amber-100 px-1 rounded">
                  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                </code>{" "}
                in your <code className="font-mono text-xs bg-amber-100 px-1 rounded">.env.local</code> to
                enable payments.
              </div>
              <button
                disabled
                className="w-full bg-rose-600 text-white font-bold py-3.5 rounded-full opacity-40 cursor-not-allowed"
              >
                Pay ${CONCIERGE_PRICE_USD.toLocaleString()} & Unlock Concierge
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-3">
            Secured by Stripe · 30-day money-back guarantee
          </p>
        </div>

        <p className="text-center text-sm text-gray-400">
          Questions?{" "}
          <a href="mailto:hello@weddingful.co" className="text-rose-600 hover:underline">
            hello@weddingful.co
          </a>{" "}
          ·{" "}
          <Link href="/audit" className="hover:underline">
            Back to my audit
          </Link>
        </p>
      </div>
    </main>
  );
}
