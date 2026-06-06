require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkDescriptions() {
  const { data } = await supabase.from('categories').select('slug, description');
  console.log(data);
}

checkDescriptions();
