import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Longtress — Haitian Hair Oil | Nourish From Root to Tip",
    template: "%s | Longtress",
  },
  description:
    "Premium Haitian black castor oil for strong, beautiful, healthy hair. Rooted in tradition, crafted for modern hair care. 100% natural, cruelty-free. Free shipping over $60.",
  keywords: [
    "Haitian black castor oil",
    "hair oil",
    "hair growth",
    "natural hair care",
    "castor oil",
    "Longtress",
    "hair nourishment",
  ],
  authors: [{ name: "Longtress" }],
  creator: "Longtress",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Longtress",
    title: "Longtress — Haitian Hair Oil | Nourish From Root to Tip",
    description:
      "Premium Haitian black castor oil for strong, beautiful, healthy hair. Rooted in tradition. 4.9★ · 500+ reviews. Free shipping $60+.",
    images: [
      {
        url: "/product-1.jpeg",
        width: 1200,
        height: 630,
        alt: "Longtress Haitian Hair Oil — Premium cold-pressed black castor oil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Longtress — Haitian Hair Oil | Nourish From Root to Tip",
    description:
      "Premium Haitian black castor oil for strong, beautiful hair. Rooted in tradition. 4.9★ · 500+ reviews.",
    images: ["/product-1.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "Beauty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
