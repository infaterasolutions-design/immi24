"use server";

import { createClient } from "@supabase/supabase-js";

// Note: Ensure this uses service role key if available, otherwise anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import { revalidatePath } from "next/cache";

export async function recordInteraction(articleId, type) {
  try {
    // Determine which column to update based on the type
    let columnToUpdate;
    if (type === "like") columnToUpdate = "likes_count";
    else if (type === "save") columnToUpdate = "saves_count";
    else if (type === "share") columnToUpdate = "shares_count";
    else return { success: false, error: "Invalid interaction type" };

    // Fetch the current value
    const { data: article, error: fetchError } = await supabase
      .from("articles")
      .select(columnToUpdate)
      .eq("id", articleId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch article for interaction:", fetchError);
      return { success: false, error: fetchError.message };
    }

    const currentValue = article[columnToUpdate] || 0;
    const newValue = currentValue + 1;

    // Update the value
    const { error: updateError } = await supabase
      .from("articles")
      .update({ [columnToUpdate]: newValue })
      .eq("id", articleId);

    if (updateError) {
      console.error("Failed to update interaction count:", updateError);
      return { success: false, error: updateError.message };
    }

    // Bust the Next.js cache so the updated count is served on refresh
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.log("Could not revalidate path in server action");
    }

    return { success: true, count: newValue };
  } catch (error) {
    console.error("Interaction server action failed:", error);
    return { success: false, error: error.message };
  }
}
