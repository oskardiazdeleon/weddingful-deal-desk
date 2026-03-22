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

const DEFAULT_AGENT_ID = "agent_4801kf4jnhneet6tscp3zt0f76er";

const scenarioMap: Record<string, ScenarioConfig> = {
  "new-inquiry": {
    name: "New Destination Wedding Inquiry",
    subtitle: "Staged Live Call · Qualification Flow",
    openingPrompt:
      "Thanks for calling Weddingful. I can help you explore destination wedding options and capture details for your planning team.",
    systemPrompt:
      "Role: Weddingful Voice Concierge. Objective: qualify new destination wedding inquiries. Required fields: destination, date window, guest count, budget band, contact preference. Tone: warm, professional, concise. End call by confirming follow-up SLA and next step.",
    coaching: [
      {
        title: "Open with confidence",
        detail: "Confirm destination interest and event type in the first 30 seconds.",
      },
      {
        title: "Capture decision data",
        detail: "Collect date window, guest count, and budget range before routing.",
      },
      {
        title: "Set next step",
        detail: "Offer a consultation slot and confirm preferred contact channel.",
      },
      {
        title: "Close with summary",
        detail: "Repeat key details back to reduce handoff errors.",
      },
    ],
  },
  "date-availability": {
    name: "Date Availability + Capacity Check",
    subtitle: "Staged Live Call · Availability Qualification",
    openingPrompt:
      "I can help check date and capacity fit. Let me capture your preferred window and guest count.",
    systemPrompt:
      "Role: Weddingful Availability Concierge. Objective: capture availability constraints and venue fit signals. Required fields: fixed/flexible date, guest count range, ceremony/reception preference, destination. Escalate high-fit requests for same-day follow-up.",
    coaching: [
      { title: "Clarify flexibility", detail: "Confirm if couple has alternate dates or only one fixed date." },
      { title: "Validate party size", detail: "Capture minimum and maximum expected guest count." },
      { title: "Identify venue fit", detail: "Ask ceremony + reception setup preference." },
      { title: "Route correctly", detail: "Escalate high-fit inquiries for same-day sales follow-up." },
    ],
  },
  "vendor-qa": {
    name: "Planner Partnership Intake",
    subtitle: "Staged Live Call · Partner Program Intake",
    openingPrompt:
      "Happy to help with partner intake. I’ll gather your destination focus and event profile for our partnership team.",
    systemPrompt:
      "Role: Weddingful Partner Intake Concierge. Objective: qualify planner/vendor partnership inquiries. Required fields: market focus, average event size, budget tier, partnership intent, preferred onboarding date. Route qualified profiles to partner onboarding queue.",
    coaching: [
      { title: "Profile the partner", detail: "Capture planner/company specialty and typical wedding volume." },
      { title: "Market focus", detail: "Confirm destinations and target budget bands they serve." },
      { title: "Program alignment", detail: "Check readiness for pilot workflow and data handoff requirements." },
      { title: "Next action", detail: "Offer onboarding call windows and confirm preferred follow-up." },
    ],
  },
};

const callerReplies = [
  "Hi! We’re targeting a beach wedding in Cancun next spring.",
  "We’re expecting around 90 guests and want options with weekend availability.",
  "Budget is likely between 40k and 60k, depending on package details.",
  "Can we schedule a consultation this week?",
];

export function VendorLiveCallStudio({
  company,
  leadId,
  scenario,
}: {
  company: string;
  leadId: string;
  scenario: string;
}) {
  const config = useMemo(() => scenarioMap[scenario] || scenarioMap["new-inquiry"], [scenario]);

  const [transcript, setTranscript] = useState<{ speaker: string; text: string }[]>([]);
  const [replyIndex, setReplyIndex] = useState(0);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState("");

  useEffect(() => {
    setTranscript([
      { speaker: "AI Assistant", text: "Connected. Weddingful staged call environment is active." },
      { speaker: "AI Assistant", text: config.openingPrompt },
      {
        speaker: "System",
        text: `Scenario prompt loaded: ${config.systemPrompt}`,
      },
    ]);
  }, [config]);

  async function refreshSnapshots() {
    if (!leadId) return;
    try {
      const res = await fetch(`/api/vendor-demo-summary?leadId=${encodeURIComponent(leadId)}`);
      if (!res.ok) return;
      const data = await res.json();
      setSnapshots(data.snapshots || []);
    } catch {
      // noop
    }
  }

  useEffect(() => {
    refreshSnapshots();
  }, [leadId]);

  const score = useMemo(() => {
    const captured = transcript.filter((x) => x.speaker === "Caller").length;
    return Math.min(98, 72 + captured * 6);
  }, [transcript]);

  const transcriptLines = useMemo(
    () => transcript.map((line) => `${line.speaker}: ${line.text}`),
    [transcript]
  );

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
        if (data?.email?.ok) {
          setSendMsg("Demo summary emailed to lead successfully.");
        } else {
          setSendMsg(`Summary saved, but email failed: ${data?.email?.reason || "unknown"}`);
        }
      } else {
        setSaveMsg("Snapshot saved to dashboard.");
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
    <main className="min-h-screen bg-[#f6f6f7] px-4 py-6">
      <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500 font-semibold">Weddingful · Live Call Studio</p>
            <h1 className="text-2xl font-semibold text-gray-900">{config.name}</h1>
            <p className="text-sm text-gray-500">
              {config.subtitle} · {company} · Lead {leadId || "demo"}
            </p>
          </div>
          <Link
            href={`/vendors/training-dashboard?lead=${encodeURIComponent(leadId)}`}
            className="text-sm font-semibold text-gray-700 hover:text-rose-600"
          >
            ← Back to Presentation
          </Link>
        </div>

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-4">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Live Coaching</p>
            <div className="space-y-3 mb-4">
              {config.coaching.map((item, idx) => (
                <div key={item.title} className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                  <p className="text-xs font-semibold text-rose-600 mb-1">Step {idx + 1}</p>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-gray-200 p-3 bg-rose-50">
              <p className="text-xs uppercase tracking-wide text-rose-700 font-semibold mb-1">Scenario prompt loaded</p>
              <p className="text-sm text-gray-700">{config.systemPrompt}</p>
            </div>
          </aside>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-center text-center min-h-[560px]">
            <div className="h-20 w-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mb-4">🎙</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">AI Wedding Concierge</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
              Connect to the ElevenLabs wedding voice agent. This is a staged prototype for demonstrating live inquiry handling.
            </p>
            <div className="w-full max-w-md rounded-xl border border-gray-200 p-3 bg-gray-50 mb-4">
              <div dangerouslySetInnerHTML={{ __html: `<elevenlabs-convai agent-id="${DEFAULT_AGENT_ID}"></elevenlabs-convai>` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  const next = callerReplies[replyIndex % callerReplies.length];
                  setTranscript((prev) => [...prev, { speaker: "Caller", text: next }]);
                  setReplyIndex((i) => i + 1);
                }}
                className="rounded-full bg-rose-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-rose-700"
              >
                Simulate Caller Reply
              </button>
              <button
                onClick={() => setTranscript((prev) => [...prev, { speaker: "AI Assistant", text: "Thanks, I’ve captured that and routed your request to the wedding sales desk for same-day follow-up." }])}
                className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Simulate AI Response
              </button>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => saveSnapshot(false)}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Snapshot"}
              </button>
              <button
                onClick={() => saveSnapshot(true)}
                className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700 disabled:opacity-60"
                disabled={sending}
              >
                {sending ? "Sending…" : "Email Demo Summary"}
              </button>
              <Link
                href={`/vendors/demo-summary?lead=${encodeURIComponent(leadId)}&company=${encodeURIComponent(company)}`}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Export PDF Summary
              </Link>
            </div>
            {saveMsg ? <p className="text-xs text-gray-500 mt-2">{saveMsg}</p> : null}
            {sendMsg ? <p className="text-xs text-gray-500 mt-1">{sendMsg}</p> : null}
          </section>

          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit">
            <h3 className="font-semibold text-gray-900 mb-3">Live Transcript</h3>
            <div className="space-y-2 max-h-[300px] overflow-auto pr-1 mb-3">
              {transcript.map((line, idx) => (
                <div
                  key={`${line.speaker}-${idx}`}
                  className={`rounded-lg p-2.5 text-sm ${line.speaker === "AI Assistant" ? "bg-rose-50" : line.speaker === "System" ? "bg-blue-50" : "bg-gray-50"}`}
                >
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{line.speaker}</p>
                  <p className="text-gray-700">{line.text}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Current score</p>
              <p className="text-2xl font-semibold text-gray-900">{score}/100</p>
            </div>

            <div className="mt-3 rounded-lg border border-gray-200 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Saved snapshots (lead dashboard)</p>
              <div className="space-y-2 max-h-[150px] overflow-auto pr-1">
                {snapshots.length === 0 ? (
                  <p className="text-sm text-gray-500">No snapshots saved yet.</p>
                ) : (
                  snapshots.map((s) => (
                    <div key={s.id} className="rounded-md bg-gray-50 p-2">
                      <p className="text-xs font-semibold text-gray-700">{s.scenario}</p>
                      <p className="text-xs text-gray-500">Score {s.score}/100 · {new Date(s.createdAt).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
