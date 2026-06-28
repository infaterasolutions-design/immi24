import { Plus_Jakarta_Sans, Inter, Poppins } from "next/font/google";
import "./globals.css";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import Script from "next/script";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

import DelayedGTM from '@/components/DelayedGTM';
import SocialSidebar from '@/components/SocialSidebar';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  title: "US Immigration News & Updates | Visas, Green Cards, USCIS & ICE News",
  description: "Get the latest USA immigration news, visa updates, green card processing times, USCIS announcements, and ICE policy changes. Trusted daily immigration updates and guides.",
  alternates: {
    canonical: 'https://www.unitedstatesimmigrationnews.com/',
    languages: {
      'en-US': 'https://www.unitedstatesimmigrationnews.com/',
      'x-default': 'https://www.unitedstatesimmigrationnews.com/',
    },
    types: {
      "application/rss+xml": [
        { url: "https://www.unitedstatesimmigrationnews.com/rss.xml", title: "US Immigration News – All Updates" },
        { url: "https://www.unitedstatesimmigrationnews.com/rss/insights.xml", title: "US Immigration News – Insights" }
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  verification: {
    google: 'Ldppw4bsEBlMOJ9twEOQSXGwZG-kvWPWXw8t5IBhPe4',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { getCategories } from "@/lib/categoryConfig";
import SiteSchema from "@/components/SiteSchema";
export default async function RootLayout({ children }) {
  // Use environment variable, fallback to empty string if not set
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PLACEHOLDER';

  // Fetch categories on the server to prevent navbar flashing
  const categories = await getCategories();

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} ${poppins.variable}`} suppressHydrationWarning={true}>
      <head>
        <meta property="fb:app_id" content="2003958383541773" />
        <link rel="preconnect" href="https://elbxclhtmlbdlegsfzqh.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://elbxclhtmlbdlegsfzqh.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="antialiased overflow-x-hidden min-h-screen flex flex-col">
        <Script
          id="material-symbols-font"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
              document.head.appendChild(link);
            `
          }}
        />
        {/* Safely inject GTM without blocking render */}
        {gtmId !== 'GTM-PLACEHOLDER' && <DelayedGTM gtmId={gtmId} />}
        
        <GoogleAnalytics gaId="G-3C6CJJ0R09" />

        <Script id="ms-clarity" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xebi8u4dt3");
          `
        }} />
        
        <SocialSidebar />
        <SiteSchema />
        <PublicLayoutWrapper categories={categories}>
          {children}
        </PublicLayoutWrapper>
      </body>
    </html>
  );
}
