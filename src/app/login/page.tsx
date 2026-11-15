import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Log in" };

const notices: Record<string, string> = {
  "confirmation-failed": "That confirmation link could not be verified. Request a new link or sign in.",
  "sign-in-required": "Sign in to continue.",
  "signed-out": "You have been signed out.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const account = await getCurrentAccount();
  if (account) redirect("/account");
  const { message } = await searchParams;

  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Sign in to manage your Swasthloop account."
          eyebrow="Account access"
          title="Welcome back"
        />
        {message && notices[message] && <p className="form-message form-message-info page-notice" role="status">{notices[message]}</p>}
        <section className="auth-card" aria-label="Log in form">
          <LoginForm enabled={isSupabaseConfigured()} />
          <p className="auth-switch">New to Swasthloop? <Link href="/register">Create a patient account</Link></p>
        </section>
      </div>
    </div>
  );
}
