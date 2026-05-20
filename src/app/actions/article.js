"use server";

import { supabase } from "@/lib/supabase";
import { getClusterDisplayName } from "@/lib/clusterHelpers";
// Simple join — only fetch the direct location (no nested self-join which Supabase doesn't support)
const ARTICLE_SELECT = '*, location:locations!location_id(id, name, slug, parent_id)';

/**
 * Fetch the parent location for a given location object.
 */
async function fetchLocationParent(location) {
  if (!location || !location.parent_id) return location;

  const { data: parent } = await supabase
    .from("locations")
    .select("id, name, slug")
    .eq("id", location.parent_id)
    .single();

  return { ...location, parent: parent || null };
}

function mapDbToFrontend(article) {
  if (!article) return null;
  
  // We mapped the Rich HTML into the first element of the paragraphs array to avoid SQL schema changes
  const isRichHtml = Array.isArray(article.paragraphs) && article.paragraphs.length === 1 && article.paragraphs[0].includes('<');
  
  // Map location data (parent will be attached by the caller)
  let locationData = null;
  if (article.location) {
    locationData = {
      id: article.location.id,
      name: article.location.name,
      slug: article.location.slug,
      parentName: article.location.parent?.name || null,
      parentSlug: article.location.parent?.slug || null,
    };
  }

  return {
    ...article,
    categoryLabel: article.category_label,
    categorySlug: article.category_slug,
    subCategorySlug: article.sub_category_slug,
    cluster_slug: article.cluster_slug,
    clusterSlug: article.cluster_slug,
    authorName: article.author_name,
    authorImage: article.author_image,
    mainImage: article.main_image,
    imageCaption: article.image_caption,
    subTitle: article.sub_title,
    readTime: article.read_time,
    subParagraphs: isRichHtml ? null : article.sub_paragraphs,
    paragraphs: isRichHtml ? null : article.paragraphs,
    contentHtml: isRichHtml ? article.paragraphs[0] : null,
    location: locationData,
  };
}

/**
 * Helper: fetch article, resolve location parent, then map to frontend shape.
 */
async function resolveArticle(article) {
  if (!article) return null;
  if (article.location && article.location.parent_id) {
    article.location = await fetchLocationParent(article.location);
  }
  
  const mapped = mapDbToFrontend(article);
  if (mapped.cluster_slug) {
    mapped.clusterDisplayName = await getClusterDisplayName(mapped.cluster_slug);
  }
  return mapped;
}

export async function fetchNextArticleAction(slug, publishedAt) {
  if (!slug || !publishedAt) return null;

  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const { data, error } = await supabase.from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .eq('is_indexed', true)
    .gt('published_at', publishedAt)
    .neq('slug', slug)
    .order('published_at', { ascending: true })
    .limit(1)
    .maybeSingle();
    
  if (error) {
    console.error('fetchNextArticle error:', error);
    return null;
  }
  
  if (!data) return null;
  
  return resolveArticle(data);
}

export async function fetchArticleInitialData(id) {
  const { data, error } = await supabase.from('articles').select(ARTICLE_SELECT).eq('id', id).eq('status', 'published').single();
  if (error || !data) return null;
  
  return resolveArticle(data);
}

export async function fetchArticleInitialDataBySlug(slug) {
  const { data, error } = await supabase.from('articles').select(ARTICLE_SELECT).eq('slug', slug).eq('status', 'published').single();
  if (error || !data) return null;
  
  return resolveArticle(data);
}
