import Link from "next/link";
import { notFound } from "next/navigation";
import { b2bArticles, getArticle } from "@/lib/b2b-articles";

const toId = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

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
              <p className="mb-6">{article.intro}</p>

              {article.sections.map((s, i) => (
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
                {article.sections.map((s, i) => (
                  <li key={i}>
                    <a href={`#${toId(s.heading)}`} className="hover:text-rose-600">{s.heading}</a>
                  </li>
                ))}
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
