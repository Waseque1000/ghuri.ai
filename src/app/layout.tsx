import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ghuri.ai — AI-Powered Travel Planning & Comparison for Bangladesh",
  description:
    "Discover more. Plan smarter. Travel better. Bangladesh's first algorithmic travel itinerary & transparent multi-modal price engine with verified published fares and zero markups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} h-full scroll-smooth light`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F8F9FF] text-[#121C2A] antialiased selection:bg-[#005C55]/20 selection:text-[#005C55] font-sans"
      >
        {children}
      </body>
    </html>
  );
}
