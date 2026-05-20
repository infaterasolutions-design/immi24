import { supabase } from "@/lib/supabase";

export async function GET() {
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, cluster_slug, published_at')
    .eq('status', 'published')
    .eq('is_indexed', true)
    .gte('published_at', fortyEightHoursAgo)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${(articles || []).map(article => {
    const path = article.cluster_slug ? `/${article.cluster_slug}/${article.slug}` : `/${article.slug}`;
    const url = `https://www.unitedstatesimmigrationnews.com${path}`;
    const pubDate = new Date(article.published_at).toISOString();
    
    const title = (article.title || '').replace(/&/g, '&amp;')
                                       .replace(/</g, '&lt;')
                                       .replace(/>/g, '&gt;')
                                       .replace(/"/g, '&quot;')
                                       .replace(/'/g, '&apos;');

    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${pubDate}</lastmod>
    <news:news>
      <news:publication>
        <news:name>United States Immigration News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
  }).join('')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
