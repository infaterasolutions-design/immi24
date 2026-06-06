require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateCategory() {
  const { error } = await supabase.from('categories').update({
    seo_title: 'Life in America for Immigrants | U.S. Demographic Insights Related to Local Immigrant Life',
    seo_description: 'Explore practical insights, real-life experiences, local trends, and community perspectives that shape immigrant life across the United States. From settling into new cities and navigating everyday challenges to understanding opportunities, services, and cultural communities, our Immigration Insights category helps immigrants make more informed decisions about life in America.'
  }).eq('slug', 'insights');
  
  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Updated insights category metadata with the new title and description.');
  }
}

updateCategory();
