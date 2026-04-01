"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const SOCIALS: { name: string; src: string; href: string; sizeClass?: string }[] = [
  {
    name: "YouTube",
    src: "/social-media-logos/Youtube_logo.png",
    href: "https://youtube.com/@clawcomp?si=k4H0CBPSNk3sbSFr",
  },
  {
    name: "X",
    src: "/social-media-logos/X_icon.png",
    href: "https://x.com/clawcompllc?s=21",
  },
  {
    name: "Instagram",
    src: "/social-media-logos/instagram_logo.png",
    href: "https://www.instagram.com/clawcompllc/",
    sizeClass: "w-[3.75rem] h-[3.75rem] md:w-[4.5rem] md:h-[4.5rem]",
  },
  {
    name: "TikTok",
    src: "/social-media-logos/tiktok-logo.png",
    href: "https://www.tiktok.com/@clawcompllc?_r=1&_t=ZT-95AUfIOfFyH",
    sizeClass: "w-14 h-14 md:w-16 md:h-16",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
} as const;

export function SocialMediaLinks() {
  return (
    <section className="w-full py-12 lg:py-16">
      <div className="max-w-content mx-auto px-6 lg:px-16">
        <motion.p
          className="text-center text-sm font-medium uppercase tracking-[0.15em] text-text-muted mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          Follow Us
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-10 md:gap-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {SOCIALS.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center justify-center ${social.sizeClass ?? "w-12 h-12 md:w-14 md:h-14"} rounded-xl opacity-60 hover:opacity-100 transition-opacity duration-300`}
              aria-label={`Follow us on ${social.name}`}
            >
              <Image
                src={social.src}
                alt={social.name}
                width={56}
                height={56}
                className="object-contain w-full h-full pointer-events-none"
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
