"use server";

import { supabase } from "@/lib/supabase";

export async function subscribeEmail(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .insert([{ email }]);

  if (error) {
    if (error.code === '23505') {
      // Duplicate email — already subscribed
      return { success: true, message: "You're already subscribed!" };
    }
    console.error("Error subscribing:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }

  return { success: true, message: "Successfully subscribed!" };
}
