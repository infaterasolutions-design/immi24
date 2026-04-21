import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { fetchArticleInitialDataBySlug } from "@/app/actions/article";
import { notFound } from "next/navigation";

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  
  // 1. Fetch initial SSR article
  const article = await fetchArticleInitialDataBySlug(slug);

  if (!article) {
    return notFound();
  }
  
  // 2. Delegate rendering entirely to the smart client orchestrator
  return (
    <InfiniteScrollContainer initialArticle={article} />
  );
}
