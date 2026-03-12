"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const SPONSORS = [
  { name: "Link Ventures", src: "/logos/sponsors/Link_logo_2.png" },
  { name: "OpenClaw", src: "/logos/sponsors/openclaw_logo.png" },
  { name: "Sponsor 1", src: "/logos/sponsors/placeholder-1.svg" },
  { name: "Sponsor 2", src: "/logos/sponsors/placeholder-2.svg" },
  { name: "Sponsor 3", src: "/logos/sponsors/placeholder-3.svg" },
];

export function SponsorWheel() {
  const duplicated = [...SPONSORS, ...SPONSORS];

  return (
    <section className="w-full py-16 lg:py-24 border-t border-border overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mb-2">
          Program Sponsors
        </h2>
        <p className="text-text-muted text-sm">Proudly supported by</p>
      </motion.div>
      <div className="relative">
        <div className="flex gap-16 sponsor-scroll-animation">
          {duplicated.map((sponsor, i) => (
            <div
              key={`${sponsor.name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center w-32 h-16 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={sponsor.src}
                alt={sponsor.name}
                width={128}
                height={64}
                className="object-contain max-h-12 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
