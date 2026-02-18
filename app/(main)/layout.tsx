import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Nunito, Quicksand } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "E-Commerce Store — Quality Products, Best Prices",
    template: "%s | E-Commerce Store",
  },
  description:
    "Shop our curated collection of quality products at competitive prices. Fast delivery, secure checkout, and 24/7 customer support.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "E-Commerce Store",
    title: "E-Commerce Store — Quality Products, Best Prices",
    description:
      "Shop our curated collection of quality products at competitive prices. Fast delivery, secure checkout, and 24/7 customer support.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "E-Commerce Store Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Commerce Store — Quality Products, Best Prices",
    description:
      "Shop our curated collection of quality products at competitive prices.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${quicksand.variable}`}>
      <body className="antialiased flex flex-col min-h-screen font-sans">
        <Header />
        <MobileHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
