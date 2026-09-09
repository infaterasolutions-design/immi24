import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const now = new Date().toISOString();
  console.log("Testing with now:", now);
  
  // test 1: without quotes
  const res1 = await supabase
    .from("sponsored_content")
    .select("*")
    .eq("is_active", true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(6);
    
  console.log("Res 1 error:", res1.error);
  console.log("Res 1 data:", res1.data);

  // test 2: with quotes (current code)
  const res2 = await supabase
    .from("sponsored_content")
    .select("*")
    .eq("is_active", true)
    .or(`start_date.is.null,start_date.lte."${now}"`)
    .or(`end_date.is.null,end_date.gte."${now}"`)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(6);

  console.log("Res 2 error:", res2.error);
  console.log("Res 2 data:", res2.data);
}

test();
