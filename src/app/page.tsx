import Link from "next/link";
import { ArrowRight, BadgeCheck, ClipboardList, Search, ShieldCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find the right care",
    description: "Search for doctors by name or specialty when verified listings are available.",
  },
  {
    number: "02",
    title: "Review clear details",
    description: "See useful profile information that has been reviewed before it is published.",
  },
  {
    number: "03",
    title: "Request an appointment",
    description: "Send a request through a straightforward booking process as the service opens.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Healthcare, closer to home</p>
            <h1>Finding care should feel a little simpler.</h1>
            <p className="hero-copy">
              Swasthloop is getting started in Gorakhpur, with a focus on helping people
              find clear, trusted information about local healthcare.
            </p>
            <form action="/doctors" className="search-panel" method="get">
              <div className="field-group">
                <label htmlFor="doctor-search">Doctor or specialty</label>
                <div className="search-input-wrap">
                  <Search aria-hidden="true" size={18} />
                  <input
                    autoComplete="off"
                    id="doctor-search"
                    name="q"
                    placeholder="e.g. cardiology"
                    type="search"
                  />
                </div>
              </div>
              <button className="button button-primary search-button" type="submit">
                Find doctors <ArrowRight aria-hidden="true" size={17} />
              </button>
            </form>
            <p className="hero-note">Doctor listings are being prepared. No profiles are published yet.</p>
          </div>
          <aside aria-label="About the service" className="hero-aside">
            <div className="service-panel">
              <p className="eyebrow">Starting in Gorakhpur</p>
              <h2>Care information you can understand.</h2>
              <div className="service-detail">
                <BadgeCheck aria-hidden="true" size={20} />
                <p><strong>Reviewed profiles</strong><span>Professional details checked before publishing</span></p>
              </div>
              <div className="service-detail">
                <ClipboardList aria-hidden="true" size={20} />
                <p><strong>Simple appointment requests</strong><span>A clear next step when booking opens</span></p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">A clear path to care</p>
            <h2>Useful healthcare information, without the guesswork.</h2>
            <p>We are building a practical service around verified details and simple next steps.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-band">
        <div className="container trust-band-inner">
          <ShieldCheck aria-hidden="true" size={23} />
          <p>
            <strong>Trust starts with accurate information.</strong> We will publish doctor
            details only after they have been reviewed.
          </p>
          <Link className="trust-link" href="/about">About Swasthloop</Link>
        </div>
      </section>
    </>
  );
}
