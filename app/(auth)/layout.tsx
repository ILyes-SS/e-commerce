import type { Metadata } from "next";
import "../globals.css";
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
  title: "Sign In | E-Commerce Store",
  description: "Sign in to your E-Commerce Store account to manage orders, wishlist, and more.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${quicksand.variable}`}>
      <body className="antialiased flex flex-col min-h-screen font-sans">

{children}

      </body>
    </html>
  );
}
