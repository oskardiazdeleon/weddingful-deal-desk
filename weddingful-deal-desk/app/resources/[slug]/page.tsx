import Link from "next/link";
import { notFound } from "next/navigation";
import { b2bArticles, getArticle, type B2BArticle } from "@/lib/b2b-articles";

const toId = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

function getExpandedSections(article: B2BArticle) {
  const base = article.sections;

  const implementationSection = {
    heading: "30-Day implementation plan",
    paragraphs: [
      `Treat rollout as an operations project, not just a tooling change. For ${article.audience.toLowerCase()}, the fastest wins usually come from clean ownership, one source of truth for scripts, and daily QA in week one.`,
      "Week 1 should focus on script lock, escalation rules, and data schema. Week 2 should run controlled traffic and score every call against qualification completeness. Week 3 should tighten handoff SLAs and follow-up cadence. Week 4 should turn those learnings into a stable baseline playbook.",
      "If you skip governance, performance drifts fast. Teams that run a standing weekly ops review generally keep response speed and lead quality far more consistent across shifts.",
    ],
    bullets: [
      "Week 1: script + routing + capture fields finalized",
      "Week 2: controlled launch with daily QA reviews",
      "Week 3: SLA tuning for escalation and follow-up",
      "Week 4: scorecard review and v2 optimization plan",
    ],
  };

  const kpiSection = {
    heading: "KPI scorecard to track weekly",
    paragraphs: [
      "Most teams improve by measuring fewer metrics more consistently. Start with speed, quality, and pipeline conversion. Make each KPI owned by one person and reviewed in the same weekly meeting.",
      "A practical baseline target is sub-10-minute first touch for high-intent inquiries, qualification completion above 80%, and same-day follow-up completion above 90%. Exact thresholds can vary by market and team size, but consistency matters more than perfect targets in month one.",
    ],
    bullets: [
      "Inquiry-to-first-touch response time",
      "Qualification completeness rate",
      "Demo booking rate from qualified inquiries",
      "Demo attendance rate",
      "Pilot start rate",
      "Closed-won cycle length",
    ],
  };

  if (base.length >= 4) return base;
  return [...base, implementationSection, kpiSection];
}

function getArticleFaq(article: B2BArticle) {
  return [
    {
      q: `How long does it take to operationalize ${article.tag.toLowerCase()}?`,
      a: "Most teams can launch a stable first version in 7 to 14 days if script ownership, routing logic, and SLA accountability are decided up front. Performance tuning usually continues for the first 30 days.",
    },
    {
      q: "What should be measured first to prove impact?",
      a: "Start with response speed, qualification completeness, and conversion into booked demos or consults. Those three metrics usually show movement fastest and tie directly to revenue outcomes.",
    },
    {
      q: "Do we need to replace our existing sales team process?",
      a: "No. The best deployments keep your core sales process and improve the front-end capture, prioritization, and handoff quality. The objective is fewer dropped opportunities and cleaner context for closers.",
    },
    {
      q: "How often should we update scripts and workflows?",
      a: "Review call logs weekly in month one, then move to a biweekly optimization cycle. Any major offer change, destination policy shift, or seasonality change should trigger a script refresh.",
    },
  ];
}

export function generateStaticParams() {
  return b2bArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Weddingful`,
    description: article.description,
  };
}

export default async function ResourceArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return notFound();

  const related = b2bArticles.filter((a) => a.slug !== article.slug).slice(0, 4);
  const sections = getExpandedSections(article);
  const faq = getArticleFaq(article);

  return (
    <main className="min-h-screen bg-white px-5 py-10 md:px-6 md:py-12">
      <article className="max-w-5xl mx-auto">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <span> · </span>
          <Link href="/resources" className="hover:text-rose-600">Resources</Link>
          <span> · </span>
          <span>{article.tag}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_280px] gap-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-rose-600 font-semibold mb-2">{article.tag}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">{article.title}</h1>
            <p className="text-sm text-gray-500 mb-8">Updated: {article.updated} · Audience: {article.audience}</p>

            <div className="max-w-none text-gray-700 leading-7">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-2">Key takeaways</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>{article.audience} should optimize for response speed, qualification quality, and handoff consistency first.</li>
                  <li>Run a 30-day rollout with weekly QA reviews to stabilize outcomes before scaling.</li>
                  <li>Track KPI movement weekly and iterate scripts on a fixed optimization cadence.</li>
                </ul>
              </div>

              <p className="mb-6">{article.intro}</p>

              {sections.map((s, i) => (
                <section key={i} id={toId(s.heading)} className="mb-8 scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">{s.heading}</h2>
                  {s.paragraphs.map((p, idx) => (
                    <p key={idx} className="mb-3">{p}</p>
                  ))}
                  {s.bullets?.length ? (
                    <ul className="list-disc pl-6 space-y-1">
                      {s.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <section id="faq" className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-semibold mb-3">Frequently asked questions</h2>
              <div className="space-y-4">
                {faq.map((item) => (
                  <div key={item.q}>
                    <h3 className="font-semibold text-gray-900">{item.q}</h3>
                    <p className="text-gray-700 mt-1">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 rounded-2xl border border-rose-200 bg-rose-50 p-6">
              <h2 className="text-xl font-semibold mb-2">Ready to test this with your team?</h2>
              <p className="text-gray-700 mb-4">Start a vendor pilot and hear your AI assistant flow live.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/vendors#vendor-form" className="rounded-full bg-rose-600 text-white px-5 py-2.5 font-semibold hover:bg-rose-700">
                  Start Vendor Pilot
                </Link>
                <Link href="/vendors/training-dashboard?lead=demo" className="rounded-full border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-white">
                  Try Demo Flow
                </Link>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Related resources</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link key={r.slug} href={`/resources/${r.slug}`} className="rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
                    <p className="text-xs text-rose-600 font-semibold uppercase tracking-wide mb-1">{r.tag}</p>
                    <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-2">On this page</h2>
              <ul className="text-sm text-gray-700 space-y-1">
                {sections.map((s, i) => (
                  <li key={i}>
                    <a href={`#${toId(s.heading)}`} className="hover:text-rose-600">{s.heading}</a>
                  </li>
                ))}
                <li>
                  <a href="#faq" className="hover:text-rose-600">Frequently asked questions</a>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 p-4 mt-4">
              <h3 className="text-sm font-semibold mb-2">Next step</h3>
              <p className="text-sm text-gray-600 mb-3">Run the sample assistant and see qualification flow in action.</p>
              <Link href="/vendors#vendor-form" className="text-sm font-semibold text-rose-600 hover:underline">
                Book Demo →
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
