import { supabase } from "./supabase";

export async function getLiveEvents() {
  const { data, error } = await supabase.from('live_events').select('*');
  return (data || []).map(mapLiveEvent);
}

export async function getLiveEventById(id) {
  const { data, error } = await supabase.from('live_events').select('*').eq('id', id).single();
  if (error || !data) return null;
  
  // also fetch its updates
  const { data: updates } = await supabase.from('live_event_updates').select('*').eq('event_id', id);
  const mappedEvent = mapLiveEvent(data);
  mappedEvent.updates = (updates || []).map(mapLiveUpdate);
  return mappedEvent;
}

export async function getLiveUpdatesForEvent(eventId) {
  const { data, error } = await supabase.from('live_event_updates').select('*').eq('event_id', eventId);
  return (data || []).map(mapLiveUpdate);
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
