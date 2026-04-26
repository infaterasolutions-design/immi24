"use server";

import { supabase } from "@/lib/supabase";

export async function getSidebarData() {
  try {
    // 1. Fetch Latest News (top 3 most recent articles)
    const { data: latestData } = await supabase
      .from('articles')
      .select('id, title, slug, published_at')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(3);

    // 2. Fetch Most Viewed (top 3 articles marked as is_most_viewed = true)
    let { data: mostViewedData } = await supabase
      .from('articles')
      .select('id, title, slug, category_label')
      .eq('is_most_viewed', true)
      .limit(3);

    // Fallback: If no articles are manually marked as "Most Viewed", just grab 3 random/older articles
    if (!mostViewedData || mostViewedData.length === 0) {
      const { data: fallbackData } = await supabase
        .from('articles')
        .select('id, title, slug, category_label')
        .limit(3);
      mostViewedData = fallbackData;
    }

    return {
      latestNews: latestData || [],
      mostViewed: mostViewedData || []
    };
  } catch (error) {
    console.error("Error fetching sidebar data:", error);
    return { latestNews: [], mostViewed: [] };
  }
}
