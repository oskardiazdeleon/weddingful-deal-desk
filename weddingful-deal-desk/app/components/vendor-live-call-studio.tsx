"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

type CoachingItem = {
  title: string;
  detail: string;
};

type ScenarioConfig = {
  name: string;
  subtitle: string;
  coaching: CoachingItem[];
  openingPrompt: string;
  systemPrompt: string;
};

type Snapshot = {
  id: string;
  createdAt: string;
  leadId: string;
  scenario: string;
  score: number;
  transcript: string[];
};

const ElevenLabsConvai = "elevenlabs-convai" as any;
const DEFAULT_AGENT_ID = "agent_4801kf4jnhneet6tscp3zt0f76er";

const scenarioMap: Record<string, ScenarioConfig> = {
  "new-inquiry": {
    name: "New Destination Wedding Inquiry",
    subtitle: "Staged Live Call · Qualification Flow",
    openingPrompt:
      "Thanks for calling Weddingful. I can help explore destination wedding options and capture details for your planning team.",
    systemPrompt:
      "Role: Weddingful Voice Concierge. Capture destination, date window, guest count, budget band, and preferred follow-up channel.",
    coaching: [
      { title: "Open with confidence", detail: "Confirm destination + event type in the first 30 seconds." },
      { title: "Capture decision data", detail: "Collect date window, guest count, and budget before routing." },
      { title: "Set next step", detail: "Offer consultation options and confirm contact preference." },
      { title: "Close with summary", detail: "Repeat details back to reduce handoff errors." },
    ],
  },
  "date-availability": {
    name: "Date Availability + Capacity Check",
    subtitle: "Staged Live Call · Availability Qualification",
    openingPrompt: "I can help check date and capacity fit. Let me capture your preferred window and guest count.",
    systemPrompt:
      "Role: Weddingful Availability Concierge. Capture fixed/flexible date, guest count range, destination, ceremony/reception setup.",
    coaching: [
      { title: "Clarify flexibility", detail: "Confirm alternate dates vs fixed date." },
      { title: "Validate party size", detail: "Capture min/max guest count." },
      { title: "Identify venue fit", detail: "Ask ceremony + reception preference." },
      { title: "Route correctly", detail: "Escalate high-fit inquiries for same-day follow-up." },
    ],
  },
  "vendor-qa": {
    name: "Planner Partnership Intake",
    subtitle: "Staged Live Call · Partner Program Intake",
    openingPrompt: "Happy to help with partner intake. I’ll gather your destination focus and event profile.",
    systemPrompt:
      "Role: Weddingful Partner Intake Concierge. Capture planner market focus, average event size, budget tier, onboarding readiness.",
    coaching: [
      { title: "Profile the partner", detail: "Capture specialty and event volume." },
      { title: "Market focus", detail: "Confirm destinations and budget tiers." },
      { title: "Program alignment", detail: "Check readiness for staged workflow." },
      { title: "Next action", detail: "Offer onboarding call windows." },
    ],
  },
};

const callerReplies = [
  "Hi! We’re targeting a beach wedding in Cancun next spring.",
  "We’re expecting around 90 guests and want options with weekend availability.",
  "Budget is likely between 40k and 60k, depending on package details.",
  "Can we schedule a consultation this week?",
];

export function VendorLiveCallStudio({ company, leadId, scenario }: { company: string; leadId: string; scenario: string }) {
  const config = useMemo(() => scenarioMap[scenario] || scenarioMap["new-inquiry"], [scenario]);

  const [transcript, setTranscript] = useState<{ speaker: string; text: string }[]>([]);
  const [replyIndex, setReplyIndex] = useState(0);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState("");
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    setTranscript([
      { speaker: "AI Assistant", text: "Connected. Weddingful staged call environment is active." },
      { speaker: "AI Assistant", text: config.openingPrompt },
      { speaker: "System", text: `Scenario prompt loaded: ${config.systemPrompt}` },
    ]);
  }, [config]);

  async function refreshSnapshots() {
    if (!leadId) return;
    try {
      const res = await fetch(`/api/vendor-demo-summary?leadId=${encodeURIComponent(leadId)}`);
      if (!res.ok) return;
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch {}
  }

  useEffect(() => {
    refreshSnapshots();
  }, [leadId]);

  const score = useMemo(() => {
    const captured = transcript.filter((x) => x.speaker === "Caller").length;
    return Math.min(98, 72 + captured * 6);
  }, [transcript]);

  const transcriptLines = useMemo(() => transcript.map((line) => `${line.speaker}: ${line.text}`), [transcript]);

  async function saveSnapshot(sendEmailToLead = false) {
    if (!leadId) {
      setSaveMsg("Missing lead id for saving.");
      return;
    }

    if (sendEmailToLead) {
      setSending(true);
      setSendMsg("");
    } else {
      setSaving(true);
      setSaveMsg("");
    }

    try {
      const res = await fetch("/api/vendor-demo-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          scenario: config.name,
          score,
          transcript: transcriptLines,
          sendEmailToLead,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "save_failed");

      await refreshSnapshots();

      if (sendEmailToLead) {
        setSendMsg(data?.email?.ok ? "Demo summary emailed to lead." : `Saved, but email failed: ${data?.email?.reason || "unknown"}`);
      } else {
        setSaveMsg("Snapshot saved.");
      }
    } catch (e: any) {
      const msg = e?.message || "Request failed";
      if (sendEmailToLead) setSendMsg(msg);
      else setSaveMsg(msg);
    } finally {
      setSaving(false);
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-6">
      <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" onLoad={() => setWidgetReady(true)} />
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500 font-semibold">Weddingful · Live Call Studio</p>
            <h1 className="text-2xl font-semibold text-gray-900">{config.name}</h1>
            <p className="text-sm text-gray-500">{config.subtitle} · {company}</p>
          </div>
          <Link href={`/vendors/training-dashboard?lead=${encodeURIComponent(leadId)}`} className="text-sm font-semibold text-gray-700 hover:text-rose-600">
            ← Back
          </Link>
        </div>

        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-4">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Call Plan</p>
            <div className="space-y-2 mb-4">
              {config.coaching.map((item, idx) => (
                <div key={item.title} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide font-semibold text-rose-600 mb-1">Step {idx + 1}</p>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-[11px] uppercase tracking-wide font-semibold text-blue-700 mb-1">Scenario Prompt</p>
              <p className="text-xs text-blue-900">{config.systemPrompt}</p>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Voice Agent Session</h2>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${widgetReady ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {widgetReady ? "ElevenLabs connected" : "Connecting ElevenLabs..."}
                </span>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <ElevenLabsConvai agent-id={DEFAULT_AGENT_ID} />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                If the inline widget doesn’t render immediately, use the floating call bubble at the bottom-right.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const next = callerReplies[replyIndex % callerReplies.length];
                    setTranscript((prev) => [...prev, { speaker: "Caller", text: next }]);
                    setReplyIndex((i) => i + 1);
                  }}
                  className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700"
                >
                  Simulate Caller
                </button>
                <button
                  onClick={() => setTranscript((prev) => [...prev, { speaker: "AI Assistant", text: "Thanks — I captured that and routed your request for same-day follow-up." }])}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Simulate AI Reply
                </button>
                <button
                  onClick={() => saveSnapshot(false)}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Snapshot"}
                </button>
                <button
                  onClick={() => saveSnapshot(true)}
                  className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700 disabled:opacity-60"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Email Summary"}
                </button>
                <Link href={`/vendors/demo-summary?lead=${encodeURIComponent(leadId)}&company=${encodeURIComponent(company)}`} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Export PDF
                </Link>
              </div>
              {saveMsg ? <p className="text-xs text-gray-500 mt-2">{saveMsg}</p> : null}
              {sendMsg ? <p className="text-xs text-gray-500 mt-1">{sendMsg}</p> : null}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Live Transcript</h3>
                <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
                  {transcript.map((line, idx) => (
                    <div key={`${line.speaker}-${idx}`} className={`rounded-lg p-2.5 text-sm ${line.speaker === "AI Assistant" ? "bg-rose-50" : line.speaker === "System" ? "bg-blue-50" : "bg-gray-50"}`}>
                      <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{line.speaker}</p>
                      <p className="text-gray-700">{line.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Session Metrics</h3>
                <p className="text-sm text-gray-600">Current score</p>
                <p className="text-3xl font-semibold text-gray-900 mb-3">{score}/100</p>
                <p className="text-sm text-gray-600 mb-2">Saved snapshots</p>
                <div className="space-y-2 max-h-[180px] overflow-auto pr-1">
                  {snapshots.length === 0 ? (
                    <p className="text-sm text-gray-500">No snapshots yet.</p>
                  ) : (
                    snapshots.map((s) => (
                      <div key={s.id} className="rounded-md bg-gray-50 p-2">
                        <p className="text-xs font-semibold text-gray-700">{s.scenario}</p>
                        <p className="text-xs text-gray-500">{s.score}/100 · {new Date(s.createdAt).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
