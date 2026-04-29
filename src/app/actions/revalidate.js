"use server";

import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalidates a specific path in Next.js cache.
 * Useful for clearing cache when articles or events are updated from client-side admin panels.
 * 
 * @param {string} path - The path to revalidate, e.g., "/", "/category/[slug]", etc.
 * @param {string} type - Optional. "page" or "layout". Defaults to "page".
 */
export async function revalidateServerPath(path, type = "page") {
  try {
    revalidatePath(path, type);
    return { success: true };
  } catch (error) {
    console.error(`Failed to revalidate path ${path}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Revalidates a specific cache tag in Next.js cache.
 * 
 * @param {string} tag - The tag to revalidate.
 */
export async function revalidateServerTag(tag) {
  try {
    revalidateTag(tag);
    return { success: true };
  } catch (error) {
    console.error(`Failed to revalidate tag ${tag}:`, error);
    return { success: false, error: error.message };
  }
}
