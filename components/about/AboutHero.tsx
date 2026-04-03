"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const HIGHLIGHTS = [
  {
    text: "Free Mac Minis",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    text: "$17,500 in Prizes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9V4h12v5a6 6 0 01-12 0z" />
        <path d="M6 4H4v3a2 2 0 002 2m12-5h2v3a2 2 0 01-2 2M8 21h8M12 15v6" />
      </svg>
    ),
  },
  {
    text: "Build in a Community",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85" />
      </svg>
    ),
  },
  {
    text: "Network with Link Ventures",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98" />
      </svg>
    ),
  },
  {
    text: "VC Investment Opportunities",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 7l-8.5 8.5-5-5L2 17" />
        <path d="M16 7h6v6" />
      </svg>
    ),
  },
  {
    text: "Flown to Boston — All Expenses Paid",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
  },
];

const SCATTER_OFFSETS = [
  "",
  "",
  "",
  "",
  "",
  "",
];

export function AboutHero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(196,154,108,0.15), transparent 50%), radial-gradient(ellipse at bottom left, rgba(229,62,62,0.12), transparent 50%)",
        }}
      />

      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(229,62,62,0.25), transparent)",
        }}
        animate={{ y: ["10vh", "90vh"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
          repeatDelay: 1,
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      <div className="relative z-10 max-w-[75rem] mx-auto w-full flex flex-col items-center">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm md:text-base font-medium uppercase tracking-[0.15em] text-brand-red mb-4">
            About the Program
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter">
            <span className="flex flex-col items-center gap-1 md:flex-row md:justify-center md:gap-6">
              <span className="flex items-center gap-3 md:gap-6">
                <span>This is</span>
                <span
                  className="bg-clip-text text-transparent animate-gradient-flow"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #E53E3E 0%, #FF6B6B 15%, #FFFFFF 25%, #E53E3E 38%, #FF6B6B 52%, #22D3EE 65%, #FFFFFF 75%, #FF6B6B 85%, #E53E3E 100%)",
                    backgroundSize: "300% 100%",
                  }}
                >
                  ClawComp
                </span>
              </span>
              <Image
                src="/logos/Luke-edited-final-logo.png"
                alt="ClawComp"
                width={280}
                height={80}
                className="h-24 md:h-36 lg:h-[11.25rem] w-auto md:-ml-12"
              />
            </span>
          </h1>
        </motion.div>

        {/* Scattered highlight cards — 12-col grid: top row 4×3, bottom row 3×4 */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 w-full">
          {HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={item.text}
              className={`
                bg-background-elevated/80 border border-border rounded-[0.75rem] p-4 md:p-5
                hover:border-border-active hover:shadow-[0_0_20px_rgba(229,62,62,0.15)] hover:scale-[1.03]
                transition-all duration-300
                md:col-span-4
                ${SCATTER_OFFSETS[i]}
              `}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5 + i * 0.1,
              }}
            >
              <div className={`w-7 h-7 mb-3 ${"iconColor" in item && item.iconColor ? item.iconColor : "text-brand-red"}`}>{item.icon}</div>
              <p className="text-sm md:text-base font-bold text-text-primary leading-snug">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-text-muted">
            Scroll
          </span>
          <svg
            className="w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
