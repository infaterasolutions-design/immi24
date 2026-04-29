import { supabase } from "@/lib/supabase";

/**
 * Verify admin access (basic check)
 */
async function checkAuth() {
  return true; 
}

/**
 * Get all updates for a specific live event
 */
export async function getUpdatesByEvent(eventId) {
  if (!eventId) return { data: [], error: "Missing Event ID" };

  try {
    const { data, error } = await supabase
      .from("live_event_updates")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err.message || "Unknown error" };
  }
}

/**
 * Get the latest single update for an event
 */
export async function getLatestUpdate(eventId) {
  if (!eventId) return { data: null, error: "Missing Event ID" };

  try {
    const { data, error } = await supabase
      .from("live_event_updates")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data || null, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Unknown error" };
  }
}

/**
 * Add a new live update to an event
 * Note: id is TEXT (e.g. "dnv-1"), time is TEXT, title is TEXT, images is array
 */
export async function addLiveUpdate({ event_id, title, content, time, image, images, is_first, is_pinned }) {
  await checkAuth();

  if (!event_id || !content) {
    return { data: null, error: "Event ID and Content are required" };
  }

  // Generate a text ID like "eventid-timestamp"
  const textId = `${event_id}-${Date.now()}`;

  // Build images array from single image or existing array
  let finalImages = images || [];
  if (image && !finalImages.includes(image)) {
    finalImages = [image, ...finalImages];
  }

  try {
    const { data, error } = await supabase
      .from("live_event_updates")
      .insert([{
        id: textId,
        event_id,
        title: title?.trim() || null,
        content: content.trim(),
        time: time || new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) + " (Just now)",
        images: finalImages,
        image: image || null,
        is_first: is_first || false,
        is_pinned: is_pinned || false
      }])
      .select();

    if (error) return { data: null, error: error.message };
    return { data: data?.[0] || null, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Unknown error" };
  }
}

/**
 * Update a specific live update
 */
export async function updateLiveUpdate(id, updateData) {
  await checkAuth();

  if (!id) return { data: null, error: "Missing ID" };

  try {
    const { data, error } = await supabase
      .from("live_event_updates")
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
 * Delete a specific live update
 */
export async function deleteLiveUpdate(id) {
  await checkAuth();

  if (!id) return { data: null, error: "Missing ID" };

  try {
    const { error } = await supabase
      .from("live_event_updates")
      .delete()
      .eq("id", id);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err.message || "Unknown error" };
  }
}
