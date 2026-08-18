const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, paragraphs')
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('No articles found.');
    return;
  }

  for (const article of data) {
    console.log(`\n--- Article: ${article.title} ---`);
    if (article.paragraphs && article.paragraphs.length > 0) {
      const html = article.paragraphs[0];
      const linkMatch = html.match(/<a [^>]+>/g);
      console.log('Links found:');
      if (linkMatch) {
         linkMatch.forEach(l => console.log('  ' + l));
      } else {
         console.log('  None');
      }
    } else {
      console.log('No paragraphs HTML.');
    }
  }
}

main();
