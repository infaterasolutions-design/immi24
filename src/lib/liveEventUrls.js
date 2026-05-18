import { supabase } from "./supabase";

let cachedMap = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Fetch the topic_url ↔ event id mapping from the database.
 */
async function getUrlMap() {
  if (cachedMap && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedMap;
  }

  const { data, error } = await supabase
    .from("live_events")
    .select("id, topic_url")
    .not("topic_url", "is", null);

  if (error) {
    console.error("Error fetching live event URLs:", error);
    return new Map();
  }

  const map = new Map();
  (data || []).forEach((row) => {
    if (row.topic_url) {
      map.set(row.topic_url, row.id); // topic_url → id
      map.set(row.id, row.topic_url); // id → topic_url
    }
  });

  cachedMap = map;
  cacheTimestamp = Date.now();
  return map;
}

/**
 * Get the canonical URL for a live event by its ID. (async — server components)
 */
export async function getLiveEventUrl(eventId) {
  const map = await getUrlMap();
  const topicUrl = map.get(eventId);
  return `/${topicUrl || eventId}/`;
}

/**
 * Check if a slug is a live event topic_url. (async — server)
 * Returns the event ID if found, null otherwise.
 */
export async function getLiveEventIdByTopicUrl(slug) {
  const map = await getUrlMap();
  return map.get(slug) || null;
}

/**
 * Get the URL for a live event synchronously using a pre-loaded map.
 * For use in client components that receive urlMap as a prop.
 */
export function getLiveEventUrlFromMap(eventId, urlMap) {
  if (!urlMap) return `/${eventId}/`;
  const topicUrl = urlMap[eventId];
  return `/${topicUrl || eventId}/`;
}

/**
 * Fetch a plain object mapping event IDs → topic URLs.
 * Pass this to client components as a prop.
 */
export async function getLiveEventUrlMap() {
  const { data, error } = await supabase
    .from("live_events")
    .select("id, topic_url")
    .not("topic_url", "is", null);

  if (error) return {};

  const obj = {};
  (data || []).forEach((row) => {
    if (row.topic_url) {
      obj[row.id] = row.topic_url;
    }
  });
  return obj;
}
