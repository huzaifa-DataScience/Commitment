import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Commitment Dashboard",
  description: "Track your commitments and measure your sincerity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Sidebar />
          <Navbar />
          <main className="lg:pl-64">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

