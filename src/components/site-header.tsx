"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { Brand } from "@/components/brand";
import type { AccountRole } from "@/lib/supabase/database.types";

const links = [
  { href: "/doctors", label: "Find doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const accountLabels: Record<AccountRole, string> = {
  patient: "Patient account",
  doctor: "Doctor account",
  admin: "Admin account",
};

export function SiteHeader({
  account,
}: {
  account: { fullName: string; role: AccountRole } | null;
}) {
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
          {account?.role === "patient" && <Link className="nav-link" href="/doctor/apply">Doctor application</Link>}
          {account?.role === "admin" && <Link className="nav-link" href="/admin/doctor-applications">Doctor applications</Link>}
        </nav>
        <div className="header-actions">
          {account ? (
            <>
              <Link aria-label={`${accountLabels[account.role]} for ${account.fullName}`} className="login-link" href="/account">
                {accountLabels[account.role]}
              </Link>
              <form action={signOutAction}>
                <button className="login-link signout-link" type="submit">Log out</button>
              </form>
            </>
          ) : (
            <>
              <Link className="login-link" href="/login">Log in</Link>
              <Link className="button button-small button-primary" href="/register">Create account</Link>
            </>
          )}
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
          {account?.role === "patient" && (
            <Link className="mobile-nav-link" href="/doctor/apply" onClick={() => setMenuOpen(false)}>
              Doctor application
            </Link>
          )}
          {account?.role === "admin" && (
            <Link className="mobile-nav-link" href="/admin/doctor-applications" onClick={() => setMenuOpen(false)}>
              Doctor applications
            </Link>
          )}
          {account ? (
            <>
              <Link className="mobile-nav-link" href="/account" onClick={() => setMenuOpen(false)}>
                {accountLabels[account.role]}
              </Link>
              <form action={signOutAction}>
                <button className="mobile-nav-link signout-link" type="submit">Log out</button>
              </form>
            </>
          ) : (
            <>
              <Link className="mobile-nav-link" href="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link className="button button-primary mobile-create-account" href="/register" onClick={() => setMenuOpen(false)}>
                Create account
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
