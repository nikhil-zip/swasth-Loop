"use server";

import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DoctorApplicationStatus } from "@/lib/supabase/database.types";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function reviewDoctorApplicationAction(formData: FormData): Promise<void> {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?message=sign-in-required");
  if (account.role !== "admin") redirect("/account");

  const applicationId = formData.get("applicationId");
  const decision = formData.get("decision");
  if (
    typeof applicationId !== "string" ||
    !uuidPattern.test(applicationId) ||
    (decision !== "approved" && decision !== "rejected")
  ) {
    redirect("/admin/doctor-applications?message=invalid-request");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.rpc("review_doctor_application", {
      application_id: applicationId,
      decision: decision as DoctorApplicationStatus,
      note: null,
    });
    if (error) redirect("/admin/doctor-applications?message=review-failed");
  } catch {
    redirect("/admin/doctor-applications?message=review-failed");
  }
  redirect("/admin/doctor-applications?message=reviewed");
}
