import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { fetchArticleInitialData } from "@/app/actions/article";
import { notFound } from "next/navigation";

export default async function ArticleByIdPage({ params }) {
  const { id } = await params;
  
  // 1. Fetch initial SSR article by ID
  const article = await fetchArticleInitialData(id);

  const now = new Date();
  const publishedAt = article?.published_at 
    ? new Date(article.published_at) 
    : null;

  if (
    !article ||
    article.status !== 'published' ||
    (publishedAt && publishedAt > now)
  ) {
    return notFound();
  }
  
  // 2. Delegate rendering entirely to the smart client orchestrator
  return (
    <InfiniteScrollContainer initialArticle={article} />
  );
}
