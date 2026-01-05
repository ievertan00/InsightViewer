import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Sidebar />
        <Header />
        <main className="md:ml-64 p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}