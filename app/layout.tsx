import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "Sirah Interaktif",
  description: "Platform Eksplorasi Spasial & Kronologis Sirah Nabawiyah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.css" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${amiri.variable} antialiased bg-[#0C0A09] text-gray-200 font-sans selection:bg-[#B45309] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
