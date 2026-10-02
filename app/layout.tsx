import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { CurrencyProvider } from "@/components/currency-provider";
import { PageTransition } from "@/components/page-transition";
import { siteDescription, siteName, siteUrl } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Apparel Plantra",
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_ZA", url: siteUrl, siteName, title: "Apparel Plantra", description: siteDescription },
  icons: {
    icon: [{ url: "/favicon.png?v=4", sizes: "512x512", type: "image/png" }],
    shortcut: "/favicon.ico?v=4",
    apple: [{ url: "/favicon.png?v=4", sizes: "512x512", type: "image/png" }]
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: siteName, url: siteUrl, logo: `${siteUrl}/images/apparel-plantra-logo.png` }, { "@type": "WebSite", name: siteName, url: siteUrl }] };
  return <html lang="en-ZA"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/><CurrencyProvider><CartProvider><PageTransition>{children}</PageTransition></CartProvider></CurrencyProvider></body></html>;
}
