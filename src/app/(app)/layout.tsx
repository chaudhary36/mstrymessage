// src/app/(app)/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Digital adventures media - Mstry Message",
  description: "Welcome to the digital adventures media - Mstry Message",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (

      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </div>
 
  );
}
