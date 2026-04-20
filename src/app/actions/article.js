"use server";

import { supabase } from "@/lib/supabase";

function mapDbToFrontend(article) {
  if (!article) return null;
  return {
    ...article,
    categoryLabel: article.category_label,
    categorySlug: article.category_slug,
    subCategorySlug: article.sub_category_slug,
    authorName: article.author_name,
    authorImage: article.author_image,
    mainImage: article.main_image,
    imageCaption: article.image_caption,
    subTitle: article.sub_title,
    readTime: article.read_time,
    subParagraphs: article.sub_paragraphs,
    contentHtml: article.content_html, // newly added HTML content field
  };
}

export async function fetchNextArticleAction(currentId) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Find the next active article that was created before the current one
  const { data: currentArt } = await supabase.from('articles').select('created_at').eq('id', currentId).single();
  let query = supabase.from('articles').select('*').eq('status', 'published');
  
  if (currentArt?.created_at) {
     query = query.lt('created_at', currentArt.created_at).order('created_at', { ascending: false }).limit(1);
  } else {
     // fallback if ordered by something else
     query = query.neq('id', currentId).limit(1);
  }
  
  const { data, error } = await query.single();
  if (error || !data) return null;
  
  return mapDbToFrontend(data);
}

export async function fetchArticleInitialData(id) {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
  if (error || !data) return null;
  
  return mapDbToFrontend(data);
}
