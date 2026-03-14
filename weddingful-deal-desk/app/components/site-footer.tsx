import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-100 py-10 px-6 text-sm text-gray-500">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} Weddingful. B2B AI voice and lead intelligence for venue teams.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/vendors" className="hover:text-rose-600">Voice Concierge</Link>
          <Link href="/brand/dashboard" className="hover:text-rose-600">Lead Intelligence</Link>
          <Link href="/resources" className="hover:text-rose-600">Resources</Link>
          <Link href="/vendors#vendor-form" className="hover:text-rose-600">Book Demo</Link>
        </div>
      </div>
    </footer>
  );
}
