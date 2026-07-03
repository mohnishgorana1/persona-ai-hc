import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PERSONAAI_HC",
  description: "Chat with AI version of Hitesh Choudhary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-950 text-neutral-300 min-h-screen flex flex-col`}>


        {/* Main Content Area */}
        <main className="flex-1 w-full mx-auto">
          {children}
        </main>

      </body>
    </html>
  );
}