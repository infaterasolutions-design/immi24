"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { 
  getUpdatesByEvent, 
  addLiveUpdate, 
  updateLiveUpdate, 
  deleteLiveUpdate 
} from "@/app/actions/liveUpdatesActions";

/**
 * Custom hook to manage Live Updates state, real-time subscriptions, 
 * and optimistic UI updates for a specific Live Event.
 */
export function useLiveUpdatesManager(eventId) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Initial Fetch
  const fetchUpdates = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await getUpdatesByEvent(eventId);
    if (fetchError) {
      setError(fetchError);
    } else {
      setUpdates(data || []);
    }
    
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  // 2. Real-time Subscription
  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel(`live_updates_${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "live_event_updates",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          setUpdates((prevUpdates) => {
            if (payload.eventType === "INSERT") {
              // Prevent duplicates if optimistic update already added it
              if (prevUpdates.some(u => u.id === payload.new.id)) {
                return prevUpdates.map(u => u.id === payload.new.id ? payload.new : u);
              }
              // Add new update to the top
              return [payload.new, ...prevUpdates].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            
            if (payload.eventType === "UPDATE") {
              return prevUpdates.map(u => u.id === payload.new.id ? payload.new : u);
            }
            
            if (payload.eventType === "DELETE") {
              return prevUpdates.filter(u => u.id !== payload.old.id);
            }
            
            return prevUpdates;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  // 3. Optimistic Add
  const handleAddUpdate = async ({ content, image = null, is_first = false, is_pinned = false }) => {
    if (!content || !content.trim()) return { error: "Content is required" };

    // Generate a temporary ID for optimistic UI
    const tempId = `temp_${Date.now()}`;
    const optimisticUpdate = {
      id: tempId,
      event_id: eventId,
      content,
      image,
      is_first,
      is_pinned,
      created_at: new Date().toISOString(),
      status: "pending" // internal flag
    };

    // Optimistically update state
    setUpdates((prev) => [optimisticUpdate, ...prev]);

    const { data, error } = await addLiveUpdate({ 
      event_id: eventId, 
      content, 
      image, 
      is_first, 
      is_pinned 
    });

    if (error) {
      // Rollback on error
      setUpdates((prev) => prev.filter(u => u.id !== tempId));
      return { error };
    }

    // Note: The real-time subscription will catch the actual insert and 
    // we handle replacing the temp item if needed, but typically we can just
    // replace the temp item directly here to be safe.
    setUpdates((prev) => prev.map(u => u.id === tempId ? data : u));
    return { data };
  };

  // 4. Optimistic Update
  const handleUpdate = async (id, updateData) => {
    // Save original for rollback
    const originalUpdate = updates.find(u => u.id === id);
    if (!originalUpdate) return { error: "Update not found" };

    // Optimistically update state
    setUpdates((prev) => prev.map(u => 
      u.id === id ? { ...u, ...updateData, status: "updating" } : u
    ));

    const { data, error } = await updateLiveUpdate(id, updateData);

    if (error) {
      // Rollback
      setUpdates((prev) => prev.map(u => u.id === id ? originalUpdate : u));
      return { error };
    }

    return { data };
  };

  // 5. Optimistic Delete
  const handleDelete = async (id) => {
    // Save original for rollback
    const originalUpdate = updates.find(u => u.id === id);
    if (!originalUpdate) return { error: "Update not found" };

    // Optimistically delete
    setUpdates((prev) => prev.filter(u => u.id !== id));

    const { error } = await deleteLiveUpdate(id);

    if (error) {
      // Rollback
      setUpdates((prev) => {
        const restored = [...prev, originalUpdate].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return restored;
      });
      return { error };
    }

    return { success: true };
  };

  return {
    updates,
    loading,
    error,
    refresh: fetchUpdates,
    addUpdate: handleAddUpdate,
    editUpdate: handleUpdate,
    removeUpdate: handleDelete
  };
}
