import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { LanguageProvider } from "@/lib/LanguageContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Insight Viewer",
  description: "Financial analysis and clarity engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${fraunces.variable} font-sans bg-background text-foreground antialiased`}
      >
        <div className="noise-bg" />
        <LanguageProvider>
          <div className="print:hidden">
            <Sidebar />
            <Header />
          </div>
          <main className="md:ml-64 p-8 min-h-[calc(100vh-4rem)] relative z-10 print:ml-0 print:p-0">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
