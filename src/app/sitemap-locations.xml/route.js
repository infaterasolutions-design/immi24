import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: locations } = await supabase.from('locations').select('id, slug, parent_id, created_at');

  const states = (locations || []).filter(l => !l.parent_id);
  const cities = (locations || []).filter(l => l.parent_id);
  
  const stateMap = {};
  states.forEach(s => { stateMap[s.id] = s; });

  const urls = [];

  states.forEach(state => {
    urls.push({
      loc: `https://www.unitedstatesimmigrationnews.com/${state.slug}/`,
      lastmod: new Date(state.created_at).toISOString()
    });
  });

  cities.forEach(city => {
    const parent = stateMap[city.parent_id];
    if (parent) {
      urls.push({
        loc: `https://www.unitedstatesimmigrationnews.com/${parent.slug}/${city.slug}/`,
        lastmod: new Date(city.created_at).toISOString()
      });
    }
  });

  const excludedPrefixes = ['/maryland/', '/minnesota/'];
  const finalUrls = urls.filter(u => {
    const path = new URL(u.loc).pathname;
    return !excludedPrefixes.some(prefix => path.startsWith(prefix));
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${finalUrls.map(urlData => `
  <url>
    <loc>${urlData.loc}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
