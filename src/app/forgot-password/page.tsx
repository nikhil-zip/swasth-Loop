import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Reset password" };

export default async function ForgotPasswordPage() {
  const account = await getCurrentAccount();
  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="We will send a reset link if an account matches the email address."
          eyebrow="Account recovery"
          title="Reset your password"
        />
        <section className="auth-card" aria-label="Password reset request form">
          <ForgotPasswordForm enabled={isSupabaseConfigured()} />
          <p className="auth-switch"><Link href={account ? "/account" : "/login"}>Back to {account ? "account" : "log in"}</Link></p>
        </section>
      </div>
    </div>
  );
}
