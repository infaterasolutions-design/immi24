import { supabase } from "./supabase";

const cache = {
  liveEvents: { data: null, timestamp: 0 },
  liveEventById: new Map(),
  liveUpdatesForEvent: new Map(),
};

const CACHE_TTL = 60000; // 60 seconds

export async function getLiveEvents() {
  if (cache.liveEvents.data && (Date.now() - cache.liveEvents.timestamp < CACHE_TTL)) {
    return cache.liveEvents.data;
  }

  const { data, error } = await supabase.from('live_events').select('*').order('created_at', { ascending: false });
  const mapped = (data || []).map(mapLiveEvent);
  cache.liveEvents = { data: mapped, timestamp: Date.now() };
  return mapped;
}

export async function getLiveEventById(id) {
  if (cache.liveEventById.has(id)) {
    const cached = cache.liveEventById.get(id);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  const { data, error } = await supabase.from('live_events').select('*').eq('id', id).single();
  if (error || !data) return null;
  
  // also fetch its updates
  const { data: updates } = await supabase.from('live_event_updates').select('*').eq('event_id', id);
  const mappedEvent = mapLiveEvent(data);
  mappedEvent.updates = (updates || []).map(mapLiveUpdate);
  
  cache.liveEventById.set(id, { data: mappedEvent, timestamp: Date.now() });
  return mappedEvent;
}

export async function getLiveUpdatesForEvent(eventId) {
  if (cache.liveUpdatesForEvent.has(eventId)) {
    const cached = cache.liveUpdatesForEvent.get(eventId);
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  }

  const { data, error } = await supabase.from('live_event_updates').select('*').eq('event_id', eventId);
  const mapped = (data || []).map(mapLiveUpdate);
  
  cache.liveUpdatesForEvent.set(eventId, { data: mapped, timestamp: Date.now() });
  return mapped;
}

function mapLiveEvent(e) {
  return {
    ...e,
    heroImage: e.hero_image,
    imageCaption: e.image_caption,
    headerContext: e.header_context
  };
}

function mapLiveUpdate(u) {
  return {
    ...u,
    eventId: u.event_id,
    isFirst: u.is_first
  };
}

export const LIVE_EVENTS = []; // Placeholder fallback
export const LIVE_UPDATES = []; // Placeholder fallback
