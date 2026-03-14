export type B2BArticle = {
  slug: string;
  tag: string;
  title: string;
  description: string;
  updated: string;
  audience: string;
  intro: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const b2bArticles: B2BArticle[] = [
  {
    slug: "ai-call-assistant-for-wedding-venues",
    tag: "B2B Operator Guide",
    title: "AI Call Assistant for Wedding Venues: 2026 Implementation Guide",
    description: "How venue teams use AI voice to increase answer rates, qualify faster, and improve wedding booking conversion.",
    updated: "March 2026",
    audience: "Resort and venue sales teams",
    intro: "Wedding teams lose revenue when inquiry calls are missed or handled inconsistently. AI voice workflows create 24/7 coverage and cleaner handoff to sales.",
    sections: [
      { heading: "Why venues adopt AI call handling", paragraphs: ["Most missed opportunities happen outside business hours. Couples call while actively comparing options and drop off quickly if no one answers."] , bullets:["Reduce missed inbound calls","Standardize qualification quality","Improve follow-up speed","Prioritize high-intent leads"]},
      { heading: "What to capture on each call", paragraphs: ["Every call should produce a structured lead profile for sales."], bullets:["Date window","Guest count","Destination intent","Budget band","Consent + contact details"]},
      { heading: "7-day rollout", paragraphs:["Launch with script + escalation rules, then optimize from first-week call logs."], bullets:["Define script","Enable AI line","Route high intent","Train SLA","Review logs"]}
    ]
  },
  {
    slug: "wedding-inquiry-response-time-benchmark",
    tag: "Benchmark",
    title: "Wedding Inquiry Response-Time Benchmark for Venue Teams",
    description: "Response-time ranges that impact wedding conversion and how to close the speed gap with automation.",
    updated: "March 2026",
    audience: "Venue and hospitality operators",
    intro: "Response speed has a direct impact on conversion. Teams that contact high-intent couples quickly win more bookings.",
    sections: [
      { heading: "Where teams lose speed", paragraphs:["Manual triage, after-hours gaps, and unclear ownership slow down follow-up."]},
      { heading: "Targets to run weekly", paragraphs:["Use operational targets to create consistency across shifts."], bullets:["First touch in under 10 minutes","Same-day follow-up completion","High-intent escalation in real time"]}
    ]
  },
  {
    slug: "voice-concierge-pricing-for-resorts",
    tag: "Pricing",
    title: "Voice Concierge Pricing for Resorts: Base + Overage Model",
    description: "How to price AI voice services without margin leakage using included-minute and overage structures.",
    updated: "March 2026",
    audience: "Resort sales and revenue leaders",
    intro: "A base subscription plus usage overage protects margin while keeping buyer pricing simple.",
    sections: [
      { heading: "Recommended plan structure", paragraphs:["Use starter, growth, and premium plans with included minute buckets and clear overage rates."]},
      { heading: "Margin controls", paragraphs:["Track connected minutes, AI processing, and support overhead in one meter to avoid silent margin erosion."]}
    ]
  },
  {
    slug: "wedding-call-qualification-script-template",
    tag: "Template",
    title: "Wedding Call Qualification Script Template for Venue Teams",
    description: "A practical call script framework to capture high-value wedding lead data in under four minutes.",
    updated: "March 2026",
    audience: "Sales coordinators and call teams",
    intro: "Qualification scripts should be short, structured, and optimized for handoff quality.",
    sections: [{ heading:"Core script blocks", paragraphs:["Opening, intent validation, budget framing, timeline capture, and next-step confirmation."], bullets:["Greeting","Event profile","Budget band","Decision timeline","Escalation"] }]
  },
  {
    slug: "ai-vs-outsourced-call-center-weddings",
    tag: "Comparison",
    title: "AI Voice Assistant vs Outsourced Call Center for Wedding Inquiries",
    description: "Compare speed, quality, cost structure, and scalability for wedding inquiry handling.",
    updated: "March 2026",
    audience: "Operations and revenue teams",
    intro: "Both options can work, but they optimize for different goals.",
    sections: [{ heading:"Decision criteria", paragraphs:["Choose based on response speed, qualification consistency, and margin profile over 90 days."] }]
  },
  {
    slug: "lead-intelligence-for-wedding-venues",
    tag: "Lead Intelligence",
    title: "Lead Intelligence for Wedding Venues: What Sales Teams Need to See",
    description: "Which enriched fields improve prioritization and follow-up outcomes for venue sales teams.",
    updated: "March 2026",
    audience: "Venue sales leaders",
    intro: "Lead intelligence helps teams prioritize who to call first and how to tailor outreach.",
    sections: [{ heading:"Must-have profile fields", paragraphs:["Intent score, budget confidence, destination fit, and response priority should be visible at a glance."] }]
  },
  {
    slug: "wedding-venue-pilot-onboarding-checklist",
    tag: "Checklist",
    title: "Wedding Venue Pilot Onboarding Checklist (7 Days)",
    description: "A launch checklist to go from zero to live AI inquiry handling in one week.",
    updated: "March 2026",
    audience: "Pilot implementation teams",
    intro: "Short pilots work when ownership and milestones are explicit.",
    sections: [{ heading:"Onboarding sequence", paragraphs:["Assign owner, lock script, run simulations, launch controlled traffic, and review first-week outcomes."] }]
  },
  {
    slug: "cruise-wedding-inquiry-automation",
    tag: "Cruise Segment",
    title: "Cruise Wedding Inquiry Automation: Routing High-Intent Calls",
    description: "How cruise wedding teams can automate inquiry capture and reduce handoff delays.",
    updated: "March 2026",
    audience: "Cruise wedding program managers",
    intro: "High-volume inquiry environments benefit from strict qualification and routing logic.",
    sections: [{ heading:"Routing model", paragraphs:["Segment by destination, ship availability, and budget to route to the right sales pod immediately."] }]
  },
  {
    slug: "wedding-sales-sla-framework",
    tag: "Operations",
    title: "Wedding Sales SLA Framework for Faster Follow-Up",
    description: "Define practical service-level agreements that improve conversion from inquiry to booked consultation.",
    updated: "March 2026",
    audience: "Sales operations",
    intro: "SLA clarity removes follow-up ambiguity and improves accountability.",
    sections: [{ heading:"Core SLAs", paragraphs:["First response SLA, escalation SLA, and close-the-loop SLA should be measured daily."] }]
  },
  {
    slug: "wedding-venue-roi-calculator-guide",
    tag: "ROI",
    title: "How to Use a Wedding Venue ROI Calculator for AI Voice Programs",
    description: "Model missed-call recovery, qualification uplift, and follow-up speed to estimate revenue impact.",
    updated: "March 2026",
    audience: "Revenue and growth teams",
    intro: "ROI models help teams decide if pilot economics justify scale.",
    sections: [{ heading:"Inputs that matter", paragraphs:["Call volume, missed-call rate, qualified lead rate, and close rate change are the minimum required inputs."] }]
  },
  {
    slug: "venue-operator-faq-ai-voice",
    tag: "FAQ",
    title: "Venue Operator FAQ: AI Voice for Wedding Inquiries",
    description: "Answers to common operational, compliance, and implementation questions from venue teams.",
    updated: "March 2026",
    audience: "Operators evaluating pilots",
    intro: "Clear answers remove adoption friction for ops and legal stakeholders.",
    sections: [{ heading:"Top questions", paragraphs:["How fast to deploy, how escalation works, how usage is billed, and how data access is controlled."] }]
  },
  {
    slug: "destination-cluster-go-to-market-weddings",
    tag: "GTM",
    title: "Destination Cluster Go-To-Market for Wedding Inquiry Programs",
    description: "How to roll out voice and lead-intelligence programs by destination cluster for faster scaling.",
    updated: "March 2026",
    audience: "Regional growth teams",
    intro: "Clustered rollouts reduce operational complexity and speed up learning loops.",
    sections: [{ heading:"Cluster strategy", paragraphs:["Start with one destination pod, validate conversion lift, then replicate to adjacent markets."] }]
  }
];

export function getArticle(slug: string) {
  return b2bArticles.find((a) => a.slug === slug);
}
