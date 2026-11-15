"use server";

import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type DoctorApplicationState = {
  status: "error" | "success";
  message: string;
} | null;

function formText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function submitDoctorApplicationAction(
  _previousState: DoctorApplicationState,
  formData: FormData,
): Promise<DoctorApplicationState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Account services are not configured for this deployment yet." };
  }

  const account = await getCurrentAccount();
  if (!account) redirect("/login?message=sign-in-required");
  if (account.role !== "patient") {
    return { status: "error", message: "Only a patient account without an approved doctor profile can apply." };
  }

  const specialtyId = formText(formData, "specialtyId");
  const registrationAuthority = formText(formData, "registrationAuthority");
  const registrationNumber = formText(formData, "registrationNumber");
  const qualifications = formText(formData, "qualifications");
  const yearsExperienceValue = formText(formData, "yearsExperience");
  const yearsExperience = Number(yearsExperienceValue);

  if (!uuidPattern.test(specialtyId)) {
    return { status: "error", message: "Choose a listed specialty." };
  }
  if (registrationAuthority.length < 2 || registrationAuthority.length > 200) {
    return { status: "error", message: "Enter the registration council or authority (2 to 200 characters)." };
  }
  if (registrationNumber.length < 2 || registrationNumber.length > 100) {
    return { status: "error", message: "Enter a valid professional registration number." };
  }
  if (qualifications.length < 2 || qualifications.length > 2000) {
    return { status: "error", message: "Enter your qualifications (2 to 2,000 characters)." };
  }
  if (!/^\d{1,2}$/.test(yearsExperienceValue) || !Number.isInteger(yearsExperience) || yearsExperience > 70) {
    return { status: "error", message: "Enter years of experience from 0 to 70." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: specialty, error: specialtyError } = await supabase
      .from("specialties")
      .select("id")
      .eq("id", specialtyId)
      .eq("is_active", true)
      .maybeSingle();
    if (specialtyError || !specialty) {
      return { status: "error", message: "That specialty is not currently available." };
    }

    const { error } = await supabase.from("doctor_verification_applications").insert({
      applicant_id: account.id,
      specialty_id: specialtyId,
      registration_authority: registrationAuthority,
      registration_number: registrationNumber,
      qualifications,
      years_experience: yearsExperience,
    });

    if (error) {
      return {
        status: "error",
        message: "We couldn't submit the application. A pending application may already exist; refresh and check your account.",
      };
    }
  } catch {
    return {
      status: "error",
      message: "Application submission is temporarily unavailable. Try again later.",
    };
  }

  redirect("/doctor/apply?submitted=1");
}
