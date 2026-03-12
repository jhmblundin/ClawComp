"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string | null;
  source: string | null;
  excerpt: string | null;
}

export function NewsGrid() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const supabase = createClient();
      const { data } = await supabase
        .from("news_items")
        .select("*")
        .order("created_at", { ascending: false });
      setItems(data ?? []);
      setLoading(false);
    }
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-background-elevated border border-border rounded-[0.75rem] overflow-hidden h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-background-elevated border border-border rounded-[0.75rem] p-12 text-center">
        <p className="text-text-muted">
          No news items yet. Check back soon for OpenClaw stories and updates.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-background-elevated border border-border rounded-[0.75rem] overflow-hidden hover:border-border-active hover:shadow-[0_0_20px_rgba(229,62,62,0.1)] transition-all duration-300"
        >
          <div className="aspect-video bg-background-subtle relative overflow-hidden">
            {item.thumbnail_url ? (
              <Image
                src={item.thumbnail_url}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-red">
                <svg
                  className="w-16 h-16 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-6">
            {item.source && (
              <span className="text-xs font-medium uppercase tracking-wider text-brand-red mb-2 block">
                {item.source}
              </span>
            )}
            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-brand-coral transition-colors">
              {item.title}
            </h3>
            {item.excerpt && (
              <p className="text-sm leading-relaxed text-text-muted line-clamp-2">
                {item.excerpt}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
