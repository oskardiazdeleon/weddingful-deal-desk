import {
  getVendorFollowups,
  getVendorInquiries,
  getVendorTrainingEvents,
} from "@/lib/db";

export const dynamic = "force-dynamic";

const dashboardNav = [
  "Overview",
  "Call Activity",
  "Follow-up Queue",
  "Lead Intelligence",
  "Performance",
];

export default function BrandDashboardPage() {
  const vendorLeads = getVendorInquiries().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const followups = getVendorFollowups();
  const events = getVendorTrainingEvents().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const started = events.filter((e) => e.event === "sample_started");
  const completed = events.filter((e) => e.event === "sample_completed");
  const avgScore = completed.length
    ? Math.round(
        completed.reduce((sum, e) => sum + (typeof e.score === "number" ? e.score : 0), 0) /
          completed.length
      )
    : 0;

  const avgDuration = completed.length
    ? Math.round(
        completed.reduce(
          (sum, e) => sum + (typeof e.durationSec === "number" ? e.durationSec : 0),
          0
        ) / completed.length
      )
    : 0;

  const pendingFollowups = followups.filter((f) => f.status === "pending");
  const nextFollowupByLead = new Map<string, string>();
  for (const f of pendingFollowups) {
    const prev = nextFollowupByLead.get(f.leadId);
    if (!prev || new Date(f.scheduledFor) < new Date(prev)) {
      nextFollowupByLead.set(f.leadId, f.scheduledFor);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold mb-1">
            Weddingful Brand Workspace
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Call Operations Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track call handling quality, sample completion, and follow-up readiness.
          </p>
        </div>

        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-5">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Dashboard Menu</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 text-sm">
              {dashboardNav.map((item, i) => (
                <li key={item}>
                  <button
                    className={`w-full text-left rounded-lg px-3 py-2 transition ${
                      i === 0
                        ? "bg-rose-50 text-rose-700 font-semibold border border-rose-100"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Metric title="Registered Accounts" value={String(vendorLeads.length)} />
              <Metric title="Samples Started" value={String(started.length)} />
              <Metric title="Samples Completed" value={String(completed.length)} />
              <Metric title="Avg Qual Score" value={avgScore ? `${avgScore}/100` : "—"} />
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <section className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Recent Call Activity</h2>
                  <p className="text-xs text-gray-500">Latest sample start/completion events.</p>
                </div>
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Event", "Lead ID", "Score", "Duration", "Time"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {events.slice(0, 25).map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${e.event === "sample_completed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                            {e.event}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{e.leadId}</td>
                        <td className="px-4 py-3 text-gray-700">{e.score ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-700">{typeof e.durationSec === "number" ? `${Math.round(e.durationSec)}s` : "—"}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(e.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Follow-up Queue</h2>
                  <p className="text-xs text-gray-500">Pending outreach generated after registration.</p>
                </div>
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Company", "Contact", "Status", "Next Follow-up", "Created"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {vendorLeads.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{v.company}</td>
                        <td className="px-4 py-3 text-gray-700">{v.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs">
                            {v.status || "new"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {nextFollowupByLead.get(v.id)
                            ? new Date(nextFollowupByLead.get(v.id)!).toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(v.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
              <p>
                <strong>Ops note:</strong> This dashboard is tuned for call-program visibility. As live telephony webhooks are wired,
                these metrics will reflect production calls and SLA performance.
              </p>
              <p className="mt-2">Average completed sample duration: <strong>{avgDuration ? `${avgDuration}s` : "—"}</strong></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{title}</div>
    </div>
  );
}
