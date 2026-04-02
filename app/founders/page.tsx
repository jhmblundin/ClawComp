import Image from "next/image";
import { FoundersHero } from "@/components/founders/FoundersHero";
import { FounderCard } from "@/components/founders/FounderCard";

export const metadata = {
  title: "The Founders | ClawComp",
  description:
    "Meet Jack Blundin, Yash Bolishetti, and Luke Tsiaras — the three university students behind ClawComp.",
};

const founders = [
  {
    name: "Jack Blundin",
    title: "Computer Science & AI, Northeastern University",
    image: "/founders/jack_blundin.png",
    linkedin: "https://www.linkedin.com/in/jack-blundin-a776ab243",
    imageClassName: "object-cover object-top",
    bio: (
      <>
        <p>
          Jack is a Computer Science student at Northeastern University with
          expertise in AI systems, particularly in the application and
          orchestration of LLMs. In his free time, Jack is a vibe-coding
          wizard&mdash;always pushing the bounds of what he can build from
          simply researching, and prompting LLMs to do the
          line-by-line grunge work.
        </p>
        <p>
          Jack is experienced in LLM benchmarking from his work at{" "}
          <a href="https://blitzy.com/" target="_blank" rel="noopener noreferrer">
            Blitzy
          </a>
          , and is a published researcher on{" "}
          <a
            href="https://paper.blitzy.com/blitzy_system_2_ai_platform_topping_swe_bench_verified.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            the paper
          </a>{" "}
          coinciding the company&rsquo;s first-place score on SWE-bench
          Verified. He became an open-source collaborator to SWE-bench Verified
          during this initiative. More recently, his engineering research team
          achieved first place on{" "}
          <a
            href="https://blitzy.com/blog/blitzy-scores-a-record-66-5-on-swe-bench-pro"
            target="_blank"
            rel="noopener noreferrer"
          >
            SWE-bench Pro
          </a>
          , surpassing GPT 5.4 by 8.8 points.
        </p>
        <p>
          Jack is a co-founder of ClawComp LLC and the primary architect of the
          program&rsquo;s operational infrastructure. He forged the original
          partnership with Link Ventures, works with sponsor companies to bring
          new enhancements to the team&rsquo;s OpenClaw setup, and promotes the
          program throughout all of Boston. Jack has spent 100+ hours working
          hands-on with OpenClaw and has still hardly scratched the surface of
          what he knows is possible. He is currently working to build Jarvis
          from Iron Man with{" "}
          <a href="https://voicerun.com/" target="_blank" rel="noopener noreferrer">
            Voicerun&rsquo;s
          </a>{" "}
          agent technology. Jack is also a co-host of{" "}
          <a
            href="https://youtu.be/Gm4xbihp9Gw?si=UvWWCo5cQ0rGR-6B"
            target="_blank"
            rel="noopener noreferrer"
          >
            <em>Promptcast</em>
          </a>
          , a podcast dedicated to making frontier AI research and developments
          accessible to the 10&ndash;25 age demographic. At Northeastern, Jack
          likes to surround himself with builders and entrepreneurs within REV.
        </p>
      </>
    ),
  },
  {
    name: "Yash Bolishetti",
    title: "Computer Science & Architecture, University of Virginia",
    image: "/founders/yash_bolishetti.png",
    linkedin: "https://www.linkedin.com/in/yash-bolishetti-316430314/",
    imageClassName: "object-cover object-[center_20%]",
    bio: (
      <>
        <p>
          Yash is pursuing a dual degree in Computer Science and Architecture at
          the University of Virginia&mdash;a combination that reflects his
          interest in how complex systems are designed, structured, and built to
          last. As a co-founder of ClawComp, Yash brings both engineering rigor
          and a systems-level perspective to the program&rsquo;s design, from
          application architecture to how teams are structured and evaluated.
        </p>
        <p>
          His interdisciplinary background makes him particularly attuned to the
          intersection of technical execution and design thinking&mdash;two
          skills that are increasingly critical as AI agents move from research
          demos to real-world deployment. Yash leads recruitment through
          UVA&rsquo;s Theta Chi fraternity and the Indian Student Association,
          and is a co-host of <em>Promptcast</em>, where he contributes a sharp,
          analytically grounded perspective on AI developments and their broader
          implications.
        </p>
      </>
    ),
  },
  {
    name: "Luke Tsiaras",
    title: "Business and Computer Science, University of Rochester",
    image: "/founders/luke_tsiaras.png",
    linkedin: "https://www.linkedin.com/in/luke-tsiaras-792418354/",
    imageClassName: "object-cover object-top",
    bio: (
      <>
        <p>
          Luke is a Business student at the University of Rochester with a
          strong interest in entrepreneurship, emerging technology, and the
          organizational dynamics of high-growth companies. As a co-founder of
          ClawComp, he leads the program&rsquo;s go-to-market
          thinking&mdash;from structuring sponsor relationships and prize
          incentives to shaping how the competition is positioned to attract
          top-tier university talent.
        </p>
        <p>
          Luke&rsquo;s business background provides an important counterbalance
          within the founding team: while the technical scope of ClawComp is
          ambitious, Luke ensures the program is structured in a way that is
          sustainable, scalable, and compelling to the investors, sponsors, and
          institutional partners who make it possible. He drives recruitment
          through the University of Rochester&rsquo;s computer science community
          and Sigma Epsilon fraternity. Luke is also a co-host of{" "}
          <em>Promptcast</em>, where he focuses on translating complex AI
          developments into clear, accessible narratives for a younger audience.
        </p>
      </>
    ),
  },
];

export default function FoundersPage() {
  return (
    <main className="min-h-screen pb-24">
      <FoundersHero />

      <div className="max-w-content mx-auto px-6 lg:px-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {founders.map((founder, i) => (
            <FounderCard key={founder.name} index={i}>
              <div className="flex flex-col items-center mb-6">
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-40 h-40 mb-4 rounded-full overflow-hidden border-2 border-border hover:border-brand-red transition-colors duration-300 block"
                >
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className={founder.imageClassName}
                    sizes="160px"
                  />
                </a>
                <h2 className="text-lg font-bold text-text-primary">
                  {founder.name}
                </h2>
                <p className="text-sm font-medium text-brand-red text-center">
                  {founder.title}
                </p>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-text-muted [&_a]:text-brand-coral [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-red [&_a]:transition-colors">
                {founder.bio}
              </div>
            </FounderCard>
          ))}
        </div>
      </div>
    </main>
  );
}
