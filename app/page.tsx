import { Hero } from "@/components/home/Hero";
import { ViralContentSection } from "@/components/home/ViralContentSection";
import { SponsorWheel } from "@/components/home/SponsorWheel";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ViralContentSection />
      <SponsorWheel />
    </main>
  );
}
