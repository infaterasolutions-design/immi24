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

export async function subscribeEmail(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .insert([{ email }]);

  if (error) {
    if (error.code === '23505') {
      // Duplicate email — already subscribed
      return { success: true, message: "You're already subscribed!" };
    }
    console.error("Error subscribing:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }

  return { success: true, message: "Successfully subscribed!" };
}
