import { Plus_Jakarta_Sans, Inter, Poppins } from "next/font/google";
import "./globals.css";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import Script from "next/script";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

import DelayedGTM from '@/components/DelayedGTM';

export const metadata = {
  title: "US Immigration News & Updates | Visas, Green Cards, USCIS & ICE News",
  description: "Get the latest USA immigration news, visa updates, green card processing times, USCIS announcements, and ICE policy changes. Trusted daily immigration updates and guides.",
};

export default function RootLayout({ children }) {
  // Use environment variable, fallback to empty string if not set
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PLACEHOLDER';

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://elbxclhtmlbdlegsfzqh.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://elbxclhtmlbdlegsfzqh.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body suppressHydrationWarning className="antialiased overflow-x-hidden min-h-screen flex flex-col">
        {/* Safely inject GTM without blocking render */}
        {gtmId !== 'GTM-PLACEHOLDER' && <DelayedGTM gtmId={gtmId} />}
        
        <PublicLayoutWrapper>
          {children}
        </PublicLayoutWrapper>
      </body>
    </html>
  );
}
