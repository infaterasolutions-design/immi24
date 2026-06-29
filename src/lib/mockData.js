import { supabase } from "./supabase";

export async function getArticleById(id) {

  const { data, error } = await supabase.from('articles').select('*').eq('id', id).eq('status', 'published').single();
  if (error || !data) {
    console.error("Error fetching article by id:", error);
    return null;
  }
  const mapped = mapArticle(data);
  return mapped;
}

export async function getNextArticle(currentId) {
  const allArts = await getAllArticles();
  if (!allArts) return null;
  const currentIndex = allArts.findIndex(a => a.id === currentId);
  if (currentIndex === -1 || currentIndex === allArts.length - 1) return null;
  return allArts[currentIndex + 1];
}

const LIGHT_ARTICLE_FIELDS = "id, title, slug, category_slug, sub_category_slug, cluster_slug, category_label, published_at, read_time, author_name, author_role, author_image, main_image, image_caption, sub_title, status, is_featured";

export async function getArticlesByCategorySlug(categorySlug) {
  const { data, error } = await supabase.from('articles')
    .select(LIGHT_ARTICLE_FIELDS)
    .eq('category_slug', categorySlug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(100);
  
  return (data || []).map(mapArticle);
}

export async function getArticlesBySubcategorySlug(categorySlug, subCategorySlug) {
  const { data, error } = await supabase.from('articles')
    .select(LIGHT_ARTICLE_FIELDS)
    .eq('category_slug', categorySlug)
    .eq('sub_category_slug', subCategorySlug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(100);
  
  return (data || []).map(mapArticle);
}

export async function getAllArticles() {
  const { data, error } = await supabase.from('articles')
    .select(LIGHT_ARTICLE_FIELDS)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(100); // Limit homepage fetch to prevent massive memory crash
  
  return data ? data.map(mapArticle) : [];
}

function mapArticle(a) {
  let formattedDate = a.date;
  if (a.published_at) {
    const d = new Date(a.published_at);
    if (!isNaN(d.getTime())) {
      // Use UTC timezone so that the date displayed matches the literal UTC date of published_at 
      // rather than shifting based on server timezone.
      formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    }
  }

  return {
    ...a,
    date: formattedDate,
    categorySlug: a.category_slug,
    subCategorySlug: a.sub_category_slug,
    cluster_slug: a.cluster_slug,
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
