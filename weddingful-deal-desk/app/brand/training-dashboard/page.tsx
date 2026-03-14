import Link from "next/link";
import Script from "next/script";

export const dynamic = "force-dynamic";

const navItems = [
  "Overview",
  "Training Scenarios",
  "Live Demo",
  "Transcript Review",
  "Team Performance",
  "Settings",
];

const transcript = [
  { speaker: "Caller", text: "Hi, we’re planning a destination wedding for May next year." },
  { speaker: "AI Assistant", text: "Amazing — I can help with that. What destination are you considering?" },
  { speaker: "Caller", text: "Cancun, around 80 guests." },
  { speaker: "AI Assistant", text: "Perfect. What budget range should I note for your planning team?" },
  { speaker: "Caller", text: "Roughly 45 thousand." },
  { speaker: "AI Assistant", text: "Got it. I’ll route this to your venue team as high-priority." },
];

export default function TrainingDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] py-8 px-4">
      <Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold mb-1">
            Weddingful · Demo Training
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Voice Concierge Training Workspace
          </h1>
          <p className="text-gray-500 mt-1">
            Practice real call scenarios, evaluate qualification quality, and train your team faster.
          </p>
        </div>

        <div className="grid lg:grid-cols-[240px_minmax(0,1fr)_340px] gap-4">
          {/* Left rail */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Training Menu</p>
            <ul className="space-y-2 text-sm">
              {navItems.map((item, i) => (
                <li key={item}>
                  <button
                    className={`w-full text-left rounded-lg px-3 py-2 transition ${
                      i === 2
                        ? "bg-rose-50 text-rose-700 font-semibold border border-rose-100"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-gray-200 p-3">
              <p className="text-xs text-gray-500 uppercase">Onboarding</p>
              <p className="text-xl font-semibold mt-1">35%</p>
              <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-[35%] bg-rose-500" />
              </div>
            </div>
          </aside>

          {/* Center panel */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Live demo</p>
                  <h2 className="text-xl font-semibold">Scenario: New Wedding Inquiry</h2>
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">
                  Ready
                </span>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-8 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-3xl mb-4">
                  ☎
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Run a simulated call to test qualification flow and escalation behavior.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <button className="rounded-full bg-rose-600 text-white px-5 py-2.5 font-semibold hover:bg-rose-700">
                    Launch Live Demo
                  </button>
                </div>

                <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-xs text-gray-500 mb-2">Try Penny (ElevenLabs agent)</p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        '<elevenlabs-convai agent-id="agent_4801kf4jnhneet6tscp3zt0f76er"></elevenlabs-convai>',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase text-gray-500">Qualification score</p>
                <p className="text-2xl font-semibold mt-1">82 / 100</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase text-gray-500">Demo calls completed</p>
                <p className="text-2xl font-semibold mt-1">4</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase text-gray-500">Avg call duration</p>
                <p className="text-2xl font-semibold mt-1">3m 42s</p>
              </div>
            </div>
          </section>

          {/* Right rail transcript */}
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Live Transcript</h3>
              <span className="text-xs text-gray-500">Sample</span>
            </div>
            <div className="space-y-2 max-h-[470px] overflow-auto pr-1">
              {transcript.map((line, idx) => (
                <div key={idx} className={`rounded-lg p-2.5 text-sm ${line.speaker === "AI Assistant" ? "bg-rose-50" : "bg-gray-50"}`}>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{line.speaker}</p>
                  <p className="text-gray-700">{line.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-3">
              <p className="text-xs uppercase text-gray-500 mb-1">Captured fields</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Destination: Cancun</li>
                <li>• Guest Count: 80</li>
                <li>• Budget Band: Mid-Premium</li>
                <li>• Intent: High</li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/brand/dashboard" className="rounded-full bg-rose-600 text-white px-5 py-2.5 font-semibold hover:bg-rose-700">
            Open Lead Intelligence
          </Link>
          <Link href="/vendors" className="rounded-full border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-white">
            Return to Vendor Page
          </Link>
        </div>
      </div>
    </main>
  );
}
