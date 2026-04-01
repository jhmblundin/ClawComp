"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SponsorCard, type Sponsor } from "./SponsorCard";

const SPONSORS: Sponsor[] = [
  {
    name: "Blitzy",
    logo: "/logos/sponsors/blitzy-logo.png",
    href: "https://blitzy.com/",
    blurb:
      "One of the fastest-growing startups in Massachusetts history. Achieved #1 on SWE-bench Verified and SWE-bench Pro.",
    description:
      "Blitzy is pioneering autonomous software engineering with its System 2 AI platform — a multi-agent architecture that reasons, plans, and writes production-quality code at scale. By topping both SWE-bench Verified and SWE-bench Pro (surpassing GPT 5.4 by 8.8 points), Blitzy has demonstrated that AI agents can match and exceed top-tier human developers on real-world codebases. For ClawComp, Blitzy provides critical security documentation for OpenClaw deployments and continuous safety monitoring, ensuring every team can build with confidence.",
  },
  {
    name: "Talvy",
    logo: "/logos/sponsors/Talvy-logo.png",
    href: "https://talvy.com/",
    logoSize: "large",
    blurb:
      "Most qualified candidates are invisible in hiring because their strengths don't translate to paper. Talvy makes talent visible.",
    description:
      "We're partnering with Talvy to build an online community for ClawComp. Talvy is the video-first professional network where founders, operators, builders, and GTM professionals showcase who they actually are — not just what fits in a resume template. Video reveals what paper never could: how you think, how you communicate, and whether you're the kind of person a team actually wants.",
  },
  {
    name: "Link Ventures",
    logo: "/logos/sponsors/Link_logo_2.png",
    href: "https://www.linkventures.com/",
    blurb:
      "The venture capital firm behind ClawComp — investing in frontier technology and the builders who push it forward.",
    description:
      "Link Ventures is a Boston-based venture capital firm with a portfolio spanning AI, cybersecurity, fintech, and deep tech. They don't just write checks — they build ecosystems. Link Studios, their in-house incubator at One Kendall Square in Cambridge, provides founders with office space, mentorship, and direct access to a network of technical operators and industry leaders. ClawComp is the flagship program of Link Studios, designed to identify the next generation of AI builders and fast-track them into the Link ecosystem with Mac Minis, cash prizes, and a fully-funded summit in Boston.",
  },
  {
    name: "VoiceRun",
    logo: "/logos/sponsors/voicerun-logo.png",
    href: "https://voicerun.ai/",
    blurb:
      "Voice-powered AI tools that let you build, command, and ship — all by speaking.",
    description:
      "VoiceRun is redefining how developers interact with their tools by bringing natural voice control to the entire development workflow. From dictating code to orchestrating complex CI/CD pipelines with spoken commands, VoiceRun removes friction and keeps builders in flow. As a ClawComp sponsor, VoiceRun is backing the next wave of builders who think faster than they type.",
  },
];

export function SponsorsGrid() {
  return (
    <section className="relative w-full py-16 lg:py-24">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(196,154,108,0.08), transparent 50%), radial-gradient(ellipse at bottom left, rgba(229,62,62,0.06), transparent 50%)",
        }}
      />

      <div className="relative max-w-content mx-auto px-6 lg:px-16">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {SPONSORS.map((sponsor, i) => (
            <SponsorCard key={sponsor.name} sponsor={sponsor} index={i} />
          ))}
        </div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-text-muted text-sm mb-4">
            Interested in sponsoring ClawComp?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,62,62,0.3)] text-sm uppercase tracking-wider"
          >
            Get In Touch
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
