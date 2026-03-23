"use client";

import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-content mx-auto px-6 lg:px-16 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center -ml-12 ">
          <Image
            src="/logos/Luke-edited-final-logo.png"
            alt="Link Ventures x OpenClaw"
            width={280}
            height={80}
            className="h-16 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-widest text-text-primary hover:text-brand-coral transition-colors"
          >
            Home
          </Link>
          <Link
            href="/news"
            className="text-xs font-medium uppercase tracking-widest text-text-primary hover:text-brand-coral transition-colors"
          >
            News
          </Link>
          <Link
            href="/apply"
            className="bg-brand-red hover:bg-brand-red-hover text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            Apply
          </Link>
        </div>
      </div>
    </nav>
  );
}
