import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentAccount } from "@/lib/auth/current-account";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Swasthloop | Your Healthcare, Connected",
    template: "%s | Swasthloop",
  },
  description:
    "Swasthloop is building a simpler way to discover healthcare in Gorakhpur. Doctor listings and booking are being prepared.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14634f",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const account = await getCurrentAccount();

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader account={account ? { fullName: account.fullName, role: account.role } : null} />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
