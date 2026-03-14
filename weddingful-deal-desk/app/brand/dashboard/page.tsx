import { getCoupleLeads, getVendorFollowups, getVendorInquiries } from "@/lib/db";

function scoreLead(lead: { budget: number; guestCount: number }) {
  const budgetScore = Math.min(60, Math.round((lead.budget / 50000) * 60));
  const guestScore = Math.min(40, Math.round((lead.guestCount / 120) * 40));
  return Math.max(10, budgetScore + guestScore);
}

function budgetBand(budget: number) {
  if (budget < 20000) return "Value";
  if (budget < 50000) return "Mid";
  return "Premium";
}

function pseudoSegment(email: string) {
  const i = email.length % 3;
  return ["Luxury-leaning", "Balanced", "Value-focused"][i];
}

export const dynamic = "force-dynamic";

export default function BrandDashboardPage() {
  const leads = getCoupleLeads().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const vendorLeads = getVendorInquiries().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const followups = getVendorFollowups();

  const nextFollowupByLead = new Map<string, string>();
  for (const f of followups) {
    if (f.status !== "pending") continue;
    const prev = nextFollowupByLead.get(f.leadId);
    if (!prev || new Date(f.scheduledFor) < new Date(prev)) {
      nextFollowupByLead.set(f.leadId, f.scheduledFor);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Brand Dashboard · Lead Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enriched lead view for venue sales teams (MVP preview).
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 text-sm">
          This is an MVP dashboard with placeholder enrichment logic for UI validation. Connect your verified data pipeline before production decisions.
        </div>

        <section className="bg-white rounded-xl shadow-sm overflow-x-auto mb-8">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Vendor Pipeline (Phase 1 Follow-up)</h2>
            <p className="text-xs text-gray-500">Leads, status, and next scheduled follow-up email.</p>
          </div>
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Company",
                  "Contact",
                  "Email",
                  "Type",
                  "Status",
                  "Next Follow-up",
                  "Created",
                ].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendorLeads.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{v.company}</td>
                  <td className="px-4 py-3 text-gray-700">{v.name}</td>
                  <td className="px-4 py-3 text-gray-600">{v.email}</td>
                  <td className="px-4 py-3 text-gray-600">{v.vendorType}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">{v.status || "new"}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {nextFollowupByLead.get(v.id)
                      ? new Date(nextFollowupByLead.get(v.id)!).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(v.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm"><div className="text-2xl font-bold">{leads.length}</div><div className="text-xs text-gray-500">Total Leads</div></div>
          <div className="bg-white rounded-xl p-4 shadow-sm"><div className="text-2xl font-bold">{leads.filter(l=>scoreLead(l)>=70).length}</div><div className="text-xs text-gray-500">High Priority (70+)</div></div>
          <div className="bg-white rounded-xl p-4 shadow-sm"><div className="text-2xl font-bold">{leads.filter(l=>budgetBand(l.budget)==='Premium').length}</div><div className="text-xs text-gray-500">Premium Budget Leads</div></div>
          <div className="bg-white rounded-xl p-4 shadow-sm"><div className="text-2xl font-bold">{leads.filter(l=>new Date(l.createdAt).getTime()>Date.now()-7*24*60*60*1000).length}</div><div className="text-xs text-gray-500">New This Week</div></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[980px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Email",
                  "Destination",
                  "Budget",
                  "Guests",
                  "Lead Score",
                  "Budget Band",
                  "Homeowner",
                  "Affinity Segment",
                  "Created",
                ].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => {
                const score = scoreLead(lead);
                const homeowner = lead.guestCount > 60 ? "Likely" : "Unknown";
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.destination}</td>
                    <td className="px-4 py-3 text-gray-700">${lead.budget.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.guestCount}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">{score}</span></td>
                    <td className="px-4 py-3 text-gray-600">{budgetBand(lead.budget)}</td>
                    <td className="px-4 py-3 text-gray-600">{homeowner}</td>
                    <td className="px-4 py-3 text-gray-600">{pseudoSegment(lead.email)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(lead.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
