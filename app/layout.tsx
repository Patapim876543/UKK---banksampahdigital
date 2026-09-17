import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/common/providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoBank Digital — Bank Sampah & Daur Ulang",
  description: "Aplikasi Bank Sampah Digital & Daur Ulang Modern (UKK RPL 2026/2027)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#1d1d1f]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

