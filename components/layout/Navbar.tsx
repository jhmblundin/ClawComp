"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/founders", label: "Founders" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-content mx-auto px-6 lg:px-16 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center lg:-ml-12">
          <Image
            src="/logos/Luke-edited-final-logo.png"
            alt="Link Ventures x OpenClaw"
            width={280}
            height={80}
            className="h-12 w-auto sm:h-16"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-widest text-text-primary hover:text-brand-coral transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="bg-brand-red hover:bg-brand-red-hover text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            Apply
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${
              mobileOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${
              mobileOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-background/95 backdrop-blur-lg border-b border-border ${
          mobileOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0 border-b-0"
        }`}
      >
        <div className="flex flex-col items-center gap-6 py-8 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-widest text-text-primary hover:text-brand-coral transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="bg-brand-red hover:bg-brand-red-hover text-white font-medium px-8 py-3 rounded-lg transition-colors text-sm mt-2"
          >
            Apply
          </Link>
        </div>
      </div>
    </nav>
  );
}
