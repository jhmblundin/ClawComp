"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

function useCountUp(
  target: number,
  duration: number,
  shouldStart: boolean,
) {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!shouldStart || hasRun.current) return;
    hasRun.current = true;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target, duration, shouldStart]);

  return value;
}

const wordVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)", scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function PrizeReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(amountRef, { once: true, margin: "-15%" });
  const [countReady, setCountReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end 0.7"],
  });

  const glowOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);

  useEffect(() => {
    if (isInView) setCountReady(true);
  }, [isInView]);

  const count = useCountUp(10000, 2000, countReady);

  const formatAmount = useCallback((n: number) => {
    return n.toLocaleString("en-US");
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full pt-32 pb-2 lg:pt-44 lg:pb-4 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-150 h-150 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(229,62,62,0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: glowOpacity,
          }}
        />
        <motion.div
          className="absolute w-100 h-100 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(196,154,108,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
            top: "5%",
            left: "20%",
            opacity: glowOpacity,
          }}
        />
        <motion.div
          className="absolute w-87.5 h-87.5 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,107,107,0.16) 0%, transparent 70%)",
            filter: "blur(60px)",
            top: "10%",
            right: "15%",
            opacity: glowOpacity,
          }}
        />
      </div>

      <div className="relative flex flex-col items-center max-w-content mx-auto px-6 lg:px-16">
        <div ref={amountRef} className="relative">
          <motion.div
            className="absolute -inset-24 md:-inset-36 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(229,62,62,0.12) 0%, transparent 55%)",
              filter: "blur(40px)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={
              countReady
                ? { opacity: [0, 1, 0.5], scale: [0.5, 1.1, 1] }
                : {}
            }
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          <motion.h2
            className="relative text-7xl md:text-[9rem] lg:text-[12rem] font-extrabold tracking-tighter leading-none"
            initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)" }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : {}
            }
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="bg-clip-text text-transparent animate-prize-shimmer"
              style={{
                backgroundImage:
                  "linear-gradient(105deg, #E53E3E 0%, #FF6B6B 20%, #C49A6C 40%, #D4A574 50%, #FF6B6B 65%, #E53E3E 80%, #FF6B6B 100%)",
                backgroundSize: "200% 100%",
              }}
            >
              ${formatAmount(count)}+
            </span>
          </motion.h2>
        </div>

        <motion.div
          className="text-center mt-4 md:mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
          }}
        >
          {["In", "Prize", "Money"].map((word) => (
            <motion.span
              key={word}
              className="inline-block mr-[0.3em] text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase text-text-primary"
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        <div className="mt-10 md:mt-14 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 w-full">
          {([
            {
              place: "1st",
              amount: "$10,000",
              medalGradient: "radial-gradient(ellipse at 30% 25%, #F5DEB3 0%, #D4A574 20%, #C49A6C 40%, #A67C52 65%, #8B6914 100%)",
              rimGradient: "conic-gradient(from 0deg, #C49A6C, #F5DEB3, #D4A574, #8B6914, #C49A6C, #F5DEB3, #C49A6C)",
              glowColor: "rgba(196,154,108,0.35)",
              hoverGlow: "0 0 50px rgba(196,154,108,0.5), 0 0 100px rgba(196,154,108,0.2)",
              amountGradient: "linear-gradient(170deg, #FFF8E7 0%, #F5DEB3 30%, #C49A6C 60%, #F5DEB3 100%)",
              ribbonColor: "#C41E3A",
              ribbonDark: "#8B1528",
              shineClass: "medal-shine",
            },
            {
              place: "2nd",
              amount: "$5,000",
              medalGradient: "radial-gradient(ellipse at 30% 25%, #FFFFFF 0%, #E8E8E8 20%, #C0C0C0 40%, #A8A8A8 65%, #808080 100%)",
              rimGradient: "conic-gradient(from 0deg, #A8A8A8, #FFFFFF, #C0C0C0, #808080, #A8A8A8, #E8E8E8, #A8A8A8)",
              glowColor: "rgba(192,192,192,0.25)",
              hoverGlow: "0 0 50px rgba(192,192,192,0.45), 0 0 100px rgba(192,192,192,0.15)",
              amountGradient: "linear-gradient(170deg, #FFFFFF 0%, #E8E8E8 30%, #A8A8A8 60%, #E0E0E0 100%)",
              ribbonColor: "#2563EB",
              ribbonDark: "#1D4ED8",
              shineClass: "medal-shine-delayed-1",
            },
            {
              place: "3rd",
              amount: "$2,500",
              medalGradient: "radial-gradient(ellipse at 30% 25%, #E8C8A0 0%, #CD7F32 20%, #B87333 40%, #A0522D 65%, #8B4513 100%)",
              rimGradient: "conic-gradient(from 0deg, #B87333, #E8C8A0, #CD7F32, #8B4513, #B87333, #E8A862, #B87333)",
              glowColor: "rgba(205,127,50,0.25)",
              hoverGlow: "0 0 50px rgba(205,127,50,0.45), 0 0 100px rgba(205,127,50,0.15)",
              amountGradient: "linear-gradient(170deg, #F5DEB3 0%, #E8A862 30%, #B87333 60%, #E8C8A0 100%)",
              ribbonColor: "#16A34A",
              ribbonDark: "#15803D",
              shineClass: "medal-shine-delayed-2",
            },
          ] as const).map((prize, i) => (
            <motion.div
              key={prize.place}
              className="group relative flex flex-col items-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.18 }}
            >
              <div
                className="absolute top-16 w-8 h-24 md:w-10 md:h-28 -z-10"
                style={{
                  background: `linear-gradient(180deg, ${prize.ribbonColor} 0%, ${prize.ribbonDark} 100%)`,
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)",
                }}
              />

              <motion.div
                className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-0.75 cursor-pointer"
                style={{
                  background: prize.rimGradient,
                  boxShadow: `0 0 30px ${prize.glowColor}`,
                }}
                whileHover={{
                  scale: 1.12,
                  boxShadow: prize.hoverGlow,
                  rotate: -2,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div
                  className="relative w-full h-full rounded-full flex flex-col items-center justify-center overflow-hidden"
                  style={{ background: prize.medalGradient }}
                >
                  <div
                    className={`absolute inset-0 pointer-events-none ${prize.shineClass}`}
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 55%, transparent 100%)",
                      width: "60%",
                      height: "200%",
                      top: "-50%",
                      left: "0",
                    }}
                  />

                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/50 mb-0.5">
                    {prize.place}
                  </span>
                  <span
                    className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent drop-shadow-sm"
                    style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)" }}
                  >
                    {prize.amount}
                  </span>
                </div>
              </motion.div>

              <span
                className="mt-4 text-lg md:text-xl font-extrabold tracking-tight bg-clip-text text-transparent"
                style={{ backgroundImage: prize.amountGradient }}
              >
                {prize.amount}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-text-muted mt-1">
                {prize.place} Place
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-border mt-4 lg:mt-6" />
    </section>
  );
}
