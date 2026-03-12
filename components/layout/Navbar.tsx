"use client";

import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-content mx-auto px-6 lg:px-16 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/sponsors/openclaw_logo.png"
            alt="OpenClaw"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <span className="text-brand-red font-bold text-sm hidden sm:inline">
            ClawComp
          </span>
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
