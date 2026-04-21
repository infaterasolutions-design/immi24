import { supabase } from "./supabase";

export async function getArticleById(id) {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
  if (error || !data) {
    console.error("Error fetching article by id:", error);
    return null;
  }
  return mapArticle(data);
}

export async function getNextArticle(currentId) {
  // Ordered by date or ID. Suppose we just fetch all and find index, or fetch one with ID > currentId.
  // The simplest is to match the previous logic: sort by ID desc or just get all for now to find the next.
  // Actually, since IDs are strings like "1", "2", sorting might be lexical. 
  // For simplicity, let's just fetch all and find the next index, or fetch next by parsing ID.
  const { data: allArts } = await supabase.from('articles')
    .select('*')
    .lte('published_at', new Date().toISOString());
  if (!allArts) return null;
  const currentIndex = allArts.findIndex(a => a.id === currentId);
  if (currentIndex === -1 || currentIndex === allArts.length - 1) return null;
  return mapArticle(allArts[currentIndex + 1]);
}

export async function getArticlesByCategorySlug(categorySlug) {
  const { data, error } = await supabase.from('articles')
    .select('*')
    .eq('category_slug', categorySlug)
    .lte('published_at', new Date().toISOString());
  return (data || []).map(mapArticle);
}

export async function getArticlesBySubcategorySlug(categorySlug, subCategorySlug) {
  const { data, error } = await supabase.from('articles')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('sub_category_slug', subCategorySlug)
    .lte('published_at', new Date().toISOString());
  return (data || []).map(mapArticle);
}

export async function getAllArticles() {
  const { data, error } = await supabase.from('articles')
    .select('*')
    .lte('published_at', new Date().toISOString());
  return data ? data.map(mapArticle).reverse() : [];
}

function mapArticle(a) {
  return {
    ...a,
    categorySlug: a.category_slug,
    subCategorySlug: a.sub_category_slug,
    categoryLabel: a.category_label,
    readTime: a.read_time,
    authorName: a.author_name,
    authorRole: a.author_role,
    authorImage: a.author_image,
    mainImage: a.main_image,
    imageCaption: a.image_caption,
    subTitle: a.sub_title,
    subParagraphs: a.sub_paragraphs
  };
}

// Fallback empty array for places that previously did `import { mockArticles }` directly,
// though they should be refactored to use getAllArticles().
export const mockArticles = [];
