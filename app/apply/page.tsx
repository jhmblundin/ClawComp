import { ApplicationForm } from "@/components/apply/ApplicationForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Apply | ClawComp",
  description: "Apply to the OpenClaw Builder Challenge",
};

export default function ApplyPage() {
  return (
    <main className="min-h-screen pt-24 pb-24">
      <div className="max-w-150 mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-2">
          Apply to ClawComp
        </h1>
        <p className="text-text-muted mb-12">
          University students: build revolutionary OpenClaw setups. Win Mac
          Minis, prizes, and connect with the Link ecosystem.
        </p>
        <ApplicationForm />
      </div>
    </main>
  );
}
