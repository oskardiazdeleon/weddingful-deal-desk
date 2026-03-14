import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-block bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
          Weddingful Voice Concierge · B2B
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
          Never miss a wedding inquiry again.
          <br />
          <span className="text-rose-600">AI voice assistants for venues.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-8">
          Answer calls 24/7, qualify couples in real-time, and route high-intent leads to your sales team instantly.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link href="/vendors#vendor-form" className="bg-rose-600 text-white text-lg font-semibold px-8 py-3 rounded-full hover:bg-rose-700">
            Start Vendor Pilot
          </Link>
          <Link href="/brand/dashboard" className="border border-rose-600 text-rose-600 text-lg font-semibold px-8 py-3 rounded-full hover:bg-rose-50">
            View Brand Dashboard
          </Link>
        </div>

        <div className="mx-auto max-w-3xl rounded-3xl border border-rose-100 bg-gradient-to-b from-rose-50 to-white p-10 md:p-14">
          <div className="mx-auto h-44 w-44 rounded-full bg-gradient-to-br from-rose-300 via-pink-300 to-purple-300 shadow-[0_0_80px_20px_rgba(244,114,182,0.35)] flex items-center justify-center text-white text-5xl">
            ☎
          </div>
          <p className="text-sm text-gray-500 mt-6">
            AI-powered voice handling with instant lead qualification and handoff.
          </p>
        </div>
      </section>

      <section id="how" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["01", "AI answers every call", "No more missed after-hours wedding inquiries."],
              ["02", "Qualifies each lead", "Captures date window, budget, guest count, and destination intent."],
              ["03", "Routes hot leads fast", "Sends instant summaries to your team via dashboard and email."],
            ].map(([n, title, desc]) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left">
                <div className="text-xs font-semibold text-rose-500 mb-2">{n}</div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Simple usage-based pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Starter", "$299/mo", "300 included mins", "$0.30/min overage"],
            ["Growth", "$699/mo", "1,000 included mins", "$0.28/min overage"],
            ["Premium", "$1,499/mo", "2,500 included mins", "$0.27/min overage"],
          ].map(([tier, price, mins, overage]) => (
            <div key={tier} className="rounded-2xl border border-gray-200 p-6 bg-white">
              <h3 className="font-semibold text-xl mb-1">{tier}</h3>
              <p className="text-3xl font-bold mb-4">{price}</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ {mins}</li>
                <li>✓ AI call qualification workflow</li>
                <li>✓ {overage}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">FAQs</h2>
          <div className="space-y-4 text-left">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold mb-1">Can it transfer calls to my team?</h3>
              <p className="text-sm text-gray-500">Yes. High-intent calls can be routed immediately and logged in your dashboard.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold mb-1">How fast can we launch?</h3>
              <p className="text-sm text-gray-500">Most pilot accounts can be configured in under 7 days.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold mb-1">Do we get lead intelligence too?</h3>
              <p className="text-sm text-gray-500">Yes — enriched lead profiles and scoring are available in the Brand Dashboard add-on.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
