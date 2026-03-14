import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <article className="mx-auto max-w-3xl">
        <nav className="text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-rose-600">Home</Link> · <span>Destinations</span>
        </nav>

        <div className="h-48 rounded-2xl bg-gradient-to-r from-sky-100 to-cyan-50 mb-6" />
        <h1 className="text-4xl font-bold leading-tight mb-3">Cancun Destination Wedding Cost (2026 Realistic Breakdown)</h1>
        <p className="text-gray-600 mb-8">Published by Weddingful · Updated March 2026</p>

        <section className="space-y-5 text-gray-700 leading-7">
          <p>If you&apos;re planning a Cancun wedding, cost depends on guest count, venue class, and hidden fee exposure.</p>

          <h2 className="text-2xl font-semibold text-gray-900 pt-2">Typical budget ranges (2026)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>40–60 guests: $18,000–$35,000</li>
            <li>60–90 guests: $28,000–$55,000</li>
            <li>90–130 guests: $45,000–$90,000+</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 pt-2">Cost categories to model</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Venue/package base + per-guest F&B</li>
            <li>Ceremony/reception fees</li>
            <li>Decor/floral + AV/music + photo/video</li>
            <li>Taxes, service charges, admin/resort fees</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 pt-2">Hidden costs couples miss</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mandatory outside vendor fees</li>
            <li>Minimum F&B thresholds</li>
            <li>Setup/teardown labor charges</li>
            <li>Overage pricing above base guest tiers</li>
          </ul>
        </section>

        <div className="mt-10 rounded-xl bg-rose-50 p-5">
          <h3 className="text-xl font-semibold mb-2">Get your personalized numbers</h3>
          <p className="text-gray-600 mb-4">Use Weddingful&apos;s free Savings Estimate. If you already have quotes, upgrade to Concierge Audit for line-by-line validation and negotiation support.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/intake" className="rounded-full bg-rose-600 px-5 py-2.5 text-white font-semibold">Start Free Savings Estimate</Link>
            <Link href="/concierge" className="rounded-full border border-rose-600 px-5 py-2.5 text-rose-600 font-semibold">Upgrade to Concierge Audit</Link>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h4 className="font-semibold mb-3">Related reading</h4>
          <ul className="text-sm space-y-2">
            <li><Link className="text-rose-600 hover:underline" href="/guides/wedding-vendor-negotiation">How to Negotiate Wedding Vendor Pricing</Link></li>
            <li><Link className="text-rose-600 hover:underline" href="/vendors">For venues & planners: qualified lead program</Link></li>
          </ul>
        </div>
      </article>
    </main>
  );
}
