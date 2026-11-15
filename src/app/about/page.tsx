import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "About Swasthloop",
  description: "Learn about Swasthloop and its initial focus on healthcare discovery in Gorakhpur.",
};

export default function AboutPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Swasthloop is an early-stage healthcare discovery project starting in Gorakhpur, Uttar Pradesh."
          eyebrow="About us"
          title="Healthcare information should be easier to find."
        />
        <section className="content-panel">
          <h2>What we are building</h2>
          <p>
            Our first focus is helping people discover doctors and understand the next step
            for requesting an appointment. We are preparing the service and have not yet
            published doctor listings or opened appointment booking.
          </p>
          <p>
            We will make the status of services clear and publish professional information
            only after it has been reviewed. Swasthloop is not an emergency service and does
            not provide medical advice.
          </p>
        </section>
      </div>
    </div>
  );
}
