import { supabase } from "./supabase";

/**
 * Fetches all clusters from the database.
 * Used by admin panels and anywhere the full list is needed.
 */
export async function getAllClusters() {
  const { data, error } = await supabase
    .from('clusters')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) {
    console.error("Error fetching clusters:", error);
    return [];
  }
  return data || [];
}

/**
 * Gets a correctly formatted display name for a given cluster slug.
 * Used by Breadcrumbs and Category tags.
 */
export async function getClusterDisplayName(slug) {
  if (!slug) return null;
  
  const { data } = await supabase
    .from('clusters')
    .select('name')
    .eq('slug', slug)
    .maybeSingle();
    
  if (data && data.name) {
    return data.name;
  }
  
  // Fallback if not in database
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
