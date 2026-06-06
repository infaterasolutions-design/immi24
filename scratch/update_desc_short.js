require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateCategory() {
  const { error } = await supabase.from('categories').update({
    description: 'Explore practical insights, real-life experiences, local trends, and community perspectives that shape immigrant life across the United States.'
  }).eq('slug', 'insights');
  
  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Updated insights category description to be one line.');
  }
}

updateCategory();
