import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkEmailRateLimit, checkIpRateLimit } from "@/lib/rate-limit";
import { isAdminEmail } from "@/lib/admin";

const RATE_LIMIT_KEY_VERSION = "v2";

function getAllowedOverrideEmails(): string[] {
  const env = process.env.ALLOWED_OVERRIDE_EMAILS ?? "";
  return env.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

function isAllowedUniversityDomain(domain?: string): boolean {
  return typeof domain === "string" && domain.endsWith(".edu");
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch (parseErr) {
      throw parseErr;
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();
    const overrideEmails = getAllowedOverrideEmails();
    const domain = email.split("@")[1]?.toLowerCase();
    const isAllowed =
      isAllowedUniversityDomain(domain) ||
      overrideEmails.includes(emailLower);

    if (!isAllowed) {
      return NextResponse.json(
        {
          error: "Please use a university email ending in .edu",
        },
        { status: 400 }
      );
    }

    // Rate limit by both email and IP so users have isolated buckets while shared abuse is capped.
    if (!isAdminEmail(emailLower) && !overrideEmails.includes(emailLower)) {
      try {
        const forwarded = request.headers.get("x-forwarded-for");
        const ip =
          forwarded?.split(",")[0]?.trim() ??
          request.headers.get("x-real-ip") ??
          "unknown";
        const ipRateLimitResult = await checkIpRateLimit(
          `magic-link-ip:${RATE_LIMIT_KEY_VERSION}:${ip}`
        );

        if (!ipRateLimitResult.success) {
          return NextResponse.json(
            {
              error:
                "Too many requests from this network. Please wait 15 minutes before requesting another magic link.",
            },
            { status: 429 }
          );
        }

        const emailRateLimitResult = await checkEmailRateLimit(
          `magic-link-email:${RATE_LIMIT_KEY_VERSION}:${emailLower}`
        );

        if (!emailRateLimitResult.success) {
          return NextResponse.json(
            {
              error:
                "Too many requests. Please wait 15 minutes before requesting another magic link.",
            },
            { status: 429 }
          );
        }
      } catch (rateLimitErr) {
        console.error("[rate-limit] Failed, allowing request through:", rateLimitErr);
      }
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-magic-link] Unhandled exception:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
