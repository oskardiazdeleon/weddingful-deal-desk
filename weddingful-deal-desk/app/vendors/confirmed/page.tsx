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
        <p className="text-gray-500 text-lg mb-6 max-w-3xl mx-auto">
          Your pilot profile is in. We now track outcomes with a transparent scorecard based on your own call data.
        </p>

        {emailStatus === "not_sent" ? (
          <div className="max-w-3xl mx-auto mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <p className="text-sm font-semibold text-amber-900">Registration saved. Confirmation email is not configured yet.</p>
            <p className="text-sm text-amber-800 mt-1">
              Your lead is in the system and follow-up queue. We can enable outbound email delivery next (provider key + sender domain).
              {emailReason ? ` (reason: ${emailReason})` : ""}
            </p>
          </div>
        ) : emailStatus === "sent" ? (
          <div className="max-w-3xl mx-auto mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left">
            <p className="text-sm font-semibold text-emerald-900">Confirmation email sent.</p>
            <p className="text-sm text-emerald-800 mt-1">Check your inbox for pilot access and onboarding steps.</p>
          </div>
        ) : null}

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            [
              "Answer rate",
              "Track answered vs missed inquiry calls by time window.",
              "Goal: identify after-hours gaps and recover missed demand.",
            ],
            [
              "Qualification quality",
              "Measure capture of date window, budget, guest count, and destination intent.",
              "Goal: improve handoff quality for faster sales follow-up.",
            ],
            [
              "Response speed",
              "Track time from inbound call to first sales follow-up.",
              "Goal: tighten SLA execution and increase demo booking conversion.",
            ],
          ].map(([label, desc, goal]) => (
            <div key={label} className="rounded-2xl border border-gray-200 p-6 text-left bg-white shadow-sm">
              <p className="text-lg font-semibold text-gray-900 mb-2">{label}</p>
              <p className="text-sm text-gray-600 mb-2">{desc}</p>
              <p className="text-sm text-gray-500">{goal}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mb-10 rounded-xl border border-blue-200 bg-blue-50 p-4 text-left">
          <p className="text-sm font-semibold text-blue-900">About benchmarks</p>
          <p className="text-sm text-blue-800 mt-1">
            This page now avoids unverified performance claims. As pilot data accumulates, we’ll show account-specific uplift metrics sourced from your own call logs and CRM outcomes.
          </p>
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
