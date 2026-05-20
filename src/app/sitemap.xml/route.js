export async function GET() {
  const sitemaps = [
    'sitemap-news.xml',
    'sitemap-categories.xml',
    'sitemap-posts.xml',
    'sitemap-pages.xml',
    'sitemap-locations.xml',
    'sitemap-shorts.xml',
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>https://www.unitedstatesimmigrationnews.com/${sitemap}</loc>
  </sitemap>`).join('')}
</sitemapindex>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
