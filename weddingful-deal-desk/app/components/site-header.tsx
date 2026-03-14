"use client";

import Link from "next/link";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="text-2xl font-bold tracking-tight text-rose-600 leading-none">
          Weddingful
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link href="/#how" className="hover:text-rose-600">How it works</Link>
          <Link href="/#pricing" className="hover:text-rose-600">Pricing</Link>
          <Link href="/resources" className="hover:text-rose-600">Resources</Link>
          <Link href="/#faq" className="hover:text-rose-600">FAQs</Link>
          <Link href="/vendors#vendor-form" className="rounded-full bg-rose-600 text-white px-4 py-1.5 hover:bg-rose-700">
            Book Demo
          </Link>
        </nav>

        <button
          className="md:hidden rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 px-4 pb-4 pt-2 bg-white">
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/#how" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-gray-50 text-gray-700">How it works</Link>
            <Link href="/#pricing" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-gray-50 text-gray-700">Pricing</Link>
            <Link href="/resources" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-gray-50 text-gray-700">Resources</Link>
            <Link href="/#faq" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:bg-gray-50 text-gray-700">FAQs</Link>
            <Link href="/vendors#vendor-form" onClick={() => setOpen(false)} className="mt-1 rounded-full bg-rose-600 text-white px-4 py-2 text-center font-semibold hover:bg-rose-700">
              Book Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
