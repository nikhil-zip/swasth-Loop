import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information for Swasthloop is being prepared.",
};

export default function ContactPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="We are preparing a reliable way for patients and healthcare professionals to reach the Swasthloop team."
          eyebrow="Contact"
          title="We will be in touch."
        />
        <section className="content-panel">
          <h2>Contact details coming soon</h2>
          <p>
            Our contact channel is not available yet. We have not enabled a contact form,
            so please do not send personal or medical information through this website.
          </p>
        </section>
      </div>
    </div>
  );
}
