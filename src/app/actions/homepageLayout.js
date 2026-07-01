"use server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getHomepageLayout() {
  const { data, error } = await supabase.from('homepage_layout').select('*').eq('id', 1).maybeSingle();
  if (error) {
    console.error("Error fetching homepage layout:", error);
    return null;
  }
  return data || { id: 1, hero_article_id: null, grid1_article_id: null, grid2_article_id: null, grid3_article_id: null, grid4_article_id: null };
}

export async function updateHomepageLayout(payload) {
  // Try to update or insert if it doesn't exist
  const { error } = await supabase.from('homepage_layout').upsert({ id: 1, ...payload });
  if (error) {
    console.error("Error updating layout:", error);
    return { success: false, error: error.message };
  }
  
  // Revalidate homepage
  revalidatePath("/", "page");
  
  return { success: true };
}

export async function revalidateHomepage() {
  revalidatePath("/", "page");
}
