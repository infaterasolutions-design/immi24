import { supabase } from "@/lib/supabase";

/**
 * Generate a URL-safe slug from a string
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Verify admin access (basic check for server actions)
 */
async function checkAuth() {
  // In a real app, use Supabase Server Client to securely verify session.
  // Since this uses the anon client currently, we rely on RLS on the DB side
  // or a more robust server auth check here.
  return true; 
}

/**
 * Get all live events (Admin view - no status filter)
 */
export async function getAllLiveEvents() {
  await checkAuth();
  
  try {
    const { data, error } = await supabase
      .from("live_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Unknown error" };
  }
}

/**
 * Get a single live event by ID
 */
export async function getLiveEventById(id) {
  await checkAuth();

  if (!id) return { data: null, error: "Missing ID" };

  try {
    const { data, error } = await supabase
      .from("live_events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Unknown error" };
  }
}

/**
 * Create a new live event with auto-slug generation
 */
export async function createLiveEvent({ title, slug, description, status, date, date_picker, hero_image, image_caption, header_context }) {
  await checkAuth();

  if (!title || title.trim().length === 0) {
    return { data: null, error: "Title is required" };
  }

  let finalSlug = slug;
  if (!finalSlug || finalSlug.trim().length === 0) {
    finalSlug = generateSlug(title);
  } else {
    finalSlug = generateSlug(finalSlug);
  }

  // Ensure slug uniqueness (simple append if exists)
  let uniqueSlug = finalSlug;
  let isUnique = false;
  let counter = 1;

  try {
    while (!isUnique) {
      const { data: existing } = await supabase
        .from("live_events")
        .select("id")
        .eq("slug", uniqueSlug)
        .maybeSingle();

      if (existing) {
        uniqueSlug = `${finalSlug}-${counter}`;
        counter++;
      } else {
        isUnique = true;
      }
    }

    const { data, error } = await supabase
      .from("live_events")
      .insert([{
        id: uniqueSlug,
        title: title.trim(),
        slug: uniqueSlug,
        description: description?.trim() || null,
        status: status || "inactive",
        date: date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        authors: [],
        hero_image: hero_image || null,
        image_caption: image_caption || null,
        header_context: header_context || null
      }])
      .select();

    if (error) return { data: null, error: error.message };
    return { data: data?.[0] || null, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Unknown error" };
  }
}

/**
 * Update an existing live event
 */
export async function updateLiveEvent(id, updateData) {
  await checkAuth();

  if (!id) return { data: null, error: "Missing ID" };

  // Strip virtual fields that don't exist in the database
  delete updateData.date_picker;

  // If slug is being updated, clean it up
  if (updateData.slug) {
    updateData.slug = generateSlug(updateData.slug);
  }

  try {
    const { data, error } = await supabase
      .from("live_events")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) return { data: null, error: error.message };
    return { data: data?.[0] || null, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Unknown error" };
  }
}

/**
 * Delete a live event
 */
export async function deleteLiveEvent(id) {
  await checkAuth();

  if (!id) return { data: null, error: "Missing ID" };

  try {
    const { error } = await supabase
      .from("live_events")
      .delete()
      .eq("id", id);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err.message || "Unknown error" };
  }
}
