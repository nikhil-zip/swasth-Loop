"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/doctors", label: "Find doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link className="nav-link" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="login-link" href="/login">
            Log in
          </Link>
          <Link className="button button-small button-primary" href="/register">
            Create account
          </Link>
        </div>
        <button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="mobile-nav"
          id="mobile-navigation"
        >
          {links.map((link) => (
            <Link
              className="mobile-nav-link"
              href={link.href}
              key={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link className="mobile-nav-link" href="/login" onClick={() => setMenuOpen(false)}>
            Log in
          </Link>
          <Link
            className="button button-primary mobile-create-account"
            href="/register"
            onClick={() => setMenuOpen(false)}
          >
            Create account
          </Link>
        </nav>
      )}
    </header>
  );
}
