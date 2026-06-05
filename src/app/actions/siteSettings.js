"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
    // 1. Fetch current count
    const { data: currentData, error: fetchError } = await supabase
      .from("site_settings")
      .select("homepage_shares_count")
      .eq("id", 1)
      .single();

    if (fetchError) {
      console.error("Failed to fetch homepage shares for incrementing:", fetchError);
      return { success: false, error: fetchError.message };
    }

    const newCount = (currentData?.homepage_shares_count || 0) + 1;

    // 2. Update count
    const { error: updateError } = await supabase
      .from("site_settings")
      .update({ homepage_shares_count: newCount })
      .eq("id", 1);

    if (updateError) {
      console.error("Failed to update homepage shares count:", updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true, count: newCount };
  } catch (error) {
    console.error("Increment server action failed:", error);
    return { success: false, error: error.message };
  }
}
