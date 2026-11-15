import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DoctorApplicationForm } from "@/components/auth/doctor-application-form";
import { PageHeading } from "@/components/page-heading";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Doctor application" };

export default async function DoctorApplicationPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?message=sign-in-required");
  if (account.role !== "patient") redirect("/account");

  const supabase = await createSupabaseServerClient();
  const [applicationsResult, specialtiesResult] = await Promise.all([
    supabase
      .from("doctor_verification_applications")
      .select("status, submitted_at, review_note")
      .eq("applicant_id", account.id)
      .order("submitted_at", { ascending: false })
      .limit(1),
    supabase.from("specialties").select("id, name").eq("is_active", true).order("name"),
  ]);
  const applications = applicationsResult.data;
  const specialties = specialtiesResult.data;
  const databaseError = Boolean(applicationsResult.error || specialtiesResult.error);
  const application = applications?.[0];
  const { submitted } = await searchParams;

  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Share professional registration details for administrator review. Doctor profiles are not public before approval."
          eyebrow="Doctor verification"
          title="Apply to be listed as a doctor"
        />
        {submitted === "1" && <p className="form-message form-message-success page-notice" role="status">Your application was submitted for review.</p>}
        {databaseError ? (
          <p className="form-message form-message-error page-notice" role="status">Doctor applications are temporarily unavailable. Please try again later.</p>
        ) : application?.status === "pending" ? (
          <section className="auth-notice">
            <h2>Application under review</h2>
            <p>Your professional information remains private while the application is pending.</p>
            <p><Link href="/account">Return to your account</Link></p>
          </section>
        ) : (
          <section className="auth-card" aria-label="Doctor verification application form">
            {application?.review_note && <p className="form-message form-message-info" role="status">Review note: {application.review_note}</p>}
            <DoctorApplicationForm specialties={specialties ?? []} enabled={isSupabaseConfigured()} />
          </section>
        )}
      </div>
    </div>
  );
}
