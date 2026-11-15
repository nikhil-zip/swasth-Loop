import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeading } from "@/components/page-heading";
import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage() {
  const account = await getCurrentAccount();
  if (account) redirect("/account");

  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Create an account to continue with Swasthloop."
          eyebrow="Get started"
          title="Create a patient account"
        />
        <section className="auth-card" aria-label="Registration form">
          <RegisterForm enabled={isSupabaseConfigured()} />
          <p className="auth-switch">Already registered? <Link href="/login">Log in</Link></p>
        </section>
      </div>
    </div>
  );
}
