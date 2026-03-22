import Link from "next/link";

type Props = {
  searchParams?: Promise<{
    company?: string;
    lead?: string;
    emailStatus?: string;
    emailReason?: string;
  }>;
};

export default async function VendorConfirmedPage({ searchParams }: Props) {
  const sp = (await searchParams) || {};
  const company = sp.company || "your team";
  const lead = sp.lead || "";
  const emailStatus = sp.emailStatus || "";
  const emailReason = sp.emailReason || "";

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-10 sm:px-6">
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Registration Confirmed
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            You&apos;re in, {company}.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Launch your staged Weddingful workspace and preview exactly how voice concierge can run in your program.
          </p>
        </div>

        {emailStatus === "not_sent" ? (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="font-semibold">Lead captured.</span> Confirmation email is not configured yet.
            {emailReason ? <span className="text-amber-800"> ({emailReason})</span> : null}
          </div>
        ) : emailStatus === "sent" ? (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <span className="font-semibold">Email sent.</span> Your onboarding summary is in your inbox.
          </div>
        ) : null}

        <div className="grid md:grid-cols-3 gap-3 mb-8">
          <SignalCard title="Answer Coverage" desc="Track answered vs missed inquiry calls by daypart." />
          <SignalCard title="Qualification Quality" desc="Measure capture of date, budget, guest count, and destination." />
          <SignalCard title="Sales Response Speed" desc="Track time-to-first-follow-up for high-intent inquiries." />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-rose-600 font-semibold mb-2">Recommended First Step</p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Open Live Call Studio</h2>
            <p className="text-sm text-gray-600 mb-4">
              Demo the AI voice flow with wedding-specific scenarios, real-time transcript, and snapshot export.
            </p>
            <Link
              href={`/vendors/live-demo?lead=${encodeURIComponent(lead)}&company=${encodeURIComponent(company)}&scenario=new-inquiry`}
              className="inline-flex rounded-full bg-rose-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-rose-700"
            >
              Start Live Demo
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-2">Program Workspace</p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Training Dashboard</h2>
            <p className="text-sm text-gray-600 mb-4">
              Review staged program settings, scenario library, transcript history, and pilot readiness progress.
            </p>
            <Link
              href={`/vendors/training-dashboard?lead=${encodeURIComponent(lead)}`}
              className="inline-flex rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 mb-8">
          We only show measurable outcomes from your own staged and live call data. No fabricated performance claims.
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={`/vendors/live-demo?lead=${encodeURIComponent(lead)}&company=${encodeURIComponent(company)}&scenario=availability-check`}
            className="rounded-full bg-rose-600 text-white px-6 py-3 font-semibold hover:bg-rose-700"
          >
            Enter Live Call Studio
          </Link>
          <a
            href="mailto:hello@weddingful.co?subject=Weddingful%20Vendor%20Pilot%20Onboarding"
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-white"
          >
            Contact Onboarding Team
          </a>
          <Link
            href="/vendors"
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-white"
          >
            Back to Vendor Page
          </Link>
        </div>
      </section>
    </main>
  );
}

function SignalCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}
