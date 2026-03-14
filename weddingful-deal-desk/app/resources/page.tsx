import Link from "next/link";
import { b2bArticles } from "@/lib/b2b-articles";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Weddingful Resources</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Operator content for venue sales teams</h1>
        <p className="text-gray-500 mb-8">Playbooks, benchmarks, and implementation guides for AI voice concierge and lead conversion.</p>

        <div className="grid gap-4">
          {b2bArticles.map((a) => (
            <Link key={a.slug} href={`/resources/${a.slug}`} className="rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition block">
              <p className="text-xs text-rose-600 font-semibold uppercase tracking-wide mb-2">{a.tag}</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{a.title}</h2>
              <p className="text-sm text-gray-500">{a.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
