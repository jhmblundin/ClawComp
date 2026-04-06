"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const TYPEWRITER_LINES = [
  "Join our community of University students innovating with OpenClaw.",
  "Win free Mac Minis, cash prizes, and network with the Link Ventures ecosystem.",
];

function useTypewriter(
  lines: string[],
  charSpeed = 45,
  initialDelay = 800,
  linePause = 600,
) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((r) => setTimeout(r, ms));

    async function run() {
      await sleep(initialDelay);
      if (cancelled) return;
      setStarted(true);

      let output = "";
      for (let l = 0; l < lines.length; l++) {
        if (l > 0) {
          output += "\n";
          setDisplayed(output);
          await sleep(linePause);
        }
        for (const char of lines[l]) {
          if (cancelled) return;
          output += char;
          setDisplayed(output);
          await sleep(charSpeed);
        }
      }
    }

    run();
    return () => { cancelled = true; };
  }, [lines, charSpeed, initialDelay, linePause]);

  return { displayed, started };
}

export function Hero() {
  const { displayed, started } = useTypewriter(TYPEWRITER_LINES);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 pt-18 pb-38 overflow-hidden">
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
        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent animate-gradient-flow"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #E53E3E 0%, #FF6B6B 15%, #FFFFFF 25%, #E53E3E 38%, #FF6B6B 52%, #22D3EE 65%, #FFFFFF 75%, #FF6B6B 85%, #E53E3E 100%)",
            backgroundSize: "300% 100%",
          }}
        >
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
        <div className="text-base md:text-lg leading-relaxed text-text-primary mb-8 max-w-prose font-mono min-h-[4.5rem] whitespace-pre-wrap">
          <span className="text-text-primary/40 mr-1">{">"}</span>
          {started && displayed}
          <span className="inline-block w-[0.55em] h-[1.1em] bg-text-primary align-middle ml-px animate-[blink_1s_step-end_infinite]" />
        </div>
        <div className="flex justify-center items-stretch gap-4">
          <a
            href="https://discord.gg/sBNNXj5V"
            target="_blank"
            rel="noopener noreferrer"
            className="group/discord relative inline-flex items-center justify-center gap-2 w-[170px] bg-[#1a1a2e] text-white font-medium rounded-lg text-base uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(88,100,241,0.4)]"
          >
            <span className="absolute inset-0 bg-[#5864f1] translate-y-full group-hover/discord:translate-y-0 transition-transform duration-300 ease-out" />
            <Image
              src="/social-media-logos/discord-logo-white.png"
              alt="Discord"
              width={31}
              height={31}
              className="relative z-10 w-[31px] h-[31px] object-contain"
            />
            <span className="relative z-10"> Discord</span>
          </a>
          <Link
            href="/apply"
            className="group/apply relative inline-flex items-center justify-center w-[170px] bg-brand-red text-white font-medium py-4.5 rounded-lg text-base uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,62,62,0.5)] hover:scale-105"
          >
            <span className="absolute inset-0 opacity-0 group-hover/apply:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_70%)]" />
            <span className="absolute inset-0 bg-brand-red-hover opacity-0 group-hover/apply:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Apply Now</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
