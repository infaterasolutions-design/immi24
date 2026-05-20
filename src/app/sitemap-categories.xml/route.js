import { supabase } from "@/lib/supabase";

export async function GET() {
  const urls = new Set();
  const dateMap = {};

  const { data: categories } = await supabase.from('categories').select('slug, parent_slug');
  if (categories) {
    categories.forEach(cat => {
      if (!cat.parent_slug) {
        urls.add(`/${cat.slug}/`);
      } else {
        urls.add(`/${cat.parent_slug}/${cat.slug}/`);
      }
    });
  }

  const { data: articles } = await supabase
    .from('articles')
    .select('category_slug, sub_category_slug, cluster_slug, published_at')
    .eq('status', 'published')
    .eq('is_indexed', true);

  if (articles) {
    articles.forEach(article => {
      if (article.cluster_slug) {
        const clusterUrl = `/${article.cluster_slug}/`;
        urls.add(clusterUrl);
        if (!dateMap[clusterUrl] || new Date(article.published_at) > new Date(dateMap[clusterUrl])) {
          dateMap[clusterUrl] = article.published_at;
        }
      }

      if (article.category_slug) {
        const catUrl = `/${article.category_slug}/`;
        if (!dateMap[catUrl] || new Date(article.published_at) > new Date(dateMap[catUrl])) {
          dateMap[catUrl] = article.published_at;
        }
      }
      
      if (article.category_slug && article.sub_category_slug) {
        const subUrl = `/${article.category_slug}/${article.sub_category_slug}/`;
        if (!dateMap[subUrl] || new Date(article.published_at) > new Date(dateMap[subUrl])) {
          dateMap[subUrl] = article.published_at;
        }
      }
    });
  }

  const { data: liveEvents } = await supabase
    .from('live_events')
    .select('topic_url, updated_at, created_at')
    .eq('status', 'active');
  
  if (liveEvents) {
    liveEvents.forEach(event => {
      if (event.topic_url) {
        const url = `/${event.topic_url}/`;
        urls.add(url);
        const eventDate = event.updated_at || event.created_at;
        if (!dateMap[url] || new Date(eventDate) > new Date(dateMap[url])) {
          dateMap[url] = eventDate;
        }
      }
    });
  }

  const fallbacks = [
    '/ice-news/',
    '/immigration-news/',
    '/h1b/',
    '/green-card/',
    '/f1-visa/',
    '/uscis-delays/',
    '/uscis-news/',
    '/asylum-tps/'
  ];
  fallbacks.forEach(fb => urls.add(fb));

  const fallbackDate = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${Array.from(urls).map(path => {
    const lastMod = dateMap[path] ? new Date(dateMap[path]).toISOString() : fallbackDate;
    return `
  <url>
    <loc>https://www.unitedstatesimmigrationnews.com${path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
