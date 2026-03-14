import Link from "next/link";

type Props = {
  searchParams?: Promise<{ company?: string; lead?: string }>;
};

export default async function VendorConfirmedPage({ searchParams }: Props) {
  const sp = (await searchParams) || {};
  const company = sp.company || "your team";
  const lead = sp.lead || "";

  return (
    <main className="min-h-screen bg-white px-6 py-14">
      <section className="max-w-5xl mx-auto text-center">
        <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
          Registration confirmed
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
          Welcome, {company}.
          <br />
          Here&apos;s what top teams unlock first.
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-3xl mx-auto">
          Your pilot profile is in. Below are high-impact outcomes teams typically target in their first 30 days.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            ["-78%", "Missed-call risk", "Capture more inquiries outside office hours with 24/7 AI answering."],
            ["+41%", "Qualified lead rate", "Gather date, budget, and guest count before your team follows up."],
            ["2.6x", "Faster response ops", "Auto-route high-intent calls and reduce manual triage."],
          ].map(([stat, label, desc]) => (
            <div key={label} className="rounded-2xl border border-gray-200 p-6 text-left bg-white shadow-sm">
              <div className="text-4xl font-bold text-rose-600 mb-1">{stat}</div>
              <p className="font-semibold text-gray-900 mb-2">{label}</p>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 mb-8 text-left max-w-3xl mx-auto">
          <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-semibold">Next step</p>
          <h2 className="text-2xl font-bold mb-2">Open your demo & training dashboard</h2>
          <p className="text-gray-600">
            Review your onboarding checklist, voice flow training modules, and the demo lead intelligence view.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Link href={`/vendors/training-dashboard?lead=${encodeURIComponent(lead)}`} className="rounded-full bg-rose-600 text-white px-6 py-3 font-semibold hover:bg-rose-700">
            Enter Demo Dashboard
          </Link>
          <Link href="/vendors" className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
            Back to Vendor Page
          </Link>
        </div>
      </section>
    </main>
  );
}
