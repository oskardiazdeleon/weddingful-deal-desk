"use client";

import Link from "next/link";
import Script from "next/script";
import { useMemo, useState } from "react";

type CoachingItem = {
  title: string;
  detail: string;
};

type ScenarioConfig = {
  name: string;
  subtitle: string;
  coaching: CoachingItem[];
  openingPrompt: string;
};

const DEFAULT_AGENT_ID = "agent_4801kf4jnhneet6tscp3zt0f76er";

const scenarioMap: Record<string, ScenarioConfig> = {
  "new-inquiry": {
    name: "New Destination Wedding Inquiry",
    subtitle: "Staged Live Call · Qualification Flow",
    openingPrompt:
      "Thanks for calling. I can help you explore destination wedding options and capture details for your planning team.",
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
    coaching: [
      { title: "Profile the partner", detail: "Capture planner/company specialty and typical wedding volume." },
      { title: "Market focus", detail: "Confirm destinations and target budget bands they serve." },
      { title: "Program alignment", detail: "Check readiness for pilot workflow and data handoff requirements." },
      { title: "Next action", detail: "Offer onboarding call windows and confirm preferred follow-up." },
    ],
  },
};

const baseTranscript = [
  { speaker: "AI Assistant", text: "Connected. Weddingful staged call environment is now active." },
  { speaker: "AI Assistant", text: "When you are ready, start with your greeting and qualification opener." },
];

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
  const [transcript, setTranscript] = useState<{ speaker: string; text: string }[]>([
    ...baseTranscript,
    { speaker: "AI Assistant", text: config.openingPrompt },
  ]);
  const [replyIndex, setReplyIndex] = useState(0);

  return (
    <main className="min-h-screen bg-[#f6f6f7] px-4 py-6">
      <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500 font-semibold">Weddingful · Live Call Studio</p>
            <h1 className="text-2xl font-semibold text-gray-900">{config.name}</h1>
            <p className="text-sm text-gray-500">{config.subtitle} · {company} · Lead {leadId || "demo"}</p>
          </div>
          <Link href={`/vendors/training-dashboard?lead=${encodeURIComponent(leadId)}`} className="text-sm font-semibold text-gray-700 hover:text-rose-600">
            ← Back to Presentation
          </Link>
        </div>

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-4">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Live Coaching</p>
            <div className="space-y-3">
              {config.coaching.map((item, idx) => (
                <div key={item.title} className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                  <p className="text-xs font-semibold text-rose-600 mb-1">Step {idx + 1}</p>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-center text-center min-h-[560px]">
            <div className="h-20 w-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mb-4">🎙</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">AI Wedding Concierge</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
              Click below to connect to the ElevenLabs voice agent. This is a staged prototype for live call demonstration.
            </p>
            <div className="w-full max-w-md rounded-xl border border-gray-200 p-3 bg-gray-50 mb-4">
              <div dangerouslySetInnerHTML={{ __html: `<elevenlabs-convai agent-id="${DEFAULT_AGENT_ID}"></elevenlabs-convai>` }} />
            </div>
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
          </section>

          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit">
            <h3 className="font-semibold text-gray-900 mb-3">Live Transcript</h3>
            <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
              {transcript.map((line, idx) => (
                <div key={`${line.speaker}-${idx}`} className={`rounded-lg p-2.5 text-sm ${line.speaker === "AI Assistant" ? "bg-rose-50" : "bg-gray-50"}`}>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{line.speaker}</p>
                  <p className="text-gray-700">{line.text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
