import type { Metadata } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/pwa/RegisterServiceWorker";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Smart Pharmacy Platform",
  description: "Pharmacy Management and Medication Intelligence",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-900 antialiased">
        <RegisterServiceWorker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
