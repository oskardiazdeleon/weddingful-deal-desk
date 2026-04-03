"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Conversation } from "@elevenlabs/client";

type CoachingItem = { title: string; detail: string };
type ScenarioConfig = {
  name: string;
  subtitle: string;
  coaching: CoachingItem[];
  openingPrompt: string;
  systemPrompt: string;
};

const scenarioMap: Record<string, ScenarioConfig> = {
  "wedding-venue-availability": {
    name: "Wedding Venue Availability",
    subtitle: "Date and capacity qualification",
    openingPrompt: "I can help check venue availability and gather your event details.",
    systemPrompt: "Capture preferred date range, guest count, ceremony/reception requirements, and backup date flexibility.",
    coaching: [
      { title: "Date range", detail: "Collect preferred and backup dates" },
      { title: "Capacity", detail: "Confirm estimated guest count" },
      { title: "Format", detail: "Ceremony and reception setup needs" },
      { title: "Follow-up", detail: "Set timeline for availability response" },
    ],
  },
  "music-options": {
    name: "Music Options",
    subtitle: "Entertainment planning intake",
    openingPrompt: "I can walk you through music options and capture your event preferences.",
    systemPrompt: "Capture preferred genres, live band vs DJ, ceremony/reception needs, and budget band.",
    coaching: [
      { title: "Style preference", detail: "Genres and atmosphere" },
      { title: "Format", detail: "Band, DJ, or hybrid" },
      { title: "Timeline", detail: "Ceremony, cocktail, and reception coverage" },
      { title: "Budget", detail: "Price range and upgrade appetite" },
    ],
  },
  "photography-packages": {
    name: "Photography Packages",
    subtitle: "Photo and media qualification",
    openingPrompt: "I can help compare photography packages and capture your priorities.",
    systemPrompt: "Capture photo/video needs, hours of coverage, style preferences, and deliverables requested.",
    coaching: [
      { title: "Coverage scope", detail: "Hours, locations, and event segments" },
      { title: "Media type", detail: "Photo only or photo + video" },
      { title: "Style", detail: "Editorial, candid, cinematic, etc." },
      { title: "Deliverables", detail: "Albums, edits, turnaround expectations" },
    ],
  },
  "accommodations-options": {
    name: "Accomodations Options",
    subtitle: "Guest stay planning",
    openingPrompt: "I can help review accommodation options for your wedding guests.",
    systemPrompt: "Capture room block size, room categories, length of stay, and guest budget tiers.",
    coaching: [
      { title: "Room block size", detail: "Number of rooms and guest types" },
      { title: "Room mix", detail: "Standard, premium, suites" },
      { title: "Stay details", detail: "Check-in/out flexibility" },
      { title: "Pricing fit", detail: "Budget tiers and upgrade options" },
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
  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    scenario in scenarioMap ? scenario : "wedding-venue-availability"
  );
  const config = useMemo(
    () => scenarioMap[activeScenarioId] || scenarioMap["wedding-venue-availability"],
    [activeScenarioId]
  );

  const [transcript, setTranscript] = useState<{ speaker: string; text: string }[]>([]);
  const [callStarting, setCallStarting] = useState(false);
  const [callMsg, setCallMsg] = useState("");
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "connected" | "ended" | "error">("idle");
  const [callMode, setCallMode] = useState<"listening" | "speaking" | "unknown">("unknown");
  const [agentDebug, setAgentDebug] = useState("");
  const [sessionAttempt, setSessionAttempt] = useState(0);
  const [lastDisconnectDebug, setLastDisconnectDebug] = useState("");
  const [lastErrorDebug, setLastErrorDebug] = useState("");
  const [signedUrlDebug, setSignedUrlDebug] = useState("");
  const conversationRef = useRef<Conversation | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const manualEndRef = useRef(false);
  const sessionNonceRef = useRef(0);

  useEffect(() => {
    // Reset transcript when scenario changes. Real-time entries are populated from ElevenLabs events.
    setTranscript([]);
  }, [config]);

  const startCall = useCallback(async (options?: { isReconnect?: boolean }) => {
    const isReconnect = options?.isReconnect ?? false;
    const sessionNonce = ++sessionNonceRef.current;

    setCallStarting(true);
    setCallMsg("");
    setCallStatus("connecting");
    setLastDisconnectDebug("");
    setLastErrorDebug("");
    setSessionAttempt((prev) => prev + 1);
    manualEndRef.current = false;

    try {
      if (!isReconnect && conversationRef.current) {
        await conversationRef.current.endSession();
        conversationRef.current = null;
      }

      const sessionRes = await fetch("/api/elevenlabs/start-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: activeScenarioId, leadId, company }),
      });

      const sessionData = await sessionRes.json().catch(() => ({}));
      if (!sessionRes.ok) throw new Error(formatError(sessionData?.error || sessionData || "Could not initialize session"));

      const signedUrl = sessionData?.signedUrl;
      if (!signedUrl || typeof signedUrl !== "string") throw new Error("No signed session URL returned from ElevenLabs API.");

      setAgentDebug(sessionData?.agentIdUsed ? String(sessionData.agentIdUsed) : "");
      setSignedUrlDebug(typeof signedUrl === "string" ? `${signedUrl.slice(0, 80)}…` : "");

      const conversation = await Conversation.startSession({
        signedUrl,
        useWakeLock: true,
        connectionDelay: { default: 300 },
        dynamicVariables: {
          scenario: config.name,
          company,
        },
        onConnect: () => {
          if (sessionNonce !== sessionNonceRef.current) return;
          setCallStatus("connected");
          setCallMsg("Call connected. You should now hear audio.");
          setTranscript((prev) => {
            const alreadyConnected = prev[prev.length - 1]?.speaker === "System" && prev[prev.length - 1]?.text === "Voice session connected.";
            return alreadyConnected ? prev : [...prev, { speaker: "System", text: "Voice session connected." }];
          });
        },
        onDisconnect: (details) => {
          if (sessionNonce !== sessionNonceRef.current) return;

          conversationRef.current = null;
          setCallStatus("ended");

          const reason = (details as any)?.reason || "unknown";
          const debug = formatError(details);
          const wasManual = manualEndRef.current || reason === "user";

          setLastDisconnectDebug(debug);
          setCallMsg(
            wasManual
              ? `Call ended${reason ? ` (${reason})` : ""}.`
              : `Call disconnected${reason ? ` (${reason})` : ""}. Auto-reconnect is disabled for debugging.`
          );
        },
        onModeChange: ({ mode }) => setCallMode(mode ?? "unknown"),
        onError: (message, context) => {
          setCallStatus("error");
          const debug = formatError({ message, context });
          setLastErrorDebug(debug);
          setCallMsg(`Call error: ${formatError(message || context)}`);
        },
        onMessage: ({ message, role }) => {
          const speaker = role === "agent" ? "AI Assistant" : "Caller";
          if (message?.trim()) setTranscript((prev) => [...prev, { speaker, text: message }]);
        },
      });

      if (sessionNonce !== sessionNonceRef.current) {
        await conversation.endSession().catch(() => {});
        return;
      }

      conversationRef.current = conversation;
      setCallMsg(isReconnect ? "Reconnecting to voice session..." : "Connecting to voice session...");
    } catch (e) {
      setCallStatus("error");
      setCallMsg(`Unable to start call: ${formatError(e)}`);
    } finally {
      setCallStarting(false);
    }
  }, [activeScenarioId, company, config.name, leadId]);

  useEffect(() => {
    if (callStatus !== "connected") return;

    const id = setInterval(() => {
      try {
        conversationRef.current?.sendUserActivity();
      } catch {
        // ignore keepalive send errors
      }
    }, 10000);

    return () => clearInterval(id);
  }, [callStatus]);

  const handleStartCall = useCallback(() => {
    startCall().catch(() => {});
  }, [startCall]);

  async function endCall() {
    try {
      manualEndRef.current = true;
      sessionNonceRef.current += 1;
      if (conversationRef.current) {
        await conversationRef.current.endSession();
        conversationRef.current = null;
      }
      setCallStatus("ended");
      setCallMsg("Call ended.");
    } catch (e) {
      setCallMsg(`Unable to end call: ${formatError(e)}`);
    }
  }

  useEffect(() => {
    return () => {
      sessionNonceRef.current += 1;
      if (conversationRef.current) {
        conversationRef.current.endSession().catch(() => {});
        conversationRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const el = transcriptContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [transcript]);

  const callAnalysis = useMemo(() => {
    const callerLines = transcript.filter((t) => t.speaker === "Caller");
    const agentLines = transcript.filter((t) => t.speaker === "AI Assistant");
    const allText = transcript.map((t) => t.text.toLowerCase()).join(" ");

    const wordCount = allText.trim() ? allText.trim().split(/\s+/).length : 0;
    const fillerMatches = allText.match(/\b(um|uh|like|you know|sort of|kind of)\b/g) || [];
    const questionMatches = allText.match(/\?/g) || [];

    const positiveMatches = allText.match(/\b(great|perfect|happy|excellent|love|amazing|awesome|wonderful)\b/g) || [];
    const negativeMatches = allText.match(/\b(problem|issue|concern|frustrated|angry|upset|confused)\b/g) || [];

    const intentSignals = allText.match(/\b(date|guest|budget|package|availability|book|consult|timeline|follow-up|next step)\b/g) || [];

    const callerChars = callerLines.reduce((s, l) => s + l.text.length, 0);
    const agentChars = agentLines.reduce((s, l) => s + l.text.length, 0);
    const totalChars = Math.max(1, callerChars + agentChars);
    const callerShare = Math.round((callerChars / totalChars) * 100);

    const tone = Math.max(0, Math.min(100, 60 + positiveMatches.length * 6 - negativeMatches.length * 5));
    const direction = Math.max(0, Math.min(100, 35 + intentSignals.length * 5 + questionMatches.length * 2));
    const fluency = Math.max(0, Math.min(100, 85 - fillerMatches.length * 6));
    const engagement = Math.max(0, Math.min(100, 30 + (callerLines.length + agentLines.length) * 6));
    const voiceInflux = Math.max(0, Math.min(100, 100 - Math.abs(50 - callerShare) * 2));

    const overall =
      Math.round((tone * 0.24 + direction * 0.28 + fluency * 0.2 + engagement * 0.14 + voiceInflux * 0.14) * 10) /
      10;

    return {
      tone,
      direction,
      fluency,
      engagement,
      voiceInflux,
      overall,
      wordCount,
      callerShare,
      note:
        wordCount < 20
          ? "Score is provisional until more conversation is captured."
          : "Score is based on live transcript heuristics (tone, direction, fluency, engagement, talk balance).",
    };
  }, [transcript]);

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
              <p className="text-sm text-gray-600">Start call to connect microphone + speaker directly in this page.</p>
              <p className="text-xs text-gray-500 mt-2">Status: {callStatus} · Mode: {callMode}</p>
              <p className="text-xs text-gray-500 mt-1">Attempt: {sessionAttempt}</p>
              {agentDebug ? <p className="text-xs text-gray-500 mt-1">Agent: {agentDebug}</p> : null}
            </div>

            <div className="flex items-center justify-center gap-2">
              <button onClick={handleStartCall} disabled={callStarting} className="rounded-full bg-rose-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-rose-700 disabled:opacity-50">
                {callStarting ? "Starting call..." : callStatus === "connected" ? "Reconnect Call" : "Start Call"}
              </button>
              <button onClick={endCall} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                End Call
              </button>
            </div>
            {callMsg ? <p className="text-xs text-gray-500 mt-3 max-w-md">{callMsg}</p> : null}

            {(lastErrorDebug || lastDisconnectDebug || signedUrlDebug) ? (
              <div className="mt-4 w-full max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-3 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Debug</p>
                {lastErrorDebug ? <p className="mt-2 text-xs text-amber-900 break-words"><strong>Error:</strong> {lastErrorDebug}</p> : null}
                {lastDisconnectDebug ? <p className="mt-2 text-xs text-amber-900 break-words"><strong>Disconnect:</strong> {lastDisconnectDebug}</p> : null}
                {signedUrlDebug ? <p className="mt-2 text-xs text-amber-900 break-all"><strong>Signed URL:</strong> {signedUrlDebug}</p> : null}
              </div>
            ) : null}

          </section>

          <aside className="rounded-xl border border-gray-200 bg-white p-3 h-fit">
            <div className="rounded-lg border border-gray-200 p-3 mb-3">
              <p className="text-xs text-gray-500">Live Call Quality Analysis</p>
              <p className="text-lg font-semibold text-gray-900">Overall: {callAnalysis.overall}/100</p>

              <div className="mt-2 space-y-1.5 text-xs text-gray-700">
                <ScoreRow label="Tone" value={callAnalysis.tone} />
                <ScoreRow label="Direction" value={callAnalysis.direction} />
                <ScoreRow label="Fluency" value={callAnalysis.fluency} />
                <ScoreRow label="Engagement" value={callAnalysis.engagement} />
                <ScoreRow label="Voice Influx" value={callAnalysis.voiceInflux} />
              </div>

              <p className="text-[11px] text-gray-500 mt-2">
                Words: {callAnalysis.wordCount} · Caller talk share: {callAnalysis.callerShare}%
              </p>
              <p className="text-[11px] text-gray-500 mt-1">{callAnalysis.note}</p>
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-2">Live Transcript</p>
            <div ref={transcriptContainerRef} className="space-y-2 max-h-[620px] overflow-auto pr-1">
              {transcript.length === 0 ? (
                <div className="rounded-lg p-3 text-sm bg-gray-50 text-gray-500">
                  No live transcript yet. Click Start Call and begin speaking.
                </div>
              ) : null}
              {transcript.map((line, idx) => (
                <div key={`${line.speaker}-${idx}`} className={`rounded-lg p-2.5 text-sm ${line.speaker === "AI Assistant" ? "bg-rose-50" : line.speaker === "System" ? "bg-blue-50" : "bg-gray-50"}`}>
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

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[110px_1fr_36px] items-center gap-2">
      <span>{label}</span>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-rose-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <span className="text-right">{value}</span>
    </div>
  );
}
