import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <article className="mx-auto max-w-3xl">
        <nav className="text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-rose-600">Home</Link> · <span>Guides</span>
        </nav>

        <div className="h-48 rounded-2xl bg-gradient-to-r from-rose-100 to-pink-50 mb-6" />
        <h1 className="text-4xl font-bold leading-tight mb-3">How to Negotiate Wedding Vendor Pricing (Without the Awkwardness)</h1>
        <p className="text-gray-600 mb-8">Published by Weddingful · Updated March 2026</p>

        <section className="space-y-5 text-gray-700 leading-7">
          <p>Planning a wedding is emotional. Vendor pricing shouldn&apos;t be. The key is to negotiate with structure, not stress.</p>
          <h2 className="text-2xl font-semibold text-gray-900 pt-2">Why couples overpay</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>They compare packages, not true line-item totals</li>
            <li>They ask for discounts too late in the process</li>
            <li>They don&apos;t trade flexibility for value (dates, scope, bundles)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 pt-2">Weddingful negotiation framework</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Define your target total and hard ceiling</li>
            <li>Request detailed line items (fees, taxes, mandatory add-ons)</li>
            <li>Build BATNA (best alternative quote)</li>
            <li>Ask for concession bundles instead of one-off discounts</li>
            <li>Set a clear decision timeline</li>
          </ol>

          <h2 className="text-2xl font-semibold text-gray-900 pt-2">Contract red flags</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Undefined admin/coordinator fees</li>
            <li>Service charge stacking without clarity</li>
            <li>Vague weather backup commitments</li>
            <li>Front-loaded payment schedule with strict cancellation</li>
          </ul>
        </section>

        <div className="mt-10 rounded-xl bg-rose-50 p-5">
          <h3 className="text-xl font-semibold mb-2">Next step</h3>
          <p className="text-gray-600 mb-4">Start your free Savings Estimate for personalized negotiation priorities, or upgrade to Concierge Audit for line-by-line quote review.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/intake" className="rounded-full bg-rose-600 px-5 py-2.5 text-white font-semibold">Start Free Savings Estimate</Link>
            <Link href="/concierge" className="rounded-full border border-rose-600 px-5 py-2.5 text-rose-600 font-semibold">Upgrade to Concierge Audit</Link>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h4 className="font-semibold mb-3">Related reading</h4>
          <ul className="text-sm space-y-2">
            <li><Link className="text-rose-600 hover:underline" href="/destinations/cancun-wedding-cost">Cancun Destination Wedding Cost (2026)</Link></li>
            <li><Link className="text-rose-600 hover:underline" href="/intake">Get your personalized savings estimate</Link></li>
          </ul>
        </div>
      </article>
    </main>
  );
}
