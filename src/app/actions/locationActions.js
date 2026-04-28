"use server";

import { supabase } from "@/lib/supabase";

/**
 * Generate a URL-safe slug from a location name.
 */
function generateSlug(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

/**
 * Search locations by name (case-insensitive). Returns results with parent info.
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const searchTerm = `%${query.trim().toLowerCase()}%`;

  const { data, error } = await supabase
    .from("locations")
    .select("id, name, slug, parent_id")
    .ilike("name", searchTerm)
    .order("name")
    .limit(15);

  if (error) {
    console.error("Error searching locations:", error);
    return [];
  }

  // Fetch parent info for results that have a parent_id
  const results = data || [];
  const parentIds = [...new Set(results.filter(r => r.parent_id).map(r => r.parent_id))];
  
  let parentsMap = {};
  if (parentIds.length > 0) {
    const { data: parents } = await supabase
      .from("locations")
      .select("id, name, slug")
      .in("id", parentIds);
    if (parents) {
      parents.forEach(p => { parentsMap[p.id] = p; });
    }
  }

  return results.map(loc => ({
    ...loc,
    parent: loc.parent_id ? parentsMap[loc.parent_id] || null : null,
  }));
}

/**
 * Create a new location. Prevents duplicates (case-insensitive).
 * Returns the created or existing location.
 */
export async function createLocation({ name, parentId = null }) {
  const trimmedName = name.trim();
  const slug = generateSlug(trimmedName);

  if (!trimmedName || !slug) return { error: "Invalid location name" };

  // Check if already exists (case-insensitive)
  const { data: existing } = await supabase
    .from("locations")
    .select("id, name, slug, parent_id")
    .ilike("name", trimmedName)
    .maybeSingle();

  if (existing) {
    return { data: existing, existed: true };
  }

  // Also check by slug to prevent "Los-Angeles" vs "los-angeles" conflicts
  const { data: existingBySlug } = await supabase
    .from("locations")
    .select("id, name, slug, parent_id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingBySlug) {
    return { data: existingBySlug, existed: true };
  }

  // Insert new location
  const { data: newLocation, error } = await supabase
    .from("locations")
    .insert({ name: trimmedName, slug, parent_id: parentId })
    .select("id, name, slug, parent_id")
    .single();

  if (error) {
    console.error("Error creating location:", error);
    return { error: error.message };
  }

  return { data: newLocation, existed: false };
}

/**
 * Get a location with its parent info by ID.
 */
export async function getLocationWithParent(locationId) {
  if (!locationId) return null;

  const { data, error } = await supabase
    .from("locations")
    .select("id, name, slug, parent_id")
    .eq("id", locationId)
    .single();

  if (error || !data) return null;

  // Fetch parent if exists
  if (data.parent_id) {
    const { data: parent } = await supabase
      .from("locations")
      .select("id, name, slug")
      .eq("id", data.parent_id)
      .single();
    data.parent = parent || null;
  } else {
    data.parent = null;
  }

  return data;
}

/**
 * Get a location by slug.
 */
export async function getLocationBySlug(slug) {
  const { data, error } = await supabase
    .from("locations")
    .select("id, name, slug, parent_id")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  // Fetch parent if exists
  if (data.parent_id) {
    const { data: parent } = await supabase
      .from("locations")
      .select("id, name, slug")
      .eq("id", data.parent_id)
      .single();
    data.parent = parent || null;
  } else {
    data.parent = null;
  }

  return data;
}

/**
 * Get all child locations (cities) for a parent (state).
 */
export async function getChildLocations(parentId) {
  const { data, error } = await supabase
    .from("locations")
    .select("id, name, slug")
    .eq("parent_id", parentId)
    .order("name");

  if (error) return [];
  return data || [];
}

/**
 * Get all articles for a specific location (by location ID).
 */
export async function getArticlesByLocationId(locationId) {
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, main_image, category_label, read_time, date, published_at, sub_title, image_caption, paragraphs")
    .eq("location_id", locationId)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) return [];
  return data || [];
}

/**
 * Get all articles for a state (includes all child city locations).
 */
export async function getArticlesByState(stateId) {
  // Get all child location IDs
  const { data: children } = await supabase
    .from("locations")
    .select("id")
    .eq("parent_id", stateId);

  const locationIds = [stateId, ...(children || []).map(c => c.id)];

  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, main_image, category_label, read_time, date, published_at, sub_title, image_caption, paragraphs")
    .in("location_id", locationIds)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) return [];
  return data || [];
}

/**
 * Get all parent locations (states) — locations with no parent.
 */
export async function getAllStates() {
  const { data, error } = await supabase
    .from("locations")
    .select("id, name, slug")
    .is("parent_id", null)
    .order("name");

  if (error) return [];
  return data || [];
}
