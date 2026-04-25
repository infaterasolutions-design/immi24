import { supabase } from "./supabase";

export async function getVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching videos:", error);
    return [];
  }

  return (data || []).map(v => ({
    ...v,
    videoUrl: v.video_url,
    categoryLabel: v.category_label,
    articleId: v.article_id,
    createdAt: v.created_at,
    // For backward compatibility with the reels component
    mainImage: v.thumbnail,
    paragraphs: v.description ? [v.description] : [],
  }));
}


