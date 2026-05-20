import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, cluster_slug, published_at')
    .eq('status', 'published')
    .eq('is_indexed', true)
    .or('category_slug.eq.shorts,tags.cs.{"shorts"}')
    .order('published_at', { ascending: false });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${(articles || []).map(article => {
    const path = article.cluster_slug ? `/${article.cluster_slug}/${article.slug}` : `/${article.slug}`;
    const pubDate = new Date(article.published_at).toISOString();
    return `
  <url>
    <loc>https://www.unitedstatesimmigrationnews.com${path}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`;
  }).join('')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
