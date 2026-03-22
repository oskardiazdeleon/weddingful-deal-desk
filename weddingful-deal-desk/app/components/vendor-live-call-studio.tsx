"use client";

import Link from "next/link";
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
  "availability-check": {
    name: "Customer Checks Availability Dates",
    subtitle: "Staged Live Call · Availability Qualification",
    openingPrompt:
      "Thanks for calling Weddingful. I can help check your wedding date availability and capture fit details for the events team.",
    systemPrompt:
      "Role: Weddingful Availability Concierge. Capture fixed/flexible date, guest count range, destination, ceremony/reception setup, and urgency.",
    coaching: [
      { title: "Clarify date flexibility", detail: "Confirm fixed date vs acceptable alternate windows." },
      { title: "Capture event profile", detail: "Collect guest count and preferred ceremony/reception format." },
      { title: "Validate location fit", detail: "Confirm destination or property preference." },
      { title: "Confirm next step", detail: "Offer availability callback timeline and owner." },
    ],
  },
  "insurance-policy": {
    name: "Customer Asks About Insurance Policy",
    subtitle: "Staged Live Call · Policy Clarification",
    openingPrompt:
      "I can guide you through policy basics and capture the exact coverage questions for our wedding advisor.",
    systemPrompt:
      "Role: Weddingful Policy Concierge. Capture concerns about cancellation, weather, vendor issues, and reimbursement timelines. Provide general guidance and route detailed policy questions to specialist.",
    coaching: [
      { title: "Identify policy concern", detail: "Clarify what risk the caller is worried about first." },
      { title: "Map to coverage topic", detail: "Tag issue under weather, cancellation, vendor, or travel." },
      { title: "Capture context", detail: "Note date window, booking stage, and urgency." },
      { title: "Route to specialist", detail: "Set expectation for policy follow-up and documentation." },
    ],
  },
  "accommodation-upgrade": {
    name: "Customer Requests Accommodation Upgrade",
    subtitle: "Staged Live Call · Upgrade Workflow",
    openingPrompt:
      "Happy to help with room upgrades. I’ll capture your current package and preferred upgrade options.",
    systemPrompt:
      "Role: Weddingful Guest Experience Concierge. Capture current booking tier, desired room type upgrades, date, room count, and budget sensitivity. Route to accommodations desk.",
    coaching: [
      { title: "Confirm current booking", detail: "Capture package/tier and reservation context." },
      { title: "Capture upgrade request", detail: "Collect room types, quantity, and must-have preferences." },
      { title: "Check constraints", detail: "Capture budget range and flexibility for alternatives." },
      { title: "Set follow-up owner", detail: "Route to accommodations with SLA and summary." },
    ],
  },
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

  async function startCall() {
    setCallStarting(true);
    setCallMsg("");

    try {
      const sessionRes = await fetch("/api/elevenlabs/start-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: activeScenarioId,
          leadId,
          company,
          agentId: DEFAULT_AGENT_ID,
        }),
      });

      const sessionData = await sessionRes.json().catch(() => ({}));
      if (!sessionRes.ok) {
        throw new Error(formatError(sessionData?.error || sessionData || "Could not initialize ElevenLabs session"));
      }

      const signedUrl = sessionData?.signedUrl;
      if (!signedUrl || typeof signedUrl !== "string") {
        throw new Error("No signed call URL returned from ElevenLabs API.");
      }

      setSignedCallUrl(signedUrl);
      setCallMsg("Call session ready. Use the in-page call panel below.");
    } catch (e: any) {
      const details = formatError(e);
      setCallMsg(`Unable to start call: ${details}`);
    } finally {
      setCallStarting(false);
    }
  }

  async function saveSnapshot(sendEmailToLead = true) {
    if (!leadId) {
      setSendMsg("Missing lead id for saving.");
      return;
    }

    setSending(true);
    setSendMsg("");

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

      setSendMsg(
        sendEmailToLead
          ? data?.email?.ok
            ? "Demo summary emailed to lead."
            : `Saved, but email failed: ${data?.email?.reason || "unknown"}`
          : "Snapshot saved."
      );
    } catch (e: any) {
      setSendMsg(formatError(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-gray-500 font-semibold">Weddingful · Live Call Studio</p>
              <h1 className="text-2xl font-semibold text-gray-900">{config.name}</h1>
              <p className="text-sm text-gray-500">{config.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-gray-500">Workspace</p>
              <p className="text-sm font-semibold text-gray-800">{company || "Demo"}</p>
              <p className="text-[11px] text-gray-500 mt-1">Build: {buildVersion}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/vendors/training-dashboard?lead=${encodeURIComponent(leadId)}`}
              className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Training Dashboard
            </Link>
            <Link
              href={`/vendors/demo-summary?lead=${encodeURIComponent(leadId)}&company=${encodeURIComponent(company)}`}
              className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Demo Summary
            </Link>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 overflow-x-auto">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Scenario Switcher</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(scenarioMap).map(([id, s]) => (
              <button
                key={id}
                onClick={() => setActiveScenarioId(id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  activeScenarioId === id
                    ? "bg-rose-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
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
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${signedCallUrl ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {signedCallUrl ? "Call panel ready" : "Session not started"}
                </span>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                {signedCallUrl ? (
                  <div className="h-[220px] flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-gray-600 mb-3">Call session initialized successfully.</p>
                    <a
                      href={signedCallUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-rose-600 text-white px-5 py-2 text-sm font-semibold hover:bg-rose-700"
                    >
                      Open Live Call
                    </a>
                    <p className="text-xs text-gray-500 mt-3">Opens the secure ElevenLabs call session in a new tab.</p>
                  </div>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-sm text-gray-500">
                    Click <strong className="mx-1">Start Call</strong> to initialize your secure voice session.
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={startCall}
                  disabled={callStarting}
                  className="rounded-full bg-rose-600 text-white px-5 py-2 text-sm font-semibold hover:bg-rose-700 disabled:opacity-50"
                >
                  {callStarting ? "Starting call..." : signedCallUrl ? "Refresh Call Session" : "Start Call"}
                </button>
                <p className="text-xs text-gray-500">Browser may ask for microphone permission.</p>
              </div>
              {callMsg ? <p className="text-xs text-gray-500 mt-2">{callMsg}</p> : null}

              <p className="text-xs text-gray-500 mt-2">
                Calls are initialized from the Start Call button via server-side ElevenLabs API session creation.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => saveSnapshot(true)}
                  className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700 disabled:opacity-60"
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Save + Email Summary"}
                </button>
                <Link
                  href={`/vendors/demo-summary?lead=${encodeURIComponent(leadId)}&company=${encodeURIComponent(company)}`}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  View / Export Summary
                </Link>
              </div>
              {sendMsg ? <p className="text-xs text-gray-500 mt-2">{sendMsg}</p> : null}
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
