/**
 * Internal admin page — NOT auth-protected in MVP.
 * TODO: Add authentication (e.g. NextAuth, Clerk, or a simple shared secret middleware)
 * before deploying to production.
 */

import { getCoupleLeads, getVendorInquiries } from "@/lib/db";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const leads = getCoupleLeads().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const inquiries = getVendorInquiries().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weddingful Admin</h1>
            <p className="text-sm text-gray-400 mt-1">
              Internal dashboard · Not publicly accessible in production
            </p>
          </div>
          <a href="/" className="text-sm text-rose-600 hover:underline">
            ← Back to site
          </a>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total couple leads", value: leads.length },
            {
              label: "Leads this week",
              value: leads.filter(
                (l) =>
                  new Date(l.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
              ).length,
            },
            { label: "Vendor inquiries", value: inquiries.length },
            {
              label: "Avg. budget",
              value:
                leads.length > 0
                  ? `$${Math.round(
                      leads.reduce((s, l) => s + l.budget, 0) / leads.length
                    ).toLocaleString()}`
                  : "—",
            },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Couple Leads */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Couple Leads{" "}
            <span className="text-sm font-normal text-gray-400">({leads.length})</span>
          </h2>
          {leads.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm">
              No leads yet. Share the site to start collecting!
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Email", "Destination", "Date Window", "Budget", "Guests", "Submitted"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{lead.email}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.destination}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {lead.weddingDateStart} – {lead.weddingDateEnd}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        ${lead.budget.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{lead.guestCount}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Vendor Inquiries */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Vendor Inquiries{" "}
            <span className="text-sm font-normal text-gray-400">({inquiries.length})</span>
          </h2>
          {inquiries.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm">
              No vendor inquiries yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Name", "Email", "Company", "Type", "Message", "Submitted"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{inq.name}</td>
                      <td className="px-4 py-3 text-gray-600">{inq.email}</td>
                      <td className="px-4 py-3 text-gray-600">{inq.company}</td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {inq.vendorType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{inq.message || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {formatDate(inq.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
