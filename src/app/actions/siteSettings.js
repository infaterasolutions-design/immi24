"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getHomepageShares() {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("homepage_shares_count")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch homepage shares:", error);
      return { success: false, error: error.message };
    }

    return { success: true, count: data?.homepage_shares_count || 0 };
  } catch (error) {
    console.error("Server action failed:", error);
    return { success: false, error: error.message };
  }
}

export async function incrementHomepageShares() {
  try {
    // Call the secure RPC function to bypass RLS for this specific action
    const { error: rpcError } = await supabase.rpc('increment_homepage_share');

    if (rpcError) {
      console.error("Failed to update homepage shares count via RPC:", rpcError);
      return { success: false, error: rpcError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Increment server action failed:", error);
    return { success: false, error: error.message };
  }
}
