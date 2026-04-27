"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function DelayedGTM({ gtmId }) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load GTM on any user interaction
    const loadGTM = () => {
      if (!shouldLoad) {
        setShouldLoad(true);
        // Clean up listeners once triggered
        window.removeEventListener("scroll", loadGTM);
        window.removeEventListener("mousemove", loadGTM);
        window.removeEventListener("touchstart", loadGTM);
        window.removeEventListener("keydown", loadGTM);
      }
    };

    window.addEventListener("scroll", loadGTM, { passive: true });
    window.addEventListener("mousemove", loadGTM, { passive: true });
    window.addEventListener("touchstart", loadGTM, { passive: true });
    window.addEventListener("keydown", loadGTM, { passive: true });

    return () => {
      window.removeEventListener("scroll", loadGTM);
      window.removeEventListener("mousemove", loadGTM);
      window.removeEventListener("touchstart", loadGTM);
      window.removeEventListener("keydown", loadGTM);
    };
  }, [shouldLoad]);

  if (!shouldLoad || !gtmId || gtmId === "GTM-PLACEHOLDER") return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${gtmId}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
