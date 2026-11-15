import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Update password" };

export default async function UpdatePasswordPage() {
  const account = await getCurrentAccount();
  if (!account) redirect("/login?message=sign-in-required");

  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Choose a new password for your account."
          eyebrow="Account security"
          title="Update your password"
        />
        <section className="auth-card" aria-label="Update password form">
          <UpdatePasswordForm enabled={isSupabaseConfigured()} />
        </section>
      </div>
    </div>
  );
}
