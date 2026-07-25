import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LocalVault — 100% Browser-Based Privacy Tools",
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
    title: "LocalVault — Privacy-First Document Processing",
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
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
