import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-block">
          <Brand />
          <p>Building a more connected way to find healthcare in Gorakhpur.</p>
        </div>
        <div className="footer-links" aria-label="Footer navigation">
          <Link href="/doctors">Find doctors</Link>
          <Link href="/about">About us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Swasthloop</span>
          <span>Healthcare information is being prepared for this service.</span>
        </div>
      </div>
    </footer>
  );
}
