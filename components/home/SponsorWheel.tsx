"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const SPONSORS = [
  { name: "Link Ventures", src: "/logos/white-bg-removed-Link-logo.png", href: "https://www.linkventures.com/", size: "default" as const },
  { name: "Talvy", src: "/logos/sponsors/Talvy-logo.png", href: "https://talvy.com/", size: "large" as const },
  { name: "Blitzy", src: "/logos/sponsors/blitzy-logo.png", href: "https://blitzy.com/", size: "default" as const },
  { name: "VoiceRun", src: "/logos/sponsors/voicerun-logo.png", href: "https://voicerun.ai/", size: "medium" as const },
  { name: "Link Ventures", src: "/logos/white-bg-removed-Link-logo.png", href: "https://www.linkventures.com/", size: "default" as const },
  { name: "Talvy", src: "/logos/sponsors/Talvy-logo.png", href: "https://talvy.com/", size: "large" as const },
  { name: "Blitzy", src: "/logos/sponsors/blitzy-logo.png", href: "https://blitzy.com/", size: "default" as const },
  { name: "VoiceRun", src: "/logos/sponsors/voicerun-logo.png", href: "https://voicerun.ai/", size: "medium" as const },
];

const AUTO_SCROLL_SPEED = -1;
const FRICTION = 0.96;
const MIN_VELOCITY = 0.3;
const DRAG_THRESHOLD = 5;

export function SponsorWheel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const duplicated = [...SPONSORS, ...SPONSORS];

  const offsetRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const dragDistanceRef = useRef(0);
  const velocityRef = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const animFrameRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.4"],
  });

  const headerY = useTransform(scrollYProgress, [0.3, 1], [-60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      const frameScale = dt / 16.67;

      if (!isDragging.current) {
        if (Math.abs(velocityRef.current) > MIN_VELOCITY) {
          offsetRef.current += velocityRef.current * frameScale;
          velocityRef.current *= FRICTION;
        } else {
          velocityRef.current = 0;
          offsetRef.current += AUTO_SCROLL_SPEED * frameScale;
        }
      }

      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        while (offsetRef.current < -halfWidth) offsetRef.current += halfWidth;
        while (offsetRef.current > 0) offsetRef.current -= halfWidth;
      }

      track.style.transform = `translateX(${offsetRef.current}px)`;
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offsetRef.current;
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const now = performance.now();
    const dx = e.clientX - lastPointerX.current;
    const dt = now - lastPointerTime.current;

    if (dt > 0) {
      velocityRef.current = (dx / dt) * 16.67;
    }

    dragDistanceRef.current += Math.abs(dx);
    offsetRef.current = dragStartOffset.current + (e.clientX - dragStartX.current);
    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    if (dragDistanceRef.current > DRAG_THRESHOLD) e.preventDefault();
  }, []);

  return (
    <section ref={sectionRef} className="w-full pt-16 lg:pt-24 overflow-hidden">
      <motion.div
        className="flex flex-col items-center pt-6 pb-2"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary mb-1">
          Program Sponsors
        </h2>
        <p className="text-text-muted text-sm mb-3">Proudly supported by</p>
      </motion.div>

      <motion.div
        className="relative pb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-16 cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {duplicated.map((sponsor, i) => (
            <a
              key={`${sponsor.name}-${i}`}
              href={sponsor.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center justify-center w-48 h-16 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              draggable={false}
              onClick={handleLinkClick}
            >
              <Image
                src={sponsor.src}
                alt={sponsor.name}
                width={sponsor.size === "large" ? 320 : sponsor.size === "medium" ? 190 : 128}
                height={sponsor.size === "large" ? 96 : sponsor.size === "medium" ? 56 : 64}
                className={`object-contain w-auto pointer-events-none ${
                  sponsor.size === "large" ? "max-h-24" : sponsor.size === "medium" ? "max-h-14" : "max-h-12"
                }`}
                draggable={false}
              />
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
