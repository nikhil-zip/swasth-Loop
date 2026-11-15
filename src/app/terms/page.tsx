import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="This page is a placeholder and is not a set of terms and conditions."
          eyebrow="Terms"
          title="Terms are being prepared."
        />
        <section className="content-panel">
          <h2>Service availability</h2>
          <p>
            Doctor discovery, account access, and appointment booking are not yet operational.
            Reviewed terms will be published before these services open. This website does not
            provide medical advice or emergency care.
          </p>
        </section>
      </div>
    </div>
  );
}
