import { Plus_Jakarta_Sans, Inter, Poppins } from "next/font/google";
import "./globals.css";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import Script from "next/script";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Digital Diplomat | USA Immigration News",
  description: "Your Trusted Authority on US Immigration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Script src="https://platform.twitter.com/widgets.js" strategy="afterInteractive" />
        <Script src="https://www.instagram.com/embed.js" strategy="afterInteractive" />
        <PublicLayoutWrapper>
          {children}
        </PublicLayoutWrapper>
      </body>
    </html>
  );
}
