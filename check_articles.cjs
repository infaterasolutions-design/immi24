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
  const { data, error } = await supabase.from('articles')
    .select('id, title, category_slug, category_label, published_at')
    .order('published_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Recent articles:', data);
  }
}
main();
