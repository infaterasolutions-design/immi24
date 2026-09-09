"use server";

import { createClient } from "@supabase/supabase-js";

// Note: Ensure this uses service role key if available, otherwise anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import { revalidatePath } from "next/cache";

export async function recordInteraction(articleId, type) {
  try {
    if (!["like", "save", "share"].includes(type)) {
      return { success: false, error: "Invalid interaction type" };
    }

    // Call the secure RPC function to bypass RLS for this specific action
    const { error: rpcError } = await supabase.rpc('increment_article_interaction', { 
      p_article_id: articleId, 
      p_interaction_type: type 
    });

    if (rpcError) {
      console.error("Failed to update interaction count via RPC:", rpcError);
      return { success: false, error: rpcError.message };
    }

    // Bust the Next.js cache so the updated count is served on refresh
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.log("Could not revalidate path in server action");
    }

    return { success: true };
  } catch (error) {
    console.error("Interaction server action failed:", error);
    return { success: false, error: error.message };
  }
}
