"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TeamModal } from "./TeamModal";

type Step = "email" | "basic" | "team" | "questions" | "done";

export function ApplicationForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [inviteCodeInput, setInviteCodeInput] = useState(() => {
    if (typeof window === "undefined") return "";
    const code = new URLSearchParams(window.location.search).get("code");
    return code ? code.toUpperCase() : "";
  });
  const [teamLookupError, setTeamLookupError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    university: "",
    graduation_year: "",
    phone: "",
    major: "",
    linkedin_url: "",
    links: "",
    current_project: "",
    same_project_as_team: null as boolean | null,
    openclaw_idea_1: "",
    openclaw_idea_2: "",
    openclaw_idea_3: "",
  });

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("error");
    if (authError) {
      setEmailError(
        authError === "missing_code"
          ? "Invalid verification link."
          : "Authentication failed. Please try again."
      );
      window.history.replaceState(null, "", "/apply");
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email);
        setStep("basic");
      }
    });
  }, [supabase]);

  useEffect(() => {
    if (!emailSent) return;

    const poll = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        setStep("basic");
        clearInterval(poll);
      }
    }, 3000);

    const timeout = setTimeout(() => {
      clearInterval(poll);
      setEmailSent(false);
      setEmailError("Link expired. Please send a new one through the ClawComp website.");
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, [emailSent, supabase]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setLoading(true);
    const res = await fetch("/api/auth/send-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setEmailError(data.error || "Something went wrong");
      return;
    }
    setEmailSent(true);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setOtpLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otpCode.trim(),
      type: "email",
    });
    setOtpLoading(false);
    if (error) {
      setEmailError(error.message);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      setEmail(user.email);
      setStep("basic");
    }
  }

  async function handleLookupTeam() {
    if (!inviteCodeInput.trim()) return;
    setTeamLookupError("");
    const { data, error } = await supabase
      .from("teams")
      .select("id, name, invite_code, max_size, team_members")
      .eq("invite_code", inviteCodeInput.trim().toUpperCase())
      .single();

    if (error || !data) {
      setTeamLookupError("Invalid invite code. Please check and try again.");
      return;
    }

    const memberCount = Array.isArray(data.team_members) ? data.team_members.length : 0;
    if (memberCount >= data.max_size) {
      setTeamLookupError("This team is full.");
      return;
    }

    setSelectedTeamId(data.id);
    setTeamLookupError("");
  }

  async function handleTeamCreated(teamId: string) {
    setSelectedTeamId(teamId);
    // Keep modal open so user sees invite code; they close via "Continue" button
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!selectedTeamId) {
      setSubmitError("Please join a team with an invite code or create a new team.");
      return;
    }
    if (formData.same_project_as_team === null) {
      setSubmitError("Please indicate if your team is working on the same project.");
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setSubmitError("Please verify your email first.");
      return;
    }

    const links = formData.links
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const openclawIdeas = [
      formData.openclaw_idea_1,
      formData.openclaw_idea_2,
      formData.openclaw_idea_3,
    ].filter(Boolean);

    const { error } = await supabase.from("applications").upsert(
      {
        user_id: user.id,
        team_id: selectedTeamId || null,
        name: formData.name,
        university: formData.university,
        graduation_year: formData.graduation_year,
        university_email: user.email,
        phone: formData.phone || null,
        major: formData.major || null,
        linkedin_url: formData.linkedin_url || null,
        links,
        current_project: formData.current_project || null,
        same_project_as_team: formData.same_project_as_team,
        openclaw_ideas: openclawIdeas,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      setSubmitError(error.message);
      return;
    }
    setStep("done");
  }

  if (step === "email") {
    return (
      <div className="bg-background-elevated border border-border rounded-[0.75rem] p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Step 1: Verify Your University Email
        </h2>
        <p className="text-text-muted text-sm mb-6">
          We need to verify you&apos;re a university student. Enter your
          university email to receive a verification code.
        </p>
        {emailSent ? (
          <div className="space-y-4">
            <div className="bg-background-subtle rounded-lg p-4 text-text-muted text-sm">
              We sent a verification code to <strong className="text-text-primary">{email}</strong>.
              Enter the 6-digit code from the email below.
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary text-center text-lg tracking-widest placeholder:text-text-muted focus:outline-none focus:border-border-active"
                placeholder="00000000"
                disabled={otpLoading}
                autoFocus
              />
              {emailError && <p className="text-brand-red text-sm">{emailError}</p>}
              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {otpLoading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
            <button
              onClick={() => { setEmailSent(false); setEmailError(""); setOtpCode(""); }}
              className="text-text-muted text-sm hover:text-text-primary transition-colors"
            >
              Didn&apos;t receive a code? Send again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                placeholder="you@university.edu"
                required
                disabled={loading}
              />
            </div>
            {emailError && <p className="text-brand-red text-sm">{emailError}</p>}
            <button
              type="submit"
              disabled={loading || !isValidEmail}
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="bg-background-elevated border border-border rounded-[0.75rem] p-8 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Application Submitted!
        </h2>
        <p className="text-text-muted mb-6">
          Thanks for applying to ClawComp. We&apos;ll be in touch soon.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-red hover:bg-brand-red-hover text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-background-elevated border border-border rounded-[0.75rem] p-6 space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              University
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) =>
                setFormData((p) => ({ ...p, university: e.target.value }))
              }
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
              placeholder="e.g. Northeastern University"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Projected Graduation Year
            </label>
            <input
              type="text"
              value={formData.graduation_year}
              onChange={(e) =>
                setFormData((p) => ({ ...p, graduation_year: e.target.value }))
              }
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
              placeholder="e.g. 2027"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              University Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-background-subtle border border-border rounded-lg px-4 py-2.5 text-text-muted cursor-not-allowed"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, phone: e.target.value }))
              }
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Major
            </label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) =>
                setFormData((p) => ({ ...p, major: e.target.value }))
              }
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            LinkedIn
          </label>
          <input
            type="url"
            value={formData.linkedin_url}
            onChange={(e) =>
              setFormData((p) => ({ ...p, linkedin_url: e.target.value }))
            }
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>

      <div className="bg-background-elevated border border-border rounded-[0.75rem] p-6 space-y-4">
        <h2 className="text-xl font-bold text-text-primary">Team <span className="text-brand-red">*</span></h2>
        <div className="flex items-start gap-2 p-4 bg-background-subtle rounded-lg border border-border">
          <svg
            className="w-5 h-5 text-brand-red shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-text-muted">
            Apply as a team of 2–3. Has a teammate already registered a team?
            Enter their invite code below. If not,{" "}
            <button
              type="button"
              onClick={() => setTeamModalOpen(true)}
              className="text-brand-red hover:text-brand-coral font-medium underline"
            >
              Register your team here
            </button>
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inviteCodeInput}
            onChange={(e) =>
              setInviteCodeInput(e.target.value.toUpperCase())
            }
            placeholder="Enter invite code (e.g. ABC12345)"
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active font-mono uppercase"
          />
          <button
            type="button"
            onClick={handleLookupTeam}
            className="bg-background-subtle hover:bg-border border border-border text-text-primary font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Join Team
          </button>
        </div>
        {teamLookupError && (
          <p className="text-brand-red text-sm">{teamLookupError}</p>
        )}
        {selectedTeamId && (
          <p className="text-brand-coral text-sm">Team joined successfully.</p>
        )}
      </div>

      <div className="bg-background-elevated border border-border rounded-[0.75rem] p-6 space-y-4">
        <h2 className="text-xl font-bold text-text-primary">
          Application Questions
        </h2>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Link drop: Cool things you&apos;ve built
          </label>
          <textarea
            value={formData.links}
            onChange={(e) =>
              setFormData((p) => ({ ...p, links: e.target.value }))
            }
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
            placeholder="Personal website, web app, portfolio, game, etc. One per line."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            What are you currently working on? (Or what would you build with
            unlimited time?)
          </label>
          <textarea
            value={formData.current_project}
            onChange={(e) =>
              setFormData((p) => ({ ...p, current_project: e.target.value }))
            }
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Is your team working on the same project as you?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="same_project"
                checked={formData.same_project_as_team === true}
                onChange={() =>
                  setFormData((p) => ({ ...p, same_project_as_team: true }))
                }
                className="text-brand-red"
              />
              <span className="text-text-primary">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="same_project"
                checked={formData.same_project_as_team === false}
                onChange={() =>
                  setFormData((p) => ({ ...p, same_project_as_team: false }))
                }
                className="text-brand-red"
              />
              <span className="text-text-primary">No</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Name 3 things you&apos;d want OpenClaw to do for you
          </label>
          <p className="text-text-muted text-sm mb-2">
            For inspiration, visit the home page or News tab.
          </p>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <input
                key={i}
                type="text"
                value={
                  formData[
                    `openclaw_idea_${i}` as keyof typeof formData
                  ] as string
                }
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    [`openclaw_idea_${i}`]: e.target.value,
                  }))
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                placeholder={`Idea ${i}`}
              />
            ))}
          </div>
        </div>
      </div>

      {submitError && (
        <p className="text-brand-red text-sm">{submitError}</p>
      )}
      <button
        type="submit"
        className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-medium py-3 rounded-lg transition-colors"
      >
        Submit Application
      </button>

    </form>
    <TeamModal
      isOpen={teamModalOpen}
      onClose={() => setTeamModalOpen(false)}
      creatorEmail={email}
      onTeamCreated={handleTeamCreated}
    />
    </>
  );
}
