export const CATEGORIES = [
  {
    name: "Visa News",
    slug: "visa-news",
    subcategories: [
      { name: "B1/B2 (Tourist & Business)", slug: "b1-b2" },
      { name: "Consulate Alerts", slug: "consulate-alerts" },
      { name: "H1B Visa", slug: "h1b-visa" },
      { name: "Green Card", slug: "green-card" },
      { name: "F1 & OPT/CPT", slug: "f1-opt" },
      { name: "USCIS Updates", slug: "uscis-updates" }
    ]
  },
  {
    name: "Visa Guides",
    slug: "visa-guides",
    subcategories: [
      { name: "How-To Articles", slug: "how-to" },
      { name: "Application Steps", slug: "application-steps" },
      { name: "FAQs", slug: "faqs" }
    ]
  },
  {
    name: "Processing Times",
    slug: "processing-times",
    subcategories: [
      { name: "USCIS Service Center Timelines", slug: "uscis-timelines" },
      { name: "State-wise Consulate Appointment Wait Times", slug: "consulate-wait-times" }
    ]
  },
  {
    name: "Visa Bulletin",
    slug: "visa-bulletin",
    subcategories: [
      { name: "Latest Bulletin", slug: "latest" },
      { name: "Predictions & Analysis", slug: "predictions" }
    ]
  },
  {
    name: "Fee Calculator",
    slug: "fee-calculator",
    subcategories: [
      { name: "Tool Page", slug: "tool" },
      { name: "Fee Breakdown", slug: "breakdown" }
    ]
  },
  {
    name: "Tools",
    slug: "tools",
    subcategories: [
      { name: "Visa Status Checker", slug: "status-checker" },
      { name: "USCIS Case Tracker", slug: "case-tracker" },
      { name: "H1B Lottery Tracker", slug: "lottery-tracker" }
    ]
  },
  {
    name: "About",
    slug: "about",
    subcategories: [
      { name: "Mission Statement", slug: "mission-statement" },
      { name: "Disclaimer", slug: "disclaimer" },
      { name: "Contact Info", slug: "contact-info" }
    ]
  }
];

export function getCategoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getSubcategoryBySlug(categorySlug, subCategorySlug) {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return null;
  return cat.subcategories.find(s => s.slug === subCategorySlug);
}
