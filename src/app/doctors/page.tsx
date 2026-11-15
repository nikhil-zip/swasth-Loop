import type { Metadata } from "next";
import { Search } from "lucide-react";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Find doctors",
  description: "Doctor discovery in Gorakhpur is being prepared by Swasthloop.",
};

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="page-shell">
      <div className="container">
        <PageHeading
          description="Search by doctor name or specialty. Verified profiles will appear here when they are ready."
          eyebrow="Doctor directory · Gorakhpur"
          title="Find a doctor"
        />
        <form action="/doctors" className="directory-search" method="get">
          <div className="field-group">
            <label htmlFor="directory-query">Doctor or specialty</label>
            <div className="search-input-wrap">
              <Search aria-hidden="true" size={18} />
              <input
                defaultValue={q}
                id="directory-query"
                name="q"
                placeholder="Search doctors or specialties"
                type="search"
              />
            </div>
          </div>
          <button className="button button-primary" type="submit">Search directory</button>
        </form>
        <section aria-live="polite" className="empty-state">
          <h2>{q ? `No listings available for “${q}” yet` : "Doctor listings are being prepared"}</h2>
          <p>
            Swasthloop does not have verified doctor profiles to show yet. Please check back
            later; we do not publish placeholder or unverified profiles.
          </p>
        </section>
      </div>
    </div>
  );
}
