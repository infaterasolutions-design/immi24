"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function moveToRecycleBin(tableName, id, titleColumn = "title") {
  try {
    // 1. Fetch the original record
    const { data: originalData, error: fetchError } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !originalData) {
      console.error(`Failed to fetch from ${tableName}:`, fetchError);
      return { success: false, error: fetchError?.message || "Record not found" };
    }

    const title = originalData[titleColumn] || originalData.name || "Unknown Title";

    // 2. Insert into recycle_bin
    const { error: insertError } = await supabase
      .from("recycle_bin")
      .insert([
        {
          original_table: tableName,
          original_id: id.toString(),
          title: title,
          data: originalData,
        }
      ]);

    if (insertError) {
      console.error("Failed to insert into recycle_bin:", insertError);
      return { success: false, error: insertError.message };
    }

    // NEW: Delete linked videos if this is an article (runs with service role to bypass RLS)
    if (tableName === "articles") {
      const { error: videoError } = await supabase.from("videos").delete().eq("article_id", id);
      if (videoError) {
        console.error("Failed to delete linked videos:", videoError);
        // Continue anyway, it might not have videos or we just want to attempt the article delete
      }
    }

    // 3. Delete from original table
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(`Failed to delete from ${tableName}:`, deleteError);
      // If delete fails, we should ideally rollback the insert, but Supabase via REST doesn't support transactions out of the box.
      return { success: false, error: deleteError.message };
    }

    return { success: true };
  } catch (err) {
    console.error("moveToRecycleBin error:", err);
    return { success: false, error: err.message };
  }
}

export async function getRecycleBinItems() {
  try {
    const { data, error } = await supabase
      .from("recycle_bin")
      .select("*")
      .order("deleted_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("getRecycleBinItems error:", err);
    return { success: false, error: err.message };
  }
}

export async function restoreFromRecycleBin(recycleBinId) {
  try {
    // 1. Fetch the recycle bin record
    const { data: binRecord, error: fetchError } = await supabase
      .from("recycle_bin")
      .select("*")
      .eq("id", recycleBinId)
      .single();

    if (fetchError || !binRecord) {
      return { success: false, error: fetchError?.message || "Record not found" };
    }

    // 2. Re-insert into original table
    const { error: insertError } = await supabase
      .from(binRecord.original_table)
      .insert([binRecord.data]);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // 3. Delete from recycle bin
    const { error: deleteError } = await supabase
      .from("recycle_bin")
      .delete()
      .eq("id", recycleBinId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    return { success: true };
  } catch (err) {
    console.error("restoreFromRecycleBin error:", err);
    return { success: false, error: err.message };
  }
}

export async function permanentlyDelete(recycleBinId) {
  try {
    const { error } = await supabase
      .from("recycle_bin")
      .delete()
      .eq("id", recycleBinId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("permanentlyDelete error:", err);
    return { success: false, error: err.message };
  }
}
