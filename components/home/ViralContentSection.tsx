"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ViralContent {
  id: string;
  title: string;
  description: string | null;
  embed_url: string;
  thumbnail_url: string | null;
  sort_order: number;
}

// Hardcoded fallback until Supabase is populated or we add YouTube/social auto-fetch
// TODO: Replace with automated trending content from YouTube, Instagram, etc.
const FALLBACK_VIRAL_CONTENT: ViralContent[] = [
  {
    id: "fallback-1",
    title: "OpenClaw Use Cases That Are Actually INSANE (free templates + review)",
    description:
      "See how builders are using OpenClaw to automate workflows and ship faster.",
    embed_url: "https://www.youtube.com/watch?v=yIKxXRks4Jo",
    thumbnail_url: "https://img.youtube.com/vi/yIKxXRks4Jo/maxresdefault.jpg",
    sort_order: 0,
  },
  {
    id: "fallback-2",
    title: "The Ultimate Beginner's Guide to OpenClaw",
    description:
      "Real demos of OpenClaw customizations and agent capabilities.",
    embed_url: "https://www.youtube.com/watch?v=st534T7-mdE",
    thumbnail_url: "https://img.youtube.com/vi/st534T7-mdE/maxresdefault.jpg",
    sort_order: 1,
  },
  {
    id: "fallback-3",
    title: "OpenClaw is 100x better with this tool (Mission Control)",
    description:
      "Builders share their OpenClaw setups and breakthrough moments.",
    embed_url: "https://www.youtube.com/watch?v=RhLpV6QDBFE",
    thumbnail_url: "https://img.youtube.com/vi/RhLpV6QDBFE/maxresdefault.jpg",
    sort_order: 2,
  },
];

export function ViralContentSection() {
  const [content, setContent] = useState<ViralContent[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchYouTubeTitle(embedUrl: string): Promise<string | null> {
      try {
        const match = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (!match) return null;
        const res = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${match[1]}&format=json`
        );
        if (!res.ok) return null;
        const json = (await res.json()) as { title?: string };
        return json.title ?? null;
      } catch {
        return null;
      }
    }

    async function fetchContent() {
      const supabase = createClient();
      const { data } = await supabase
        .from("viral_content")
        .select("*")
        .order("sort_order", { ascending: true });
      const raw = (data && data.length > 0) ? data : FALLBACK_VIRAL_CONTENT;

      // Fetch real YouTube titles for each video
      const withTitles = await Promise.all(
        raw.map(async (item) => {
          const youtubeTitle = await fetchYouTubeTitle(item.embed_url);
          return youtubeTitle ? { ...item, title: youtubeTitle } : item;
        })
      );
      setContent(withTitles);
    }
    fetchContent();
  }, []);

  if (content.length === 0) {
    return (
      <section className="w-full py-24 lg:py-32 border-t border-border">
        <div className="max-w-content mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4">
              Viral OpenClaw Content
            </h2>
            <p className="text-text-muted max-w-prose mx-auto mb-12">
              Curated videos and stories showcasing what OpenClaw can do. Check
              back soon for new content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-background-elevated border border-border rounded-[0.75rem] p-6 h-48 animate-pulse"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-24 lg:py-32 border-t border-border">
      <div className="max-w-content mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4">
            <span className="text-brand-red">&gt;</span> Viral OpenClaw Content
          </h2>
          <p className="text-text-muted max-w-prose mb-12">
            See what builders are doing with OpenClaw. Real stories, real
            impact.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-background-elevated border border-border rounded-[0.75rem] p-6 hover:border-border-active hover:shadow-[0_0_20px_rgba(229,62,62,0.1)] transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedVideo(item.embed_url)}
              >
                <div className="aspect-video bg-background-subtle rounded-lg mb-4 overflow-hidden relative">
                  {item.thumbnail_url ? (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-red">
                      <svg
                        className="w-16 h-16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-muted line-clamp-2">
                  {item.description || "Watch this OpenClaw story."}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={
                selectedVideo.includes("youtube.com")
                  ? selectedVideo.replace("watch?v=", "embed/").split("&")[0]
                  : selectedVideo
              }
              title="Video"
              className="w-full h-full"
              allowFullScreen
            />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 bg-background-elevated/90 text-white p-2 rounded-full hover:bg-background-subtle transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
