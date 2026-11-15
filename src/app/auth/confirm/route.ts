import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/account";
  }
  return value;
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/login?message=confirmation-failed", request.url));
  }

  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const requestedType = request.nextUrl.searchParams.get("type");
  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));
  const allowedTypes: EmailOtpType[] = ["email", "signup", "recovery"];

  if (!tokenHash || !requestedType || !allowedTypes.includes(requestedType as EmailOtpType)) {
    return NextResponse.redirect(new URL("/login?message=confirmation-failed", request.url));
  }

  let verificationFailed = false;
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: requestedType as EmailOtpType,
    });
    verificationFailed = Boolean(error);
  } catch {
    verificationFailed = true;
  }

  if (verificationFailed) {
    return NextResponse.redirect(new URL("/login?message=confirmation-failed", request.url));
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
