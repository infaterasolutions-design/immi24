import { supabase } from "./supabase";

const cache = {
  articlesById: new Map(),
  articlesByCategory: new Map(),
  allArticles: { data: null, timestamp: 0 },
};

const CACHE_TTL = 60000; // 60 seconds

export async function getArticleById(id) {
  if (cache.articlesById.has(id)) {
    const cached = cache.articlesById.get(id);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
  if (error || !data) {
    console.error("Error fetching article by id:", error);
    return null;
  }
  const mapped = mapArticle(data);
  cache.articlesById.set(id, { data: mapped, timestamp: Date.now() });
  return mapped;
}

export async function getNextArticle(currentId) {
  const allArts = await getAllArticles();
  if (!allArts) return null;
  const currentIndex = allArts.findIndex(a => a.id === currentId);
  if (currentIndex === -1 || currentIndex === allArts.length - 1) return null;
  return allArts[currentIndex + 1];
}

export async function getArticlesByCategorySlug(categorySlug) {
  const cacheKey = categorySlug;
  if (cache.articlesByCategory.has(cacheKey)) {
    const cached = cache.articlesByCategory.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  const { data, error } = await supabase.from('articles')
    .select('*')
    .eq('category_slug', categorySlug)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });
  
  const mapped = (data || []).map(mapArticle);
  cache.articlesByCategory.set(cacheKey, { data: mapped, timestamp: Date.now() });
  return mapped;
}

export async function getArticlesBySubcategorySlug(categorySlug, subCategorySlug) {
  const cacheKey = `${categorySlug}_${subCategorySlug}`;
  if (cache.articlesByCategory.has(cacheKey)) {
    const cached = cache.articlesByCategory.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  const { data, error } = await supabase.from('articles')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('sub_category_slug', subCategorySlug)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });
  
  const mapped = (data || []).map(mapArticle);
  cache.articlesByCategory.set(cacheKey, { data: mapped, timestamp: Date.now() });
  return mapped;
}

export async function getAllArticles() {
  if (cache.allArticles.data && (Date.now() - cache.allArticles.timestamp < CACHE_TTL)) {
    return cache.allArticles.data;
  }

  const { data, error } = await supabase.from('articles')
    .select('*')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });
  
  const mapped = data ? data.map(mapArticle) : [];
  cache.allArticles = { data: mapped, timestamp: Date.now() };
  return mapped;
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
