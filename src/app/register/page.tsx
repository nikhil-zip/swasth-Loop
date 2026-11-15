import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Registration is not open yet."
          eyebrow="Get started"
          title="Create a Swasthloop account"
        />
        <section className="auth-notice">
          <h2>Registration is being prepared</h2>
          <p>
            No account or patient data is collected on this page. When registration opens,
            the sign-up process will explain what information is needed. <Link href="/contact">Contact details</Link> are not available yet.
          </p>
        </section>
      </div>
    </div>
  );
}
