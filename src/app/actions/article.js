"use server";

import { getNextArticle, getArticleById } from "@/lib/mockData";

export async function fetchNextArticleAction(currentId) {
  // Add a small artificial delay to show loading state smoothly
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const nextArticle = await getNextArticle(currentId);
  return nextArticle; // Return null if no next article
}

export async function fetchArticleInitialData(id) {
  const article = await getArticleById(id);
  return article;
}
