/**
 * Savings audit logic — estimates how much a couple could save with Weddingful concierge.
 * These are illustrative heuristics for the MVP; replace with real data/models later.
 */

export interface AuditInput {
  budget: number;
  guestCount: number;
  destination: string;
}

export interface AuditResult {
  estimatedSavings: number;
  savingsPercent: number;
  breakdown: { category: string; saving: number }[];
  headline: string;
}

// Average savings rates by category (conservative estimates)
const CATEGORY_RATES: { category: string; rate: number }[] = [
  { category: "Venue negotiation", rate: 0.08 },
  { category: "Catering & bar packages", rate: 0.06 },
  { category: "Photography bundle", rate: 0.04 },
  { category: "Floral & décor sourcing", rate: 0.03 },
  { category: "Accommodation block rates", rate: 0.03 },
];

// Destination premium multiplier (destination weddings have higher absolute savings)
function destinationMultiplier(destination: string): number {
  const lower = destination.toLowerCase();
  if (lower.includes("cancun") || lower.includes("mexico") || lower.includes("cabo")) return 1.4;
  if (lower.includes("europe") || lower.includes("italy") || lower.includes("france")) return 1.5;
  if (lower.includes("caribbean") || lower.includes("bahamas") || lower.includes("jamaica")) return 1.3;
  return 1.0;
}

export function computeAudit(input: AuditInput): AuditResult {
  const multiplier = destinationMultiplier(input.destination);

  const breakdown = CATEGORY_RATES.map(({ category, rate }) => ({
    category,
    saving: Math.round(input.budget * rate * multiplier),
  }));

  const estimatedSavings = breakdown.reduce((sum, b) => sum + b.saving, 0);
  const savingsPercent = Math.round((estimatedSavings / input.budget) * 100);

  const headline =
    estimatedSavings >= 5000
      ? `You could save $${estimatedSavings.toLocaleString()} on your wedding`
      : `We found $${estimatedSavings.toLocaleString()} in potential savings for you`;

  return { estimatedSavings, savingsPercent, breakdown, headline };
}
