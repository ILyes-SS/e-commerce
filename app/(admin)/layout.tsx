import type { Metadata } from "next";
import "../globals.css";
import { Nunito, Quicksand } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
  title: "Admin - Products Management",
  description: "Manage your e-commerce products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${quicksand.variable}`}>
      <body className="antialiased font-sans bg-background">
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b px-6">
              <SidebarTrigger className="-ml-2" />
            </header>
            <main className="flex-1">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
