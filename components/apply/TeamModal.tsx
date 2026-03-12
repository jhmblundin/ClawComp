"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorEmail: string;
  onTeamCreated: (teamId: string) => void;
}

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function TeamModal({
  isOpen,
  onClose,
  creatorEmail,
  onTeamCreated,
}: TeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [maxSize, setMaxSize] = useState<2 | 3>(3);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    let inviteCode = generateInviteCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const { data, error: insertError } = await supabase
        .from("teams")
        .insert({
          name: teamName.trim(),
          invite_code: inviteCode,
          creator_email: creatorEmail,
          max_size: maxSize,
        })
        .select("id, invite_code")
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          if (insertError.message.includes("name")) {
            setError("This team name is already taken");
            setLoading(false);
            return;
          }
          inviteCode = generateInviteCode();
          attempts++;
          continue;
        }
        setError(insertError.message || "Failed to create team");
        setLoading(false);
        return;
      }

      if (data) {
        setCreatedCode(data.invite_code);
        onTeamCreated(data.id);
        setLoading(false);
        return;
      }
      attempts++;
    }
    setError("Could not generate unique invite code. Please try again.");
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background-elevated border border-border rounded-[0.75rem] p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-primary">
            Register Your Team
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {createdCode ? (
          <div className="space-y-4">
            <p className="text-text-muted text-sm">
              Team created! Share this invite code with your teammates:
            </p>
            <div className="bg-background-subtle rounded-lg p-4 font-mono text-lg font-bold text-brand-red text-center">
              {createdCode}
            </div>
            <p className="text-text-muted text-sm">
              Teammates can enter this code on the application page, or visit{" "}
              <code className="text-brand-coral">/apply?code={createdCode}</code>
            </p>
            <button
              onClick={onClose}
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                placeholder="e.g. Lobster Legends"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Team Size
              </label>
              <select
                value={maxSize}
                onChange={(e) => setMaxSize(Number(e.target.value) as 2 | 3)}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-border-active"
                disabled={loading}
              >
                <option value={2}>2 members</option>
                <option value={3}>3 members</option>
              </select>
            </div>
            {error && (
              <p className="text-brand-red text-sm">{error}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-border hover:border-border-hover text-text-primary font-medium py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand-red hover:bg-brand-red-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
