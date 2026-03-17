import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Admin API not configured" },
        { status: 500 }
      );
    }

    const supabaseAuth = await createServerClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user?.email || !isAdminEmail(user.email)) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase() ?? "";

    const { data: teams, error: teamsError } = await adminClient
      .from("teams")
      .select("id, name, invite_code, creator_email, max_size, team_members, created_at")
      .order("created_at", { ascending: false });

    if (teamsError) {
      return NextResponse.json(
        { error: teamsError.message },
        { status: 500 }
      );
    }

    if (!teams?.length) {
      return NextResponse.json({ teams: [] });
    }

    const teamIds = teams.map((t) => t.id);
    const { data: applications, error: appsError } = await adminClient
      .from("applications")
      .select(
        "id, user_id, team_id, name, university, graduation_year, university_email, phone, major, linkedin_url, links, current_project, same_project_as_team, openclaw_ideas, created_at"
      )
      .in("team_id", teamIds);

    if (appsError) {
      return NextResponse.json(
        { error: appsError.message },
        { status: 500 }
      );
    }

    const appsByTeam = new Map<string, typeof applications>();
    for (const app of applications ?? []) {
      if (app.team_id) {
        const list = appsByTeam.get(app.team_id) ?? [];
        list.push(app);
        appsByTeam.set(app.team_id, list);
      }
    }

    const teamsWithApps = teams.map((team) => ({
      ...team,
      applications: (appsByTeam.get(team.id) ?? []).sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    }));

    let filtered = teamsWithApps;
    if (search) {
      filtered = teamsWithApps.filter((t) => {
        const nameMatch = t.name.toLowerCase().includes(search);
        const codeMatch = t.invite_code.toLowerCase().includes(search);
        const creatorMatch = t.creator_email.toLowerCase().includes(search);
        const memberMatch = t.applications.some(
          (a) =>
            a.name.toLowerCase().includes(search) ||
            a.university_email.toLowerCase().includes(search) ||
            a.university.toLowerCase().includes(search)
        );
        return nameMatch || codeMatch || creatorMatch || memberMatch;
      });
    }

    return NextResponse.json({ teams: filtered });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
