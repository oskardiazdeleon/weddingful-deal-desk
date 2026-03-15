import {
  getVendorFollowups,
  getVendorInquiries,
  getVendorTrainingEvents,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default function BrandDashboardPage() {
  const realVendorLeads = getVendorInquiries().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const realFollowups = getVendorFollowups();
  const realEvents = getVendorTrainingEvents().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const demoVendorLeads = [
    {
      id: "demo-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      name: "Sofia Martinez",
      email: "sofia@oceancrestresort.com",
      company: "Ocean Crest Resort",
      vendorType: "Resort",
      message: "Need after-hours inquiry coverage.",
      status: "contacted",
    },
    {
      id: "demo-2",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      name: "Daniel Kim",
      email: "daniel@sunharborweddings.com",
      company: "Sun Harbor Weddings",
      vendorType: "Venue Group",
      message: "Interested in pilot for Cancun + Cabo team.",
      status: "demo_booked",
    },
  ];

  const demoEvents = [
    {
      id: "evt-1",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      leadId: "demo-1",
      event: "sample_started" as const,
      score: 78,
      durationSec: 120,
    },
    {
      id: "evt-2",
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      leadId: "demo-1",
      event: "sample_completed" as const,
      score: 86,
      durationSec: 224,
    },
    {
      id: "evt-3",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      leadId: "demo-2",
      event: "sample_completed" as const,
      score: 82,
      durationSec: 205,
    },
  ];

  const demoFollowups = [
    {
      id: "fup-1",
      leadId: "demo-1",
      email: "sofia@oceancrestresort.com",
      company: "Ocean Crest Resort",
      step: "day2",
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
      status: "pending",
      subject: "Quick follow-up: ready to run your voice concierge demo?",
      createdAt: new Date().toISOString(),
    },
  ];

  const vendorLeads: any[] = realVendorLeads.length ? (realVendorLeads as any[]) : (demoVendorLeads as any[]);
  const followups: any[] = realFollowups.length ? (realFollowups as any[]) : (demoFollowups as any[]);
  const events: any[] = realEvents.length ? (realEvents as any[]) : (demoEvents as any[]);

  const started = events.filter((e: any) => e.event === "sample_started");
  const completed = events.filter((e: any) => e.event === "sample_completed");
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
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Brand Dashboard · Call Operations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor demo call activity, qualification quality, and follow-up readiness.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold">{vendorLeads.length}</div>
            <div className="text-xs text-gray-500">Registered Accounts</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold">{started.length}</div>
            <div className="text-xs text-gray-500">Samples Started</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold">{completed.length}</div>
            <div className="text-xs text-gray-500">Samples Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold">{avgScore || "—"}</div>
            <div className="text-xs text-gray-500">Avg Qualification Score</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Call Activity</h2>
              <p className="text-xs text-gray-500">Latest sample start/completion events from training flow.</p>
            </div>
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Event",
                    "Lead ID",
                    "Score",
                    "Duration",
                    "Time",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.slice(0, 25).map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          e.event === "sample_completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {e.event}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{e.leadId}</td>
                    <td className="px-4 py-3 text-gray-700">{e.score ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {typeof e.durationSec === "number" ? `${Math.round(e.durationSec)}s` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Follow-up Queue</h2>
              <p className="text-xs text-gray-500">Pending outreach tasks generated after registration.</p>
            </div>
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Company",
                    "Contact",
                    "Status",
                    "Next Follow-up",
                    "Created",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium"
                    >
                      {h}
                    </th>
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
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(v.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
          <p>
            <strong>Operations note:</strong> This dashboard is now optimized for call program monitoring. As we
            wire live telephony events, these tables will reflect production call outcomes and SLA performance.
          </p>
          <p className="mt-2">
            Avg completed sample duration: <strong>{avgDuration ? `${avgDuration}s` : "—"}</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
