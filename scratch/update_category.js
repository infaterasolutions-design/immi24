require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateCategory() {
  const { error } = await supabase.from('categories').update({
    seo_title: 'Insights – Immigrant Life Tips, City Guides & Real Experiences | US Immigration News',
    seo_description: 'Real stories, city guides, and insider tips for immigrants living in the US. Practical advice nobody else tells you.'
  }).eq('slug', 'insights');
  
  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Updated insights category metadata.');
  }
}

updateCategory();
