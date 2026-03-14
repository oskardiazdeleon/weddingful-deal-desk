"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  weddingDateStart: string;
  weddingDateEnd: string;
  destination: string;
  budget: string;
  guestCount: string;
}

const STEPS = ["Dates", "Location & Guests", "Budget", "Your Email"];

const emptyForm: FormData = {
  email: "",
  weddingDateStart: "",
  weddingDateEnd: "",
  destination: "",
  budget: "",
  guestCount: "",
};

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function canAdvance(): boolean {
    if (step === 0) return !!form.weddingDateStart && !!form.weddingDateEnd;
    if (step === 1) return !!form.destination && !!form.guestCount;
    if (step === 2) return !!form.budget && Number(form.budget) >= 1000;
    if (step === 3) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    return false;
  }

  async function handleSubmit() {
    if (!canAdvance()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          guestCount: Number(form.guestCount),
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      const data = await res.json();
      const params = new URLSearchParams({
        budget: form.budget,
        guestCount: form.guestCount,
        destination: form.destination,
        leadId: data.id,
      });
      router.push(`/audit?${params.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="text-rose-600 font-bold text-xl">
            Weddingful
          </a>
          <p className="text-sm text-gray-500 mt-1">Free AI-powered savings estimate — takes 2 minutes</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
            <span>{STEPS[step]}</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div
              className="h-1.5 bg-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Step 0: Dates */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">When&apos;s the big day?</h2>
              <p className="text-gray-500 text-sm mb-6">
                A flexible date window helps us find better vendor availability and pricing.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Earliest date
                  </label>
                  <input
                    type="date"
                    value={form.weddingDateStart}
                    onChange={(e) => update("weddingDateStart", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latest date
                  </label>
                  <input
                    type="date"
                    value={form.weddingDateEnd}
                    onChange={(e) => update("weddingDateEnd", e.target.value)}
                    min={form.weddingDateStart}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Location & Guests */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Where and how many?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Location affects vendor availability and pricing dramatically.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cancun, Mexico · Tuscany, Italy · Caribbean"
                    value={form.destination}
                    onChange={(e) => update("destination", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated guest count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    placeholder="e.g. 75"
                    value={form.guestCount}
                    onChange={(e) => update("guestCount", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">What&apos;s your total budget?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your honest budget helps us identify the biggest savings opportunities. No
                judgment — bigger budgets often have more waste.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total budget (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    placeholder="25000"
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                {form.budget && Number(form.budget) < 1000 && (
                  <p className="text-xs text-red-500 mt-1">Minimum budget is $1,000</p>
                )}
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {["10000", "20000", "40000", "75000"].map((v) => (
                  <button
                    key={v}
                    onClick={() => update("budget", v)}
                    className={`text-xs py-1.5 rounded-lg border transition-colors ${
                      form.budget === v
                        ? "border-rose-500 bg-rose-50 text-rose-600 font-semibold"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    ${(Number(v) / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Email */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Where should we send your estimate?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your AI wedding assistant will generate a personalized savings estimate in seconds. We&apos;ll also send you a copy by email.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canAdvance() && handleSubmit()}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                No spam. Unsubscribe anytime. We take privacy seriously.
              </p>
            </div>
          )}

          {/* Error */}
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          {/* Actions */}
          <div className="mt-8 flex justify-between items-center">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="bg-rose-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canAdvance() || submitting}
                className="bg-rose-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Calculating..." : "Show My Estimate →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
