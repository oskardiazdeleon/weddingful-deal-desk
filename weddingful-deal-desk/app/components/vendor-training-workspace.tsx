"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";

type Line = { speaker: "Caller" | "AI Assistant"; text: string };

type Scenario = {
  id: string;
  title: string;
  level: "Foundational" | "Priority" | "Advanced";
  steps: number;
  duration: string;
  intro: Line[];
  extension: Line[];
};

const scenarios: Scenario[] = [
  {
    id: "new-inquiry",
    title: "New Destination Wedding Inquiry",
    level: "Foundational",
    steps: 8,
    duration: "6-8 min",
    intro: [
      { speaker: "Caller", text: "Hi, we’re planning a destination wedding for May next year." },
      { speaker: "AI Assistant", text: "Amazing — I can help with that. What destination are you considering?" },
      { speaker: "Caller", text: "Cancun, around 80 guests." },
      { speaker: "AI Assistant", text: "Perfect. What budget range should I note for your planning team?" },
      { speaker: "Caller", text: "Roughly 45 thousand." },
      { speaker: "AI Assistant", text: "Got it. I’ll route this to your venue team as high-priority." },
    ],
    extension: [
      { speaker: "AI Assistant", text: "Would you like me to schedule a venue consultation this week?" },
      { speaker: "Caller", text: "Yes, Thursday afternoon works." },
      { speaker: "AI Assistant", text: "Perfect — I captured that and notified your sales coordinator." },
    ],
  },
  {
    id: "date-availability",
    title: "Date Availability + Capacity Check",
    level: "Priority",
    steps: 7,
    duration: "5-7 min",
    intro: [
      { speaker: "Caller", text: "Do you have availability for a 120-guest wedding in November?" },
      { speaker: "AI Assistant", text: "I can check your requested window and gather details for the events team." },
      { speaker: "Caller", text: "Great, we’re flexible by one week." },
      { speaker: "AI Assistant", text: "Noted. Do you prefer beachfront ceremony or ballroom reception setup?" },
    ],
    extension: [
      { speaker: "Caller", text: "Beach ceremony, ballroom dinner." },
      { speaker: "AI Assistant", text: "Great — I’m flagging this as high-fit and routing for same-day follow-up." },
    ],
  },
  {
    id: "vendor-qa",
    title: "Planner Partnership Intake",
    level: "Advanced",
    steps: 9,
    duration: "8-10 min",
    intro: [
      { speaker: "Caller", text: "I’m a planner and want to discuss preferred partner rates." },
      { speaker: "AI Assistant", text: "Happy to help. Which destinations and average guest counts do you specialize in?" },
      { speaker: "Caller", text: "Mexico and Caribbean, mostly 70 to 140 guests." },
      { speaker: "AI Assistant", text: "Perfect. I’ll capture your profile and route to partnerships." },
    ],
    extension: [
      { speaker: "AI Assistant", text: "Would you like a partner onboarding call this week?" },
      { speaker: "Caller", text: "Yes, please send options." },
    ],
  },
];

const tabs = ["Overview", "Training Scenarios", "Live Demo", "Transcript Review", "Program Settings"] as const;

function toneFor(level: Scenario["level"]) {
  if (level === "Foundational") return "bg-emerald-50 text-emerald-700";
  if (level === "Priority") return "bg-amber-50 text-amber-700";
  return "bg-violet-50 text-violet-700";
}

export function VendorTrainingWorkspace({ company, leadId }: { company: string; leadId: string }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Live Demo");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0].id);
  const [live, setLive] = useState(false);
  const [transcript, setTranscript] = useState<Line[]>(scenarios[0].intro);
  const [progress, setProgress] = useState(42);
  const [demoCalls, setDemoCalls] = useState(5);

  const selectedScenario = useMemo(
    () => scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0],
    [selectedScenarioId]
  );

  const score = useMemo(() => Math.min(99, 76 + Math.floor(progress / 8)), [progress]);
  const projectedDays = useMemo(() => Math.max(7, 28 - Math.floor(progress / 4)), [progress]);

  useEffect(() => {
    setTranscript(selectedScenario.intro);
  }, [selectedScenario]);

  useEffect(() => {
    if (!live) return;

    let i = 0;
    const id = setInterval(() => {
      if (i < selectedScenario.extension.length) {
        setTranscript((prev) => [...prev, selectedScenario.extension[i]]);
        i += 1;
        setProgress((p) => Math.min(100, p + 2));
      } else {
        clearInterval(id);
        setLive(false);
        setDemoCalls((c) => c + 1);
        fetch("/api/vendor-training-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId, event: "sample_completed", score, durationSec: 222 }),
        }).catch(() => {});
      }
    }, 1300);

    return () => clearInterval(id);
  }, [live, leadId, score, selectedScenario]);

  async function startScenario(scenario: Scenario) {
    if (live) return;
    setSelectedScenarioId(scenario.id);
    setTranscript(scenario.intro);
    setLive(true);
    try {
      await fetch("/api/vendor-training-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, event: "sample_started" }),
      });
    } catch {}
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] py-8 px-4">
      <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold mb-1">
              Weddingful · Staged Demo Environment
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
              Wedding Program Training Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome, {company}. This is a guided staging workspace (not a production account) so your team can preview workflow outcomes.
            </p>
          </div>
          <Link
            href="/vendors"
            className="hidden sm:inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white"
          >
            Back to Program Overview
          </Link>
        </div>

        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)_330px] gap-4">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Demo Menu</p>
            <ul className="space-y-2 text-sm">
              {tabs.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => setActiveTab(item)}
                    className={`w-full text-left rounded-lg px-3 py-2 transition ${
                      item === activeTab
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

          <section className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-semibold text-gray-900">{company}</p>
                <p className="text-xs text-gray-500">Staged Program · Day 1</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>Training progress</span>
                  <span className="font-semibold text-gray-900">{progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Score {score}/100 · {demoCalls} demos run</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
                <p className="text-xs uppercase tracking-wide text-gray-500">Time to productivity (projected)</p>
                <p className="text-4xl font-semibold text-gray-900 mt-2">{projectedDays}</p>
                <p className="text-sm text-gray-500">days</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Performance trend</p>
                <div className="h-16 w-full rounded-lg bg-gradient-to-r from-rose-100 via-pink-100 to-white relative overflow-hidden">
                  <div className="absolute left-0 right-0 top-8 h-[2px] bg-rose-300" />
                  <div className="absolute left-2 right-2 top-3 h-12 border-l border-b border-rose-400 rounded-bl-2xl" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Last {demoCalls} sessions — trending up</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Training Scenarios</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    live ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {live ? "Running" : "Ready"}
                </span>
              </div>

              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className="rounded-xl border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{scenario.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${toneFor(scenario.level)}`}>
                          {scenario.level}
                        </span>
                        <span>{scenario.steps} steps</span>
                        <span>{scenario.duration}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/vendors/live-demo?lead=${encodeURIComponent(leadId)}&company=${encodeURIComponent(company)}&scenario=${encodeURIComponent(scenario.id)}`}
                        className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700"
                      >
                        Open Live Call Studio
                      </Link>
                      <button
                        onClick={() => startScenario(scenario)}
                        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                        disabled={live}
                      >
                        {selectedScenario.id === scenario.id && live ? "Running…" : "Quick Run"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-500 mb-2">Optional voice widget demo</p>
                <div dangerouslySetInnerHTML={{ __html: '<elevenlabs-convai agent-id="agent_4801kf4jnhneet6tscp3zt0f76er"></elevenlabs-convai>' }} />
              </div>
            </div>
          </section>

          <aside className="space-y-4 h-fit lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Live Transcript</h3>
                <span className="text-xs text-gray-500">{live ? "Live" : "Sample"}</span>
              </div>
              <div className="space-y-2 max-h-[340px] overflow-auto pr-1">
                {transcript.map((line, idx) => (
                  <div key={idx} className={`rounded-lg p-2.5 text-sm ${line.speaker === "AI Assistant" ? "bg-rose-50" : "bg-gray-50"}`}>
                    <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{line.speaker}</p>
                    <p className="text-gray-700">{line.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <h3 className="font-semibold mb-3">Wedding Program Settings (Staged)</h3>
              <div className="space-y-3 text-sm">
                <Setting label="Destination focus" value="Cancun, Riviera Maya, Los Cabos" />
                <Setting label="Budget bands" value="$20k-$40k · $40k-$70k · $70k+" />
                <Setting label="Guest count bands" value="40-80 · 80-120 · 120+" />
                <Setting label="Escalation rule" value="High-intent calls -> same-day sales follow-up" />
                <Setting label="Operating mode" value="Staged preview (non-production)" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-gray-800 mt-1">{value}</p>
    </div>
  );
}
