"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface VendorForm {
  name: string;
  email: string;
  company: string;
  vendorType: string;
  message: string;
}

const emptyForm: VendorForm = {
  name: "",
  email: "",
  company: "",
  vendorType: "",
  message: "",
};

const VENDOR_TYPES = [
  "Venue",
  "Wedding Planner / Coordinator",
  "Photography / Videography",
  "Catering & Bar",
  "Floral & Décor",
  "Music & Entertainment",
  "Other",
];

export default function VendorsPage() {
  const [form, setForm] = useState<VendorForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function update(field: keyof VendorForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function isValid() {
    return form.name && form.email && form.company && form.vendorType;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/vendor-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      const data = await res.json();
      const company = encodeURIComponent(form.company || "your-brand");
      const lead = encodeURIComponent(data.id || "");

      const emailStatus = data?.email?.ok ? "sent" : "not_sent";
      const emailReason = encodeURIComponent(data?.email?.reason || "");

      router.push(
        `/vendors/confirmed?company=${company}&lead=${lead}&emailStatus=${emailStatus}&emailReason=${emailReason}`
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
          For Venues · Planners · Vendors
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Stop chasing couples.<br />
          <span className="text-rose-600">Receive qualified leads instead.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Every couple in our pipeline has completed a detailed intake: dates, destination, budget,
          and guest count. We match and deliver only couples who fit your criteria.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">How the vendor program works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Define your lead profile",
                desc: "Choose destinations, budget bands, guest ranges, and preferred inquiry volume.",
              },
              {
                step: "02",
                title: "Capture and qualify inbound calls",
                desc: "Our AI assistant handles calls 24/7 and captures structured lead details in real time.",
              },
              {
                step: "03",
                title: "Route high-intent opportunities",
                desc: "Your team gets qualified lead summaries and can prioritize the best-fit opportunities first.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-200">
                <p className="text-xs font-semibold text-rose-500 tracking-wide mb-2">{item.step}</p>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program outcomes focus */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-4 text-left">
          {[
            {
              title: "Capture missed opportunities",
              desc: "Use 24/7 voice handling so after-hours inquiries are captured and routed instead of lost.",
            },
            {
              title: "Standardize qualification",
              desc: "Collect wedding date, guest count, destination, and budget consistently on every call.",
            },
            {
              title: "Speed up sales follow-up",
              desc: "Deliver structured call summaries so your team can prioritize high-intent couples fast.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-gray-900 mb-2">{item.title}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Call Assistant */}
      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 md:p-10">
            <div className="inline-block bg-white text-rose-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              New · Voice Concierge for Venues
            </div>
            <h2 className="text-3xl font-bold mb-3 text-gray-900">
              Never miss a wedding inquiry again.
            </h2>
            <p className="text-gray-600 max-w-2xl mb-6">
              Weddingful Voice Concierge uses an AI assistant to answer calls 24/7, qualify couples,
              capture wedding details, and instantly send your team a structured lead summary.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
              <div className="bg-white rounded-xl p-4 border border-rose-100">
                <p className="font-semibold mb-1">24/7 Call Handling</p>
                <p className="text-gray-500">No missed after-hours inquiries.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-rose-100">
                <p className="font-semibold mb-1">Lead Qualification</p>
                <p className="text-gray-500">Date, budget, guest count, destination intent.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-rose-100">
                <p className="font-semibold mb-1">Instant Handoff</p>
                <p className="text-gray-500">Email/SMS summary to your sales team.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#vendor-form" className="rounded-full bg-rose-600 text-white px-5 py-2.5 font-semibold hover:bg-rose-700">
                Join Pilot Waitlist
              </a>
              <a href="/vendors/live-demo?lead=demo&company=Demo&scenario=availability-check" className="rounded-full border border-rose-300 px-4 py-2 text-rose-700 text-sm font-medium hover:bg-white">
                Run Live Demo
              </a>
              <span className="rounded-full border border-rose-300 px-4 py-2 text-rose-700 text-sm font-medium">
                Starting at $299/mo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="vendor-form" className="bg-gray-900 py-16 px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Join the vendor network + voice concierge pilot
          </h2>
          <p className="text-gray-400 text-center text-sm mb-8">
            Tell us about your business. We&apos;ll reach out within 1 business day to discuss fit,
            pricing, and optional AI call assistant setup.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Your name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-gray-500"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Work email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-gray-500"
                    placeholder="jane@venue.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company / venue name
                </label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-gray-500"
                  placeholder="Riviera Maya Resort"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Vendor type</label>
                <select
                  required
                  value={form.vendorType}
                  onChange={(e) => update("vendorType", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select a type...</option>
                  {VENDOR_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tell us more (optional)
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-gray-500 resize-none"
placeholder="Destinations you serve, capacity, call volume, and whether you want the AI call assistant pilot..."
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={!isValid() || submitting}
                className="w-full bg-rose-600 text-white font-semibold py-3 rounded-full hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting..." : "Apply to Vendor Network →"}
              </button>
          </form>
        </div>
      </section>

    </main>
  );
}
