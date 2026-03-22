import Link from "next/link";
import { getVendorDemoSnapshots, getVendorInquiryById } from "@/lib/db";

type Props = {
  searchParams?: Promise<{ lead?: string; company?: string }>;
};

export const dynamic = "force-dynamic";

export default async function VendorDemoSummaryPage({ searchParams }: Props) {
  const sp = (await searchParams) || {};
  const leadId = sp.lead || "";
  const inquiry = leadId ? getVendorInquiryById(leadId) : null;
  const company = inquiry?.company || sp.company || "Wedding Program Demo";

  const latest = getVendorDemoSnapshots(leadId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <section className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold">Weddingful · Demo Summary</p>
            <h1 className="text-3xl font-semibold text-gray-900">Voice Concierge Pilot Snapshot</h1>
          </div>
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.print();
            }}
            className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700"
          >
            Print / Save PDF
          </button>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6 mb-6">
          <p className="text-sm text-gray-500">Company</p>
          <p className="text-xl font-semibold text-gray-900">{company}</p>
          <p className="text-sm text-gray-500 mt-3">Lead ID: {leadId || "demo"}</p>
        </div>

        {!latest ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-amber-900">No saved demo snapshots yet.</p>
            <p className="text-sm text-amber-800 mt-1">Run a scenario in Live Call Studio and click "Save Snapshot" first.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <Metric label="Scenario" value={latest.scenario} />
              <Metric label="Score" value={`${latest.score}/100`} />
              <Metric label="Captured At" value={new Date(latest.createdAt).toLocaleString()} />
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3">Transcript Highlights</h2>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                {latest.transcript.slice(0, 12).map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-2">Recommended Next Steps</h2>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                <li>Run two more scenarios to baseline qualification consistency.</li>
                <li>Enable same-day follow-up SLA for high-intent calls.</li>
                <li>Book pilot onboarding to move from staged demo to live workflow.</li>
              </ul>
            </div>
          </>
        )}

        <div className="mt-8 flex gap-3 print:hidden">
          <Link
            href={`/vendors/live-demo?lead=${encodeURIComponent(leadId)}&company=${encodeURIComponent(company)}`}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Live Studio
          </Link>
          <Link
            href={`/vendors/training-dashboard?lead=${encodeURIComponent(leadId)}`}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
