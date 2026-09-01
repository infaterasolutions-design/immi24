import Link from "next/link";

const SITE_URL = "https://www.unitedstatesimmigrationnews.com";

/**
 * Breadcrumb component with JSON-LD structured data.
 * 
 * Props:
 * - category: { name, slug } — the parent category
 * - subcategory: { name, slug } — optional subcategory
 * - articleTitle: optional string for the current article
 */
export default function Breadcrumb({ category, subcategory, articleTitle }) {
  const items = [
    { name: "Home", url: "/" },
  ];

  if (category) {
    items.push({ name: category.name, url: `/${category.slug}/` });
  }

  if (subcategory) {
    items.push({ name: subcategory.name, url: `/${category.slug}/${subcategory.slug}/` });
  }

  if (articleTitle) {
    items.push({ name: articleTitle, url: "#" });
  }

  // JSON-LD BreadcrumbList structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 w-full">
        <ol className="flex items-center gap-1 text-[12px] text-slate-500 font-medium overflow-x-auto whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center gap-1 shrink-0">
              {index > 0 && (
                <span className="material-symbols-outlined text-[14px] text-slate-300">chevron_right</span>
              )}
              {index < items.length - 1 ? (
                <Link
                  href={item.url}
                  className="hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-slate-700 font-semibold truncate max-w-[200px] sm:max-w-none">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
