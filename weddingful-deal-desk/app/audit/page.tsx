import Link from "next/link";
import { computeAudit } from "@/lib/audit";

interface Props {
  searchParams: Promise<{
    budget?: string;
    guestCount?: string;
    destination?: string;
    leadId?: string;
  }>;
}

export default async function AuditPage({ searchParams }: Props) {
  const params = await searchParams;
  const budget = Number(params.budget) || 25000;
  const guestCount = Number(params.guestCount) || 50;
  const destination = params.destination || "your destination";

  const audit = computeAudit({ budget, guestCount, destination });

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <a href="/" className="text-rose-600 font-bold text-xl">
            Weddingful
          </a>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
Estimate complete
          </div>
          <h1 className="text-4xl font-bold mt-4 mb-2 text-gray-900">Your Personalized Savings Estimate</h1>
          <p className="text-gray-500">
            Based on a <strong>${budget.toLocaleString()}</strong> budget for{" "}
            <strong>{guestCount} guests</strong> in{" "}
            <strong>{destination}</strong>
          </p>
        </div>

        {/* Big number */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6 text-center">
          <div className="text-6xl font-bold text-rose-600 mb-2">
            ${audit.estimatedSavings.toLocaleString()}
          </div>
          <p className="text-gray-500">
estimated potential savings — <strong>{audit.savingsPercent}%</strong> of your total budget
          </p>
        </div>

        {/* Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="font-semibold text-lg mb-4">Where the savings come from</h2>
          <div className="space-y-3">
            {audit.breakdown.map((b) => (
              <div key={b.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{b.category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-rose-400 rounded-full"
                      style={{
                        width: `${Math.min(100, (b.saving / audit.estimatedSavings) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-20 text-right">
                    ${b.saving.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-rose-600 text-white rounded-2xl p-8 text-center shadow-xl shadow-rose-200">
          <h2 className="text-2xl font-bold mb-2">Want a real quote audit + negotiation plan?</h2>
          <p className="text-rose-200 mb-6 text-sm">
            Upgrade to Concierge and your AI wedding assistant + Weddingful team will review real quotes and contracts line-by-line, then negotiate on your behalf.
          </p>
          <Link
            href={`/concierge?leadId=${params.leadId ?? ""}`}
            className="inline-block bg-white text-rose-600 font-bold px-8 py-3 rounded-full hover:bg-rose-50 transition-colors text-sm"
          >
            Upgrade to Concierge Audit — $999 →
          </Link>
          <p className="text-rose-300 text-xs mt-3">
            Savings guarantee: if we don&apos;t save you more than our fee, we refund the difference.
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          This is a personalized estimate based on your intake profile (not a contract-level audit). For verified quote auditing, upload real quotes in Concierge. Individual results vary.{" "}
          <Link href="/intake" className="underline hover:text-gray-600">
            Start over
          </Link>
        </p>
      </div>
    </main>
  );
}
