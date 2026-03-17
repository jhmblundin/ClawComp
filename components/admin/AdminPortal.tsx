"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Application = {
  id: string;
  name: string;
  university: string;
  graduation_year: string;
  university_email: string;
  phone: string | null;
  major: string | null;
  linkedin_url: string | null;
  links: string[];
  current_project: string | null;
  same_project_as_team: boolean | null;
  openclaw_ideas: string[];
  created_at: string;
};

type TeamMember = {
  user_id: string;
  email: string;
  name: string;
};

type TeamWithApps = {
  id: string;
  name: string;
  invite_code: string;
  creator_email: string;
  max_size: number;
  team_members: TeamMember[] | null;
  created_at: string;
  applications: Application[];
};

export function AdminPortal() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<TeamWithApps[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchTeams = async () => {
    setTeamsLoading(true);
    setTeamsError("");
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    const res = await fetch(`/api/admin/teams?${params}`);
    const data = await res.json().catch(() => ({}));
    setTeamsLoading(false);
    if (!res.ok) {
      setTeamsError(data.error || "Failed to load teams");
      if (res.status === 403) setUser(null);
      return;
    }
    setTeams(data.teams ?? []);
  };

  // Explicitly handle magic link callback: parse hash and set session (client may not auto-process)
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(({ data: { session } }) => {
            if (session?.user?.email) {
              setUser({ email: session.user.email });
              fetchTeams();
              window.history.replaceState(null, "", "/admin");
            }
          });
        return;
      }
    }
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u?.email) {
        setUser({ email: u.email });
        fetchTeams();
      } else {
        setUser(null);
      }
    });
  }, [supabase.auth]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
          session?.user?.email
        ) {
          setUser({ email: session.user.email });
          fetchTeams();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => fetchTeams(), 300);
      return () => clearTimeout(timer);
    }
  }, [search, user]);

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setLoading(true);
    const res = await fetch("/api/admin/send-magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setEmailError(data.error || "Something went wrong");
      return;
    }
    setEmailSent(true);
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">
          Admin Portal
        </h1>
        <p className="text-text-muted mb-6">
          Sign in with an authorized admin email to review applications.
        </p>
        {emailSent ? (
          <p className="text-text-muted text-sm">
            Check your email for the magic link. You may close this tab after
            signing in.
          </p>
        ) : (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Admin email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
                required
                disabled={loading}
              />
            </div>
            {emailError && (
              <p className="text-brand-red text-sm">{emailError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-6 lg:px-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            <span className="text-brand-red">&gt;</span> Application Review
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Signed in as {user.email}
          </p>
        </div>
        <Link
          href="/"
          className="text-brand-red hover:text-brand-coral text-sm font-medium"
        >
          ← Back to site
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="search"
          placeholder="Search teams by name, invite code, creator, or member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-background border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-active"
        />
      </div>

      {teamsError && (
        <p className="text-brand-red mb-6">{teamsError}</p>
      )}

      {teamsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-background-elevated border border-border rounded-card p-6 h-32 animate-pulse"
            />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <p className="text-text-muted">
          No teams found. {search ? "Try a different search." : "Applications will appear here."}
        </p>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-background-elevated border border-border rounded-card overflow-hidden hover:border-border-hover transition-colors"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedTeamId(expandedTeamId === team.id ? null : team.id)
                }
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div>
                  <h2 className="text-lg font-bold text-text-primary">
                    {team.name}
                  </h2>
                  <p className="text-text-muted text-sm mt-1">
                    Code: <code className="text-brand-coral">{team.invite_code}</code>
                    {" · "}
                    {team.applications.length}/{team.max_size} members
                    {" · "}
                    Created by {team.creator_email}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-text-muted transition-transform ${
                    expandedTeamId === team.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedTeamId === team.id && (
                <div className="border-t border-border px-6 py-4 space-y-6">
                  {team.applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-background rounded-lg p-4 space-y-3"
                    >
                      <h3 className="font-bold text-text-primary">
                        {app.name}
                        <span className="text-text-muted font-normal text-sm ml-2">
                          {app.university} · {app.graduation_year}
                        </span>
                      </h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <dt className="text-text-muted">Email</dt>
                          <dd className="text-text-primary">{app.university_email}</dd>
                        </div>
                        {app.phone && (
                          <div>
                            <dt className="text-text-muted">Phone</dt>
                            <dd className="text-text-primary">{app.phone}</dd>
                          </div>
                        )}
                        {app.major && (
                          <div>
                            <dt className="text-text-muted">Major</dt>
                            <dd className="text-text-primary">{app.major}</dd>
                          </div>
                        )}
                        {app.linkedin_url && (
                          <div>
                            <dt className="text-text-muted">LinkedIn</dt>
                            <dd>
                              <a
                                href={app.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-red hover:text-brand-coral"
                              >
                                View profile
                              </a>
                            </dd>
                          </div>
                        )}
                      </dl>
                      {app.current_project && (
                        <div>
                          <dt className="text-text-muted text-sm mb-1">Current project</dt>
                          <dd className="text-text-primary text-sm">{app.current_project}</dd>
                        </div>
                      )}
                      {app.same_project_as_team !== null && (
                        <p className="text-sm text-text-muted">
                          Same project as team: {app.same_project_as_team ? "Yes" : "No"}
                        </p>
                      )}
                      {app.links?.length > 0 && (
                        <div>
                          <dt className="text-text-muted text-sm mb-1">Links</dt>
                          <dd className="text-sm">
                            <ul className="list-disc list-inside space-y-1">
                              {app.links.map((link, i) => (
                                <li key={i}>
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-red hover:text-brand-coral"
                                  >
                                    {link}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}
                      {app.openclaw_ideas?.length > 0 && (
                        <div>
                          <dt className="text-text-muted text-sm mb-1">OpenClaw ideas</dt>
                          <dd className="text-sm text-text-primary space-y-1">
                            {app.openclaw_ideas.map((idea, i) => (
                              <p key={i}>{idea}</p>
                            ))}
                          </dd>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
