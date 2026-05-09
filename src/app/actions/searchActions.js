"use server";

import { supabase } from "@/lib/supabase";

export async function searchInternalArticles(query) {
  if (!query || query.length < 2) return [];

  const { data, error } = await supabase
    .from('articles')
    .select('title, slug, category_label, published_at')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,slug.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('searchInternalArticles error:', error);
    return [];
  }

  return data || [];
}
