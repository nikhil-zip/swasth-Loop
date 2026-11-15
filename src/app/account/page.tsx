import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions/auth";
import { PageHeading } from "@/components/page-heading";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My account" };

const roleLabels = { patient: "Patient", doctor: "Verified doctor", admin: "Platform administrator" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?message=sign-in-required");

  const supabase = await createSupabaseServerClient();
  const { data: application, error: applicationError } = await supabase
    .from("doctor_verification_applications")
    .select("status, submitted_at, review_note")
    .eq("applicant_id", account.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { message } = await searchParams;

  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Your account details and doctor application status."
          eyebrow="My account"
          title={`Hello, ${account.fullName}`}
        />
        {message === "password-updated" && <p className="form-message form-message-success page-notice" role="status">Your password has been updated.</p>}
        <div className="account-grid">
          <section className="account-card">
            <h2>Account details</h2>
            <dl className="account-details">
              <div><dt>Name</dt><dd>{account.fullName}</dd></div>
              <div><dt>Email</dt><dd>{account.email ?? "Not available"}</dd></div>
              <div><dt>Account type</dt><dd>{roleLabels[account.role]}</dd></div>
            </dl>
            <Link className="account-text-link" href="/account/update-password">Change password</Link>
            <form action={signOutAction} className="account-signout">
              <button className="button button-secondary" type="submit">Log out</button>
            </form>
          </section>
          {account.role === "patient" && (
            <section className="account-card">
              <h2>Doctor applications</h2>
              {applicationError ? (
                <p className="form-message form-message-error" role="status">Application status is temporarily unavailable.</p>
              ) : application ? (
                <>
                  <p className="application-status">Status: <strong>{application.status}</strong></p>
                  <p className="field-help">Submitted {new Date(application.submitted_at).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" })}</p>
                  {application.review_note && <p className="application-review-note">{application.review_note}</p>}
                  {application.status === "rejected" && <Link className="account-text-link" href="/doctor/apply">Submit a new application</Link>}
                </>
              ) : (
                <>
                  <p>You can apply for a doctor profile after choosing from the available specialties.</p>
                  <Link className="button button-primary account-apply" href="/doctor/apply">Apply as a doctor</Link>
                </>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
