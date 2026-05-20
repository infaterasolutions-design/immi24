import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: latestArticle } = await supabase
    .from('articles')
    .select('published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const siteLastMod = latestArticle ? new Date(latestArticle.published_at).toISOString() : new Date().toISOString();

  const pages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.4', changefreq: 'monthly' },
    { path: '/contact', priority: '0.4', changefreq: 'monthly' },
    { path: '/editorial-guidelines', priority: '0.4', changefreq: 'monthly' },
    { path: '/advertise', priority: '0.4', changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>https://www.unitedstatesimmigrationnews.com${page.path}</loc>
    <lastmod>${siteLastMod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
