"use server";

import { supabase } from "@/lib/supabase";

export async function getRecommendedPopupData() {
  try {
    // Fetch the single article marked as recommended
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, main_image')
      .eq('is_recommended_popup', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return data;
  } catch (error) {
    console.error("Error fetching recommended popup data:", error);
    return null;
  }
}
