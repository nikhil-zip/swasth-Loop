import "server-only";

import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AccountRole } from "@/lib/supabase/database.types";

export type CurrentAccount = {
  id: string;
  email: string | null;
  fullName: string;
  role: AccountRole;
};

export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  // The shared header is user-specific, so ensure it renders per request even
  // when a deployment is built before its Supabase environment is configured.
  await cookies();
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profileError || !profile) return null;

    return {
      id: authData.user.id,
      email: authData.user.email ?? null,
      fullName: profile.full_name,
      role: profile.role,
    };
  } catch {
    return null;
  }
}
