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
  const { data: layoutData } = await supabase.from('homepage_layout').select('*').limit(1);
  const { data: articleData } = await supabase.from('articles').select('id').limit(1);
  
  if (layoutData && layoutData.length > 0) {
    console.log('Layout ID type:', typeof layoutData[0].hero_article_id);
    console.log('Layout ID:', layoutData[0].hero_article_id);
  }
  if (articleData && articleData.length > 0) {
    console.log('Article ID type:', typeof articleData[0].id);
    console.log('Article ID:', articleData[0].id);
  }
}
main();
