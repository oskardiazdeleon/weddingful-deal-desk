"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CoachingItem = { title: string; detail: string };
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
  "availability-check": {
    name: "Availability Date Check",
    subtitle: "Wedding inquiry intake",
    openingPrompt: "Thanks for calling Weddingful. I can check date availability and capture event fit.",
    systemPrompt: "Capture date flexibility, guest count, destination, event format, and urgency.",
    coaching: [
      { title: "Date window", detail: "Fixed date or flexible range" },
      { title: "Guest profile", detail: "Expected guest count and format" },
      { title: "Destination fit", detail: "Preferred location/property" },
      { title: "Next step", detail: "Confirm follow-up SLA" },
    ],
  },
  "insurance-policy": {
    name: "Insurance Policy Questions",
    subtitle: "Coverage clarification",
    openingPrompt: "I can capture your policy questions and route to a specialist.",
    systemPrompt: "Tag risk type: weather/cancellation/vendor/travel, then route with context.",
    coaching: [
      { title: "Risk type", detail: "What exact concern they have" },
      { title: "Coverage context", detail: "Booking stage + date window" },
      { title: "Urgency", detail: "Decision deadline" },
      { title: "Handoff", detail: "Policy specialist follow-up" },
    ],
  },
  "accommodation-upgrade": {
    name: "Accommodation Upgrade Request",
    subtitle: "Post-booking optimization",
    openingPrompt: "I can help capture your upgrade request and route it to accommodations.",
    systemPrompt: "Capture current package, desired upgrade, quantity, budget sensitivity.",
    coaching: [
      { title: "Current booking", detail: "Existing package/tier" },
      { title: "Desired upgrade", detail: "Room type and count" },
      { title: "Constraints", detail: "Budget + alternatives" },
      { title: "Owner", detail: "Assign follow-up desk" },
    ],
  },
  "new-inquiry": {
    name: "New Destination Inquiry",
    subtitle: "Full lead qualification",
    openingPrompt: "I can help with destination options and capture your event profile.",
    systemPrompt: "Capture destination, date window, guest count, budget band, preferred contact channel.",
    coaching: [
      { title: "Intent", detail: "Destination and event type" },
      { title: "Core qualifiers", detail: "Date / guests / budget" },
      { title: "Prioritization", detail: "Urgency + readiness" },
      { title: "Close", detail: "Next action + confirmation" },
    ],
  },
};

function formatError(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function VendorLiveCallStudio({
  company,
  leadId,
  scenario,
  buildVersion,
}: {
  company: string;
  leadId: string;
  scenario: string;
  buildVersion: string;
}) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenario in scenarioMap ? scenario : "new-inquiry");
  const config = useMemo(() => scenarioMap[activeScenarioId] || scenarioMap["new-inquiry"], [activeScenarioId]);

  const [transcript, setTranscript] = useState<{ speaker: string; text: string }[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState("");
  const [callStarting, setCallStarting] = useState(false);
  const [callMsg, setCallMsg] = useState("");
  const [signedCallUrl, setSignedCallUrl] = useState("");

  useEffect(() => {
    setTranscript([
      { speaker: "AI Assistant", text: "Session prep complete." },
      { speaker: "AI Assistant", text: config.openingPrompt },
      { speaker: "System", text: `Prompt: ${config.systemPrompt}` },
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

  const score = useMemo(() => Math.min(98, 72 + transcript.filter((x) => x.speaker === "Caller").length * 6), [transcript]);
  const transcriptLines = useMemo(() => transcript.map((line) => `${line.speaker}: ${line.text}`), [transcript]);

  async function startCall() {
    setCallStarting(true);
    setCallMsg("");
    setSignedCallUrl("");

    try {
      const sessionRes = await fetch("/api/elevenlabs/start-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: activeScenarioId, leadId, company, agentId: DEFAULT_AGENT_ID }),
      });

      const sessionData = await sessionRes.json().catch(() => ({}));
      if (!sessionRes.ok) throw new Error(formatError(sessionData?.error || sessionData || "Could not initialize session"));

      const signedUrl = sessionData?.signedUrl;
      if (!signedUrl || typeof signedUrl !== "string") throw new Error("No signed session URL returned from ElevenLabs API.");

      setSignedCallUrl(signedUrl);
      setCallMsg("Session ready. Open secure call in a clean call window.");
    } catch (e) {
      setCallMsg(`Unable to start call: ${formatError(e)}`);
    } finally {
      setCallStarting(false);
    }
  }

  async function saveSnapshot() {
    if (!leadId) return setSendMsg("Missing lead id for saving.");
    setSending(true);
    setSendMsg("");

    try {
      const res = await fetch("/api/vendor-demo-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, scenario: config.name, score, transcript: transcriptLines, sendEmailToLead: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "save_failed");
      await refreshSnapshots();
      setSendMsg(data?.email?.ok ? "Summary emailed." : `Saved, but email failed: ${data?.email?.reason || "unknown"}`);
    } catch (e) {
      setSendMsg(formatError(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-3 py-4 sm:px-4 sm:py-6">
      <div className="max-w-[1500px] mx-auto">
        <div className="mb-3 rounded-xl border border-gray-200 bg-white p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold">Weddingful · Live Call Studio</p>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{config.name}</h1>
              <p className="text-xs sm:text-sm text-gray-500">{config.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-gray-500">Workspace</p>
              <p className="text-sm font-semibold text-gray-800">{company || "Demo"}</p>
              <p className="text-[11px] text-gray-500 mt-1">Build: {buildVersion}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={`/vendors/training-dashboard?lead=${encodeURIComponent(leadId)}`} className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Training Dashboard</Link>
            <Link href={`/vendors/demo-summary?lead=${encodeURIComponent(leadId)}&company=${encodeURIComponent(company)}`} className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Demo Summary</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_320px] gap-3">
          <aside className="rounded-xl border border-gray-200 bg-white p-3 h-fit">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Scenarios</p>
            <div className="space-y-2 mb-3">
              {Object.entries(scenarioMap).map(([id, s]) => (
                <button
                  key={id}
                  onClick={() => setActiveScenarioId(id)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm ${
                    activeScenarioId === id
                      ? "bg-rose-50 border border-rose-200 text-rose-700 font-semibold"
                      : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Live Coaching</p>
            <div className="space-y-2">
              {config.coaching.map((item, idx) => (
                <div key={item.title} className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                  <p className="text-[11px] uppercase tracking-wide font-semibold text-rose-600 mb-1">Step {idx + 1}</p>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col items-center justify-center min-h-[620px] text-center">
            <div className="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center text-3xl mb-4">🎙️</div>
            <p className="text-lg font-semibold text-gray-900">AI Wedding Concierge</p>
            <p className="text-sm text-gray-500 mb-4">Voice session for {config.name}</p>

            <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
              <p className="text-sm text-gray-600">Start call to generate a secure ElevenLabs session URL.</p>
              {signedCallUrl ? (
                <a href={signedCallUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded-full bg-rose-600 text-white px-5 py-2 text-sm font-semibold hover:bg-rose-700">
                  Open Secure Call
                </a>
              ) : null}
            </div>

            <button onClick={startCall} disabled={callStarting} className="rounded-full bg-rose-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-rose-700 disabled:opacity-50">
              {callStarting ? "Starting call..." : signedCallUrl ? "Refresh Session" : "Start Call"}
            </button>
            {callMsg ? <p className="text-xs text-gray-500 mt-3 max-w-md">{callMsg}</p> : null}

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button onClick={saveSnapshot} className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700 disabled:opacity-60" disabled={sending}>
                {sending ? "Sending..." : "Save + Email Summary"}
              </button>
              <Link href={`/vendors/demo-summary?lead=${encodeURIComponent(leadId)}&company=${encodeURIComponent(company)}`} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                View / Export Summary
              </Link>
            </div>
            {sendMsg ? <p className="text-xs text-gray-500 mt-2">{sendMsg}</p> : null}
          </section>

          <aside className="rounded-xl border border-gray-200 bg-white p-3 h-fit">
            <p className="text-sm font-semibold text-gray-900 mb-2">Live Transcript</p>
            <div className="space-y-2 max-h-[620px] overflow-auto pr-1">
              {transcript.map((line, idx) => (
                <div key={`${line.speaker}-${idx}`} className={`rounded-lg p-2.5 text-sm ${line.speaker === "AI Assistant" ? "bg-rose-50" : line.speaker === "System" ? "bg-blue-50" : "bg-gray-50"}`}>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{line.speaker}</p>
                  <p className="text-gray-700">{line.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-lg border border-gray-200 p-2.5">
              <p className="text-xs text-gray-500">Current score</p>
              <p className="text-xl font-semibold text-gray-900">{score}/100</p>
            </div>

            <div className="mt-2 rounded-lg border border-gray-200 p-2.5">
              <p className="text-xs text-gray-500 mb-1">Snapshots</p>
              <div className="space-y-1.5 max-h-[130px] overflow-auto pr-1">
                {snapshots.length === 0 ? (
                  <p className="text-xs text-gray-500">No snapshots yet.</p>
                ) : (
                  snapshots.map((s) => (
                    <div key={s.id} className="rounded bg-gray-50 p-1.5">
                      <p className="text-[11px] font-semibold text-gray-700">{s.scenario}</p>
                      <p className="text-[11px] text-gray-500">{s.score}/100 · {new Date(s.createdAt).toLocaleString()}</p>
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
