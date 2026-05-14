import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { fetchArticleInitialDataBySlug, fetchNextArticleAction } from "@/app/actions/article";
import { getSidebarData } from "@/app/actions/sidebar";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.unitedstatesimmigrationnews.com").replace(/\/+$/, "");

// ISR — automatically refresh cached page data every 60 seconds
export const revalidate = 60;

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
  const rawImage = article.main_image || `${SITE_URL}/images/logo.png`;
  const url = `${SITE_URL}/${article.slug}`;
  const ogImageUrl = `${SITE_URL}/_next/image?url=${encodeURIComponent(rawImage)}&w=1200&q=75`;

  return {
    title: `${title} - United States Immigration News`,
    description,
    alternates: {
      canonical: `https://www.unitedstatesimmigrationnews.com/${article.slug}`,
      languages: {
        'en-US': `https://www.unitedstatesimmigrationnews.com/${article.slug}`,
        'x-default': `https://www.unitedstatesimmigrationnews.com/${article.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "United States Immigration News",
      images: [
        {
          url: ogImageUrl,
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
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  
  // Fetch article and sidebar data in parallel on the server
  const [article, sidebarData] = await Promise.all([
    fetchArticleInitialDataBySlug(slug),
    getSidebarData(),
  ]);

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

  // Pre-fetch the second article on the server so the infinite scroll never hangs on first load
  const nextArticle = await fetchNextArticleAction(article.slug, article.published_at);
  
  return (
    <InfiniteScrollContainer initialArticle={article} sidebarData={sidebarData} nextArticle={nextArticle} />
  );
}

