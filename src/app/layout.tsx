import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyProvider } from "@/lib/privacy-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LocalVault \u2014 100% Browser-Based Privacy Tools",
  description:
    "Process PDFs, images, and sensitive documents entirely in your browser. Zero server uploads. Zero data leaks.",
  keywords: [
    "privacy",
    "PDF tools",
    "client-side processing",
    "watermark",
    "OCR",
    "PII redaction",
    "secure",
    "offline",
  ],
  openGraph: {
    title: "LocalVault \u2014 Privacy-First Document Processing",
    description: "Your documents never leave your device.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between">
        <PrivacyProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </PrivacyProvider>
      </body>
    </html>
  );
}
