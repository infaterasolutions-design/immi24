export default function SiteSchema() {
  const SITE_URL = "https://www.unitedstatesimmigrationnews.com";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "United States Immigration News",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      "https://www.facebook.com/unitedstatesimmigrationnews/",
      "https://x.com/Immi24_news"
    ],
    description: "Fast, fact-checked analysis of shifting U.S. immigration policies, visa updates, and procedural changes — updated 24/7."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
