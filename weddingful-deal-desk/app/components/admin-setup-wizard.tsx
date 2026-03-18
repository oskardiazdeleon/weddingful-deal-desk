"use client";

import { useEffect, useMemo, useState } from "react";

export interface WizardStep {
  step: string;
  title: string;
  detail: string;
}

const STORAGE_KEY = "weddingful_admin_setup_wizard_v1";

export default function AdminSetupWizard({ steps }: { steps: WizardStep[] }) {
  const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as boolean[];
      if (!Array.isArray(parsed)) return;
      setDone(steps.map((_, i) => Boolean(parsed[i])));
    } catch {
      // ignore parse/storage errors
    }
  }, [steps]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      // ignore storage errors
    }
  }, [done]);

  const completed = useMemo(() => done.filter(Boolean).length, [done]);
  const progress = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5" id="overview">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Admin Onboarding Guide</h2>
          <p className="text-sm text-gray-500">
            Track setup progress per workspace. Status is saved in your browser.
          </p>
        </div>
        <span className="rounded-full bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1">
          {completed}/{steps.length} complete
        </span>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-rose-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {steps.map((s, idx) => (
          <label
            key={s.step}
            className={`rounded-xl border p-4 cursor-pointer transition ${
              done[idx]
                ? "border-emerald-200 bg-emerald-50"
                : "border-gray-200 bg-gray-50 hover:border-rose-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-rose-600"
                checked={done[idx] ?? false}
                onChange={(e) => {
                  setDone((prev) => {
                    const next = [...prev];
                    next[idx] = e.target.checked;
                    return next;
                  });
                }}
              />
              <div>
                <p className="text-xs uppercase tracking-wide text-rose-600 font-semibold">{s.step}</p>
                <h3 className="font-semibold text-gray-900 mt-1">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{s.detail}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-full bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700"
          onClick={() => setDone(steps.map(() => true))}
        >
          Mark All Complete
        </button>
        <button
          className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          onClick={() => setDone(steps.map(() => false))}
        >
          Reset Wizard
        </button>
      </div>
    </div>
  );
}
