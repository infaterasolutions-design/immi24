import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { fetchArticleInitialDataBySlug } from "@/app/actions/article";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://unitedstatesimmigrationnews.com";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: article } = await supabase
    .from("articles")
    .select("title, sub_title, main_image, author_name, category_label, slug")
    .eq("slug", slug)
    .single();

  if (!article) {
    return { title: "Article Not Found" };
  }

  const title = article.title;
  const description = article.sub_title || `Read the latest on ${article.category_label || "US Immigration"} - United States Immigration News`;
  const image = article.main_image || `${SITE_URL}/images/logo.png`;
  const url = `${SITE_URL}/${article.slug}`;

  return {
    title: `${title} - United States Immigration News`,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "United States Immigration News",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

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
