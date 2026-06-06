require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function addCategory() {
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
  console.log('Existing categories:', categories);

  const existing = categories.find(c => c.slug === 'insights');
  if (!existing) {
    // Find highest sort order
    const maxSort = categories.reduce((max, c) => Math.max(max, c.sort_order || 0), 0);
    const { error } = await supabase.from('categories').insert([
      { 
        name: 'Insights', 
        slug: 'insights', 
        sort_order: maxSort + 1,
        // no parent_slug for top-level category
      }
    ]);
    if (error) {
      console.error('Error inserting:', error);
    } else {
      console.log('Inserted "insights" category at sort_order', maxSort + 1);
    }
  } else {
    console.log('Insights already exists.');
  }
}

addCategory();
