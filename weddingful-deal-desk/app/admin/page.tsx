import Link from "next/link";
import { getVendorInquiries, getVendorTrainingEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

const navItems = [
  "Overview",
  "Accounts",
  "Provisioning",
  "Scripts",
  "Call Ops",
  "Billing",
  "Audit Log",
];

const demoVendors = [
  {
    id: "demo-a",
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    name: "Sofia Martinez",
    company: "Ocean Crest Resort",
    status: "contacted",
  },
  {
    id: "demo-b",
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    name: "Daniel Kim",
    company: "Sun Harbor Weddings",
    status: "demo_booked",
  },
];

export default function AdminPage() {
  const vendors = getVendorInquiries().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const events = getVendorTrainingEvents().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const completed = events.filter((e) => e.event === "sample_completed");
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, e) => s + (e.score || 0), 0) / completed.length)
    : 0;

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold mb-1">
              Weddingful Admin
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Platform Control Center</h1>
            <p className="text-sm text-gray-500 mt-1">
              Inspiration mock for account provisioning, scripts, and call operations.
            </p>
          </div>
          <Link
            href="/brand/dashboard"
            className="w-full sm:w-auto text-center rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700"
          >
            View Brand Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-5">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Admin Menu</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 text-sm">
              {navItems.map((item, i) => (
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
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card title="Brand Accounts" value={String(vendors.length || demoVendors.length)} hint="Registered vendor organizations" />
              <Card title="Active Numbers" value="12" hint="Twilio numbers provisioned" />
              <Card title="Live Agents" value="9" hint="ElevenLabs assistants online" />
              <Card title="Avg Qual Score" value={avgScore ? `${avgScore}/100` : "-"} hint="Completed sample sessions" />
            </div>

            <div className="grid xl:grid-cols-2 gap-5">
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Quick Provisioning</h2>
                <p className="text-sm text-gray-500 mb-4">One-click setup flow for new brand accounts.</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <Input label="Brand account" value="Ocean Crest Resort" />
                  <Input label="Country" value="US" />
                  <Input label="Voice profile" value="Penny - Premium" />
                  <Input label="Routing mode" value="Sales-first" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700">
                    Provision Number + Agent
                  </button>
                  <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    Dry-run Config
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Script Builder (v1)</h2>
                <p className="text-sm text-gray-500 mb-4">Editable qualification script with guardrails.</p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 space-y-2">
                  <p><strong>Greeting:</strong> "Thanks for calling brand weddings. I can help qualify your event."</p>
                  <p><strong>Capture:</strong> date window, guests, destination, budget, contact details.</p>
                  <p><strong>Escalation:</strong> transfer if intent=high OR event date less than 120 days.</p>
                  <p><strong>Close:</strong> "I have shared this with the venue team. Expect a follow-up shortly."</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-black">
                    Save Draft
                  </button>
                  <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    Run Simulation
                  </button>
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Account Queue</h2>
                  <p className="text-xs text-gray-500">Latest registrations and readiness status.</p>
                </div>
                <button className="text-sm font-semibold text-rose-600 hover:underline">Export CSV</button>
              </div>
              <table className="w-full text-sm min-w-[640px] md:min-w-[760px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Company", "Contact", "Stage", "Provisioning", "Last Activity"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(vendors.length ? vendors : demoVendors).slice(0, 8).map((v: any) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{v.company}</td>
                      <td className="px-4 py-3 text-gray-700">{v.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          {(v.status || "new").replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{Math.random() > 0.5 ? "Ready" : "Pending"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(v.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

function Card({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{hint}</p>
    </div>
  );
}

function Input({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800">{value}</div>
    </div>
  );
}
