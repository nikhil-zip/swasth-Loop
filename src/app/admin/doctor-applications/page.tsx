import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { reviewDoctorApplicationAction } from "@/app/actions/admin";
import { PageHeading } from "@/components/page-heading";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Doctor applications" };

const messages: Record<string, string> = {
  reviewed: "The application review was recorded.",
  "review-failed": "The review could not be completed. The application may no longer be pending.",
  "invalid-request": "Choose a valid application and review outcome.",
};

export default async function AdminDoctorApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?message=sign-in-required");
  if (account.role !== "admin") redirect("/account");

  const supabase = await createSupabaseServerClient();
  const [applicationsResult, specialtiesResult] = await Promise.all([
    supabase
      .from("doctor_verification_applications")
      .select("id, applicant_id, specialty_id, registration_authority, registration_number, qualifications, years_experience, submitted_at")
      .eq("status", "pending")
      .order("submitted_at", { ascending: true }),
    supabase.from("specialties").select("id, name"),
  ]);
  const applications = applicationsResult.data;
  const specialties = specialtiesResult.data;
  const queueError = Boolean(applicationsResult.error || specialtiesResult.error);
  const applicantIds = [...new Set((applications ?? []).map((application) => application.applicant_id))];
  const { data: applicantProfiles } = applicantIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", applicantIds)
    : { data: [] };
  const { message } = await searchParams;
  const specialtyNames = new Map((specialties ?? []).map((specialty) => [specialty.id, specialty.name]));
  const applicantNames = new Map((applicantProfiles ?? []).map((profile) => [profile.id, profile.full_name]));

  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Review professional registration details. Applicants remain patients and are not listed publicly until you approve an application."
          eyebrow="Administration"
          title="Doctor applications"
        />
        {message && messages[message] && (
          <p className={`form-message ${message === "reviewed" ? "form-message-success" : "form-message-error"} page-notice`} role="status">
            {messages[message]}
          </p>
        )}
        {queueError ? (
          <p className="form-message form-message-error page-notice" role="status">The review queue is temporarily unavailable.</p>
        ) : applications?.length ? (
          <div className="application-list">
            {applications.map((application) => (
              <article className="account-card application-card" key={application.id}>
                <h2>{applicantNames.get(application.applicant_id) ?? "Applicant"} · {specialtyNames.get(application.specialty_id) ?? "Specialty unavailable"}</h2>
                <dl className="account-details">
                  <div><dt>Applicant ID</dt><dd>{application.applicant_id}</dd></div>
                  <div><dt>Registration authority</dt><dd>{application.registration_authority}</dd></div>
                  <div><dt>Registration number</dt><dd>{application.registration_number}</dd></div>
                  <div><dt>Experience</dt><dd>{application.years_experience} years</dd></div>
                  <div><dt>Qualifications</dt><dd>{application.qualifications}</dd></div>
                  <div><dt>Submitted</dt><dd>{new Date(application.submitted_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}</dd></div>
                </dl>
                <div className="review-actions">
                  <form action={reviewDoctorApplicationAction}>
                    <input name="applicationId" type="hidden" value={application.id} />
                    <button className="button button-primary" name="decision" type="submit" value="approved">Approve and verify</button>
                  </form>
                  <form action={reviewDoctorApplicationAction}>
                    <input name="applicationId" type="hidden" value={application.id} />
                    <button className="button button-secondary" name="decision" type="submit" value="rejected">Reject</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="empty-state">
            <h2>No applications awaiting review</h2>
            <p>Pending doctor applications will appear here after they are submitted.</p>
          </section>
        )}
      </div>
    </div>
  );
}
