const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data: layoutData } = await supabase.from('homepage_layout').select('*').eq('id', 1).single();
  console.log('Layout:', layoutData);

  const { data: articles } = await supabase.from('articles').select('id, title').eq('status', 'published').order('published_at', { ascending: false }).limit(100);
  
  const articleIds = articles.map(a => String(a.id));
  
  if (layoutData) {
    const layoutIds = [layoutData.hero_article_id, layoutData.grid1_article_id, layoutData.grid2_article_id, layoutData.grid3_article_id, layoutData.grid4_article_id].filter(Boolean);
    console.log('Layout IDs:', layoutIds);
    for (const id of layoutIds) {
      console.log(`Is ${id} in top 100 articles?`, articleIds.includes(String(id)));
    }
  }
}
main();
