import type { Metadata } from "next";
import Link from "next/link";
import { getClawwatchSnapshot } from "@/lib/clawwatch";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clawwatch Dashboard | Weddingful",
  description: "Internal monitoring dashboard for agent activity, token usage, cost estimates, and system health.",
  robots: {
    index: false,
    follow: false,
  },
};

const navItems = [
  "Overview",
  "Tokens & Cost",
  "Activity Log",
  "Destinations",
  "Security",
  "Alerts",
  "Feature Requests",
];

export default function ClawwatchPage() {
  const snapshot = getClawwatchSnapshot();
  const maxY = Math.max(...snapshot.usage.map((point) => Math.max(point.input, point.output)), 1);
  const pointsInput = snapshot.usage
    .map((point, index) => `${(index / (snapshot.usage.length - 1 || 1)) * 100},${100 - (point.input / maxY) * 100}`)
    .join(" ");
  const pointsOutput = snapshot.usage
    .map((point, index) => `${(index / (snapshot.usage.length - 1 || 1)) * 100},${100 - (point.output / maxY) * 100}`)
    .join(" ");

  return (
    <main className="min-h-screen bg-[#07090f] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">
        <aside className="w-full border-b border-white/10 bg-[#0c1018] px-5 py-6 lg:min-h-screen lg:w-[260px] lg:border-b-0 lg:border-r">
          <Link href="/admin" className="inline-flex items-center text-sm text-white/60 hover:text-white">
            ← Back to Workspace
          </Link>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.24em] text-white/35">Monitoring</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-orange-300">Clawwatch</h1>
            <p className="mt-2 text-sm text-white/50">Operator visibility for agent activity, runtime health, and cost pressure.</p>
          </div>

          <nav className="mt-8 space-y-2 text-sm">
            {navItems.map((item, index) => (
              <div
                key={item}
                className={`rounded-xl px-4 py-3 ${
                  index === 0
                    ? "bg-orange-500/15 text-orange-200 ring-1 ring-orange-400/30"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p className="font-medium text-white">Task summary</p>
            <div className="mt-3 space-y-2">
              <SummaryLine label="Active" value={String(snapshot.taskSummary.active)} />
              <SummaryLine label="Blocked" value={String(snapshot.taskSummary.blocked)} />
              <SummaryLine label="Completed today" value={String(snapshot.taskSummary.completedToday)} />
              <SummaryLine label="Queue depth" value={String(snapshot.taskSummary.queueDepth)} />
            </div>
          </div>
        </aside>

        <section className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-white/35">Dashboard / Overview</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Agent Operations Overview</h2>
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65">
              Search and drilldowns coming next
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              eyebrow="Tokens processed"
              value={formatCompact(snapshot.headline.totalTokens)}
              detail="24h rolling total"
              accent="orange"
            />
            <MetricCard
              eyebrow="Estimated cost"
              value={`$${snapshot.headline.estimatedCostUsd.toFixed(2)}`}
              detail="Provider estimate"
              accent="green"
              badge="est"
            />
            <MetricCard
              eyebrow="Task throughput"
              value={`${snapshot.headline.taskThroughput.toFixed(1)}k`}
              detail="tokens / hour"
              accent="blue"
            />
            <MetricCard
              eyebrow="System health"
              value={`${snapshot.headline.healthySystems}/${snapshot.headline.totalSystems}`}
              detail="healthy checks"
              accent="violet"
            />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_360px]">
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">Token Usage (24h)</p>
                  <p className="text-xs text-white/45">Input vs output tokens across the active operating window.</p>
                </div>
                <div className="flex gap-4 text-xs text-white/55">
                  <LegendDot color="bg-orange-400" label="Input" />
                  <LegendDot color="bg-sky-400" label="Output" />
                </div>
              </div>

              <div className="mt-6 h-[280px] rounded-2xl border border-white/5 bg-[#0b0f17] p-4">
                <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" preserveAspectRatio="none">
                  {[20, 40, 60, 80].map((line) => (
                    <line key={line} x1="0" y1={line} x2="100" y2={line} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                  ))}
                  <polyline
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={pointsInput}
                  />
                  <polyline
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={pointsOutput}
                  />
                </svg>
              </div>

              <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[11px] text-white/35">
                {snapshot.usage.map((point) => (
                  <div key={point.label}>{point.label}</div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
              <p className="text-sm font-medium text-white">Model Breakdown</p>
              <p className="mt-1 text-xs text-white/45">Estimated share of current workload by model or task lane.</p>
              <div className="mt-6 space-y-5">
                {snapshot.models.map((item) => (
                  <div key={item.model}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="text-white/85">{item.model}</span>
                      <span className="text-white/45">{item.share}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className={`h-2 rounded-full ${item.colorClass}`} style={{ width: `${item.share}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-white/35">{formatCompact(item.tokens)} tokens</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_420px]">
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">Recent Activity</p>
                  <p className="mt-1 text-xs text-white/45">A running timeline of notable operator and runtime events.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/45">
                  live snapshot
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {snapshot.activities.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-[#0c1119] px-4 py-3">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${severityClass(item.severity)}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <span className="text-xs text-white/35">{item.at}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/55">{item.detail}</p>
                    </div>
                    {item.metric ? (
                      <span className="rounded-lg border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-white/45">
                        {item.metric}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
              <p className="text-sm font-medium text-white">Health Checks</p>
              <p className="mt-1 text-xs text-white/45">Quick read on the systems that matter for agentic work.</p>
              <div className="mt-5 space-y-3">
                {snapshot.healthChecks.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/8 bg-[#0c1119] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${healthBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/55">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  eyebrow,
  value,
  detail,
  accent,
  badge,
}: {
  eyebrow: string;
  value: string;
  detail: string;
  accent: "orange" | "green" | "blue" | "violet";
  badge?: string;
}) {
  const accentMap = {
    orange: "from-orange-500/20 to-orange-500/5 text-orange-200",
    green: "from-emerald-500/20 to-emerald-500/5 text-emerald-200",
    blue: "from-sky-500/20 to-sky-500/5 text-sky-200",
    violet: "from-violet-500/20 to-violet-500/5 text-violet-200",
  } as const;

  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${accentMap[accent]} p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)]`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-white/60">{eyebrow}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-sm text-white/45">{detail}</p>
        </div>
        {badge ? <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-white/55">{badge}</span> : null}
      </div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/55">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function severityClass(severity: "info" | "success" | "warning" | "error") {
  return {
    info: "bg-sky-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    error: "bg-rose-400",
  }[severity];
}

function healthBadgeClass(status: "healthy" | "warning" | "degraded") {
  return {
    healthy: "bg-emerald-500/15 text-emerald-200",
    warning: "bg-amber-500/15 text-amber-200",
    degraded: "bg-rose-500/15 text-rose-200",
  }[status];
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
