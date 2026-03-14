"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";

type Line = { speaker: "Caller" | "AI Assistant"; text: string };

const baseTranscript: Line[] = [
  { speaker: "Caller", text: "Hi, we’re planning a destination wedding for May next year." },
  { speaker: "AI Assistant", text: "Amazing — I can help with that. What destination are you considering?" },
  { speaker: "Caller", text: "Cancun, around 80 guests." },
  { speaker: "AI Assistant", text: "Perfect. What budget range should I note for your planning team?" },
  { speaker: "Caller", text: "Roughly 45 thousand." },
  { speaker: "AI Assistant", text: "Got it. I’ll route this to your venue team as high-priority." },
];

const demoExtension: Line[] = [
  { speaker: "AI Assistant", text: "Would you like me to schedule a venue consultation this week?" },
  { speaker: "Caller", text: "Yes, Thursday afternoon works." },
  { speaker: "AI Assistant", text: "Perfect — I captured that and notified your sales coordinator." },
];

const tabs = [
  "Overview",
  "Training Scenarios",
  "Live Demo",
  "Transcript Review",
  "Team Performance",
  "Settings",
] as const;

export function VendorTrainingWorkspace({ company, leadId }: { company: string; leadId: string }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Live Demo");
  const [live, setLive] = useState(false);
  const [transcript, setTranscript] = useState<Line[]>(baseTranscript);
  const [progress, setProgress] = useState(35);
  const [demoCalls, setDemoCalls] = useState(4);

  useEffect(() => {
    if (!live) return;
    let i = 0;
    const id = setInterval(() => {
      if (i < demoExtension.length) {
        setTranscript((prev) => [...prev, demoExtension[i]]);
        i += 1;
        setProgress((p) => Math.min(100, p + 3));
      } else {
        clearInterval(id);
        setLive(false);
        setDemoCalls((c) => c + 1);
        fetch('/api/vendor-training-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId, event: 'sample_completed', score, durationSec: 222 }),
        }).catch(() => {});
      }
    }, 1600);
    return () => clearInterval(id);
  }, [live]);

  const score = useMemo(() => Math.min(99, 78 + Math.floor(progress / 10)), [progress]);

  return (
    <main className="min-h-screen bg-[#f7f7f7] py-8 px-4">
      <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold mb-1">Weddingful · Demo Training</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">Voice Concierge Training Workspace</h1>
          <p className="text-gray-500 mt-1">Welcome, {company}. Practice real call scenarios and train your team faster.</p>
        </div>

        <div className="grid lg:grid-cols-[240px_minmax(0,1fr)_340px] gap-4">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Training Menu</p>
            <ul className="space-y-2 text-sm">
              {tabs.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => setActiveTab(item)}
                    className={`w-full text-left rounded-lg px-3 py-2 transition ${
                      item === activeTab ? "bg-rose-50 text-rose-700 font-semibold border border-rose-100" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase">Onboarding</p>
              <p className="text-xl font-semibold mt-1">{progress}%</p>
              <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${progress}%` }} /></div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{activeTab}</p>
                  <h2 className="text-xl font-semibold">Scenario: New Wedding Inquiry</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${live ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {live ? "Running" : "Ready"}
                </span>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-8 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-3xl mb-4">☎</div>
                <p className="text-sm text-gray-500 mb-4">Run a simulated call to test qualification flow and escalation behavior.</p>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <button
                    onClick={async () => {
                      if (live) return;
                      setTranscript(baseTranscript);
                      setLive(true);
                      try {
                        await fetch('/api/vendor-training-event', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ leadId, event: 'sample_started' }),
                        });
                      } catch {}
                    }}
                    className="rounded-full bg-rose-600 text-white px-5 py-2.5 font-semibold hover:bg-rose-700 disabled:opacity-60"
                    disabled={live}
                  >
                    {live ? "Demo Running…" : "Launch Live Demo"}
                  </button>
                </div>
                <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-xs text-gray-500 mb-2">Try Penny (ElevenLabs agent)</p>
                  <div dangerouslySetInnerHTML={{ __html: '<elevenlabs-convai agent-id="agent_4801kf4jnhneet6tscp3zt0f76er"></elevenlabs-convai>' }} />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4"><p className="text-xs uppercase text-gray-500">Qualification score</p><p className="text-2xl font-semibold mt-1">{score} / 100</p></div>
              <div className="rounded-xl border border-gray-200 bg-white p-4"><p className="text-xs uppercase text-gray-500">Demo calls completed</p><p className="text-2xl font-semibold mt-1">{demoCalls}</p></div>
              <div className="rounded-xl border border-gray-200 bg-white p-4"><p className="text-xs uppercase text-gray-500">Avg call duration</p><p className="text-2xl font-semibold mt-1">3m 42s</p></div>
            </div>
          </section>

          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Live Transcript</h3><span className="text-xs text-gray-500">{live ? "Live" : "Sample"}</span></div>
            <div className="space-y-2 max-h-[470px] overflow-auto pr-1">
              {transcript.map((line, idx) => (
                <div key={idx} className={`rounded-lg p-2.5 text-sm ${line.speaker === "AI Assistant" ? "bg-rose-50" : "bg-gray-50"}`}>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{line.speaker}</p>
                  <p className="text-gray-700">{line.text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/brand/dashboard" className="rounded-full bg-rose-600 text-white px-5 py-2.5 font-semibold hover:bg-rose-700">Open Lead Intelligence</Link>
          <Link href="/vendors" className="rounded-full border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-white">Return to Vendor Page</Link>
        </div>
      </div>
    </main>
  );
}
