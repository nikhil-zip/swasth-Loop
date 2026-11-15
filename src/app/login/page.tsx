import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Patient and doctor accounts are not available yet."
          eyebrow="Account access"
          title="Log in to Swasthloop"
        />
        <section className="auth-notice">
          <h2>Sign-in is coming later</h2>
          <p>
            Authentication has not been connected. No credentials are collected on this
            page. You can read <Link href="/about">about the service</Link> while we prepare.
          </p>
        </section>
      </div>
    </div>
  );
}
