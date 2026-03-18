import Link from "next/link";
import {
  getVendorFollowups,
  getVendorInquiries,
  getVendorTrainingEvents,
  type VendorInquiry,
} from "@/lib/db";
import AdminSetupWizard from "@/app/components/admin-setup-wizard";

export const dynamic = "force-dynamic";

const navItems = [
  { label: "Overview", id: "overview" },
  { label: "Accounts", id: "accounts" },
  { label: "Provisioning", id: "provisioning" },
  { label: "Scripts", id: "scripts" },
  { label: "Call Ops", id: "call-ops" },
  { label: "Billing", id: "billing" },
  { label: "Audit Log", id: "audit-log" },
];

const setupSteps = [
  {
    step: "Step 1",
    title: "Create brand account",
    detail: "Capture company profile, owner, regions, and operating hours.",
  },
  {
    step: "Step 2",
    title: "Provision Twilio number",
    detail: "Assign country/area code and bind inbound webhook routing.",
  },
  {
    step: "Step 3",
    title: "Configure ElevenLabs agent",
    detail: "Set voice profile, greeting, qualification prompts, and escalation rules.",
  },
  {
    step: "Step 4",
    title: "Run simulation + QA",
    detail: "Validate script output, transcript quality, and lead capture fields.",
  },
  {
    step: "Step 5",
    title: "Activate follow-up automations",
    detail: "Enable day0/day2/day5 outreach and booking-link handoff.",
  },
];

const demoVendors: VendorInquiry[] = [
  {
    id: "demo-a",
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    name: "Sofia Martinez",
    email: "sofia@oceancrest.example",
    company: "Ocean Crest Resort",
    vendorType: "venue",
    message: "Need inbound call handling for destination wedding inquiries.",
    status: "contacted",
  },
  {
    id: "demo-b",
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    name: "Daniel Kim",
    email: "daniel@sunharbor.example",
    company: "Sun Harbor Weddings",
    vendorType: "planner",
    message: "Interested in pilot launch this month.",
    status: "demo_booked",
  },
];

const scriptLibrary = [
  { name: "Inbound Qualification v1", status: "Live", updatedAt: "2h ago" },
  { name: "After-hours Overflow", status: "Draft", updatedAt: "Yesterday" },
  { name: "Luxury Venue Triage", status: "Testing", updatedAt: "3 days ago" },
];

export default function AdminPage() {
  const vendors = getVendorInquiries().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const events = getVendorTrainingEvents().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const followups = getVendorFollowups();

  const queue = (vendors.length ? vendors : demoVendors).slice(0, 12);
  const completed = events.filter((e) => e.event === "sample_completed");
  const started = events.filter((e) => e.event === "sample_started");
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, e) => s + (e.score || 0), 0) / completed.length)
    : 0;
  const avgDurationSec = completed.length
    ? Math.round(completed.reduce((s, e) => s + (e.durationSec || 0), 0) / completed.length)
    : 0;

  const activeNumbers = queue.length;
  const liveAgents = Math.max(1, Math.ceil(activeNumbers * 0.75));

  const pendingFollowups = followups.filter((f) => f.status === "pending").length;
  const contactedCount = queue.filter((v) => v.status === "contacted").length;
  const pilotCount = queue.filter((v) => v.status === "pilot").length;

  const estMrr = queue.length * 699;

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold mb-1">Weddingful Admin</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Platform Control Center</h1>
            <p className="text-sm text-gray-500 mt-1">Guide admins through setup, provisioning, and call-ops readiness.</p>
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
                <li key={item.label}>
                  <a
                    href={`#${item.id}`}
                    className={`block w-full text-left rounded-lg px-3 py-2 transition ${
                      i === 0
                        ? "bg-rose-50 text-rose-700 font-semibold border border-rose-100"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <section className="space-y-5">
            <section id="accounts" className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 scroll-mt-24">
              <Card title="Brand Accounts" value={String(queue.length)} hint="Registered vendor organizations" />
              <Card title="Active Numbers" value={String(activeNumbers)} hint="Twilio numbers provisioned" />
              <Card title="Live Agents" value={String(liveAgents)} hint="ElevenLabs assistants online" />
              <Card
                title="Avg Qual Score"
                value={avgScore ? `${avgScore}/100` : "-"}
                hint={`${completed.length} completed sample sessions`}
              />
            </section>

            <AdminSetupWizard steps={setupSteps} />

            <section id="provisioning" className="rounded-2xl border border-gray-200 bg-white p-5 scroll-mt-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Provisioning Queue</h2>
              <p className="text-sm text-gray-500 mb-4">Operational actions to move accounts from signup to call-ready.</p>
              <div className="grid sm:grid-cols-3 gap-3 text-sm mb-4">
                <HealthItem label="Pending follow-ups" value={String(pendingFollowups)} tone="violet" />
                <HealthItem label="Contacted accounts" value={String(contactedCount)} tone="blue" />
                <HealthItem label="Pilot-ready accounts" value={String(pilotCount)} tone="emerald" />
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700">
                  Assign Numbers in Bulk
                </button>
                <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Trigger QA Simulations
                </button>
              </div>
            </section>

            <section id="scripts" className="rounded-2xl border border-gray-200 bg-white p-5 scroll-mt-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Scripts Workspace</h2>
              <p className="text-sm text-gray-500 mb-4">Track and manage active call flow templates by readiness stage.</p>
              <div className="grid md:grid-cols-3 gap-3">
                {scriptLibrary.map((script) => (
                  <div key={script.name} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-900">{script.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Updated {script.updatedAt}</p>
                    <span
                      className={`inline-block mt-3 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        script.status === "Live"
                          ? "bg-emerald-50 text-emerald-700"
                          : script.status === "Testing"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {script.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section id="call-ops" className="rounded-2xl border border-gray-200 bg-white p-5 scroll-mt-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Call Operations Health</h2>
              <p className="text-sm text-gray-500 mb-4">Quality and throughput metrics from training event telemetry.</p>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <HealthItem label="Sample sessions started" value={String(started.length)} tone="blue" />
                <HealthItem label="Sample sessions completed" value={String(completed.length)} tone="emerald" />
                <HealthItem
                  label="Completion rate"
                  value={started.length ? `${Math.round((completed.length / started.length) * 100)}%` : "—"}
                  tone="violet"
                />
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Avg completed duration: <strong className="text-gray-700">{avgDurationSec ? `${avgDurationSec}s` : "—"}</strong>
              </p>
            </section>

            <section id="billing" className="rounded-2xl border border-gray-200 bg-white p-5 scroll-mt-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing Snapshot</h2>
              <p className="text-sm text-gray-500 mb-4">Interim revenue and utilization estimate while metered billing integration is in progress.</p>
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                <HealthItem label="Estimated MRR" value={`$${estMrr.toLocaleString()}`} tone="emerald" />
                <HealthItem label="Accounts on Growth plan (est.)" value={String(queue.length)} tone="blue" />
                <HealthItem label="Overage-ready accounts" value={String(Math.max(0, queue.length - 3))} tone="violet" />
              </div>
            </section>

            <section id="audit-log" className="rounded-2xl border border-gray-200 bg-white overflow-x-auto scroll-mt-24">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Audit Log</h2>
                  <p className="text-xs text-gray-500">Recent registrations and event activity timeline.</p>
                </div>
                <button className="text-sm font-semibold text-rose-600 hover:underline">Export CSV</button>
              </div>
              <table className="w-full text-sm min-w-[700px] md:min-w-[820px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Timestamp", "Entity", "Action", "Status", "Operator"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {queue.slice(0, 8).map((v) => (
                    <tr key={`acct-${v.id}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(v.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{v.company}</td>
                      <td className="px-4 py-3 text-gray-700">Account registered</td>
                      <td className="px-4 py-3 text-gray-600">{(v.status || "new").replace("_", " ")}</td>
                      <td className="px-4 py-3 text-gray-500">system</td>
                    </tr>
                  ))}
                  {events.slice(0, 8).map((e) => (
                    <tr key={`evt-${e.id}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(e.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{e.leadId}</td>
                      <td className="px-4 py-3 text-gray-700">{e.event.replace("_", " ")}</td>
                      <td className="px-4 py-3 text-gray-600">{e.score ? `${e.score}/100` : "logged"}</td>
                      <td className="px-4 py-3 text-gray-500">voice-agent</td>
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

function HealthItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "emerald" | "violet";
}) {
  const toneClass = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wide font-semibold opacity-80">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
