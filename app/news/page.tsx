import { NewsGrid } from "@/components/news/NewsGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "OpenClaw News & Stories | ClawComp",
  description:
    "Articles, anecdotes, GitHub updates, and news about OpenClaw.",
};

export default function NewsPage() {
  return (
    <main className="min-h-screen pt-24 pb-24">
      <div className="max-w-content mx-auto px-6 lg:px-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-2">
          OpenClaw News & Stories
        </h1>
        <p className="text-text-muted mb-12 max-w-prose">
          Cool articles, anecdotes, GitHub updates, and news about what
          OpenClaw can do.
        </p>
        <NewsGrid />
      </div>
    </main>
  );
}
