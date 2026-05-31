"use server";

import { supabase } from "@/lib/supabase";

/**
 * Fetch a single author by their URL slug.
 */
export async function getAuthorBySlug(slug) {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching author:", error);
    return null;
  }
  return data;
}

/**
 * Fetch published articles written by a given author name.
 * Sorted by published_at descending.
 */
export async function getArticlesByAuthor(authorName, limit = 50) {
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, main_image, category_label, category_slug, sub_category_slug, cluster_slug, published_at, read_time, sub_title, author_name, author_image")
    .eq("status", "published")
    .eq("author_name", authorName)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching articles by author:", error);
    return [];
  }
  return data || [];
}

/**
 * Fetch all author slugs (for generateStaticParams).
 */
export async function getAllAuthorSlugs() {
  const { data } = await supabase
    .from("authors")
    .select("slug");
  return data?.map((a) => ({ slug: a.slug })) || [];
}

/**
 * Fetch all authors (for admin panel).
 */
export async function getAllAuthors() {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching all authors:", error);
    return [];
  }
  return data || [];
}

/**
 * Create a new author.
 */
export async function createAuthor(payload) {
  const { data, error } = await supabase
    .from("authors")
    .insert(payload)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

/**
 * Update an existing author.
 */
export async function updateAuthor(id, payload) {
  const { data, error } = await supabase
    .from("authors")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

/**
 * Delete an author.
 */
export async function deleteAuthor(id) {
  const { error } = await supabase
    .from("authors")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
