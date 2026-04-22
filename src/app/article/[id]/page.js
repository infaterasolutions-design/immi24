import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { fetchArticleInitialData } from "@/app/actions/article";
import { notFound } from "next/navigation";

export default async function ArticleByIdPage({ params }) {
  const { id } = await params;
  
  // 1. Fetch initial SSR article by ID
  const article = await fetchArticleInitialData(id);

  if (!article) {
    return notFound();
  }
  
  // 2. Delegate rendering entirely to the smart client orchestrator
  return (
    <InfiniteScrollContainer initialArticle={article} />
  );
}
