import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ClawComp | OpenClaw Builder Challenge",
  description:
    "University students compete to build the most revolutionary OpenClaw setups. Hosted by Link Ventures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sourceSans.variable}>
      <body className="min-h-screen bg-background text-text-primary antialiased font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
