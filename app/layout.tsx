import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { siteDescription, siteName, siteUrl } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Apparel Plantra",
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_ZA", url: siteUrl, siteName, title: "Apparel Plantra", description: siteDescription },
  icons: { icon: [{ url: "/icon.png?v=2", type: "image/png" }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: siteName, url: siteUrl, logo: `${siteUrl}/images/apparel-plantra-logo.png` }, { "@type": "WebSite", name: siteName, url: siteUrl }] };
  return <html lang="en-ZA"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/><CartProvider>{children}</CartProvider></body></html>;
}
