import { supabase } from "./supabase";

let cachedCategories = null;

export async function getCategories() {
  if (cachedCategories) return cachedCategories;
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  cachedCategories = data || [];
  return cachedCategories;
}

export async function getCategoryBySlug(slug) {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug) || null;
}

export async function getSubcategoryBySlug(categorySlug, subCategorySlug) {
  const cat = await getCategoryBySlug(categorySlug);
  if (!cat) return null;
  const subs = cat.subcategories || [];
  return subs.find(s => s.slug === subCategorySlug) || null;
}

// Keep a sync export for Header which needs it immediately on render.
// Header will call loadCategories() in useEffect and use state instead.
export const CATEGORIES = [];
