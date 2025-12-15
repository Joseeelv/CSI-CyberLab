import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberLab - Ciberseguridad para todos",
  description:
    "CyberLab es una plataforma educativa en ciberseguridad diseñada para personas de todas las edades y niveles de experiencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), var(--font-geist-mono), var(--font-orbitron)" }}
      >

        {children}
      </body>
    </html>
  );
}
