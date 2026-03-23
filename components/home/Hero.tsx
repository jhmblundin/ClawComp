"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at top right, rgba(196,154,108,0.15), transparent 50%), radial-gradient(ellipse at bottom left, rgba(229,62,62,0.08), transparent 50%)`,
        }}
      />
      <motion.div
        className="relative z-10 flex flex-col items-center max-w-[37.5rem] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-6"
        >
          <Image
            src="/logos/Luke-edited-final-logo.png"
            alt="Link Ventures x OpenClaw"
            width={480}
            height={168}
            className="h-[11.55rem] w-auto"
          />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-primary mb-6">
          ClawComp
        </h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <Link
            href="https://www.linkventures.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/logos/white-bg-removed-Link-logo.png"
              alt="Link Ventures"
              width={96}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
          <span className="text-text-muted text-xl">×</span>
          <Link
            href="https://openclaw.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="/logos/OpenClaw-no-bg.png"
              alt="OpenClaw"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
        </div>
        <p className="text-base md:text-lg leading-relaxed text-text-muted mb-8 max-w-prose">
          University students compete to build the most revolutionary OpenClaw
          setups. Win Mac Minis, cash prizes, and networking with the Link
          ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/apply"
            className="bg-brand-red hover:bg-brand-red-hover text-white font-medium px-8 py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wider"
          >
            Apply Now
          </Link>
          <Link
            href="/news"
            className="border border-border hover:border-border-active text-text-primary font-medium px-8 py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wider"
          >
            Explore Stories
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
