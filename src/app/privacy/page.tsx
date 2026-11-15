import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="This page is a placeholder and is not a privacy notice."
          eyebrow="Privacy"
          title="Privacy information is being prepared."
        />
        <section className="content-panel">
          <h2>Before the service opens</h2>
          <p>
            Swasthloop has not opened account registration, appointment requests, or contact
            submissions. This site does not ask you to enter health information. A reviewed
            privacy notice will be published before those features become available.
          </p>
        </section>
      </div>
    </div>
  );
}
