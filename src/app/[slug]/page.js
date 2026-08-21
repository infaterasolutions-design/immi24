import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import CategoryIndexPage from "@/components/CategoryIndexPage";
import LiveUpdatePageContent from "@/components/LiveUpdatePageContent";
import { fetchArticleInitialDataBySlug, fetchNextArticleAction } from "@/app/actions/article";
import { getSidebarData } from "@/app/actions/sidebar";
import { getActiveSponsoredContent } from "@/app/actions/sponsoredActions";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCategoryBySlug, isParentCategory } from "@/lib/categoryConfig";
import { getLiveEventIdByTopicUrl } from "@/lib/liveEventUrls";
import { getLocationBySlug, getArticlesByState, getChildLocations } from "@/app/actions/locationActions";
import StateLocationPage from "@/components/StateLocationPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.unitedstatesimmigrationnews.com").replace(/\/+$/, "");

// ISR — automatically refresh cached page data every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // ─── Check if slug is a parent category ───
  const category = await getCategoryBySlug(slug);
  if (category) {
    return {
      title: category.seo_title || `${category.name} - United States Immigration News`,
      description: category.seo_description || category.description || `Latest ${category.name} news and updates.`,
      alternates: {
        canonical: `https://www.unitedstatesimmigrationnews.com/${category.slug}`,
      },
      robots: { index: true, follow: true, 'max-image-preview': 'large' },
    };
  }

  // ─── Check if slug is a location (state) ───
  const location = await getLocationBySlug(slug);
  if (location && !location.parent_id) {
    return {
      title: `${location.name} Immigration News | United States Immigration News`,
      description: `Latest US immigration news, visa updates, and policy changes for ${location.name}. Stay informed with breaking coverage.`,
      openGraph: {
        title: `${location.name} Immigration News`,
        description: `Latest immigration news and updates for ${location.name}.`,
      },
      alternates: {
        canonical: `https://www.unitedstatesimmigrationnews.com/${location.slug}`,
      },
      robots: { index: true, follow: true },
    };
  }

  // ─── Check if slug is a live event (topic_url or id) ───
  let liveEventId = await getLiveEventIdByTopicUrl(slug);
  
  if (!liveEventId) {
    // Fallback: Check if the slug is directly the ID of a live event
    const { data } = await supabase.from("live_events").select("id").eq("id", slug).maybeSingle();
    if (data) liveEventId = data.id;
  }

  if (liveEventId) {
    const { data: liveEvent } = await supabase
      .from("live_events")
      .select("title, header_context")
      .eq("id", liveEventId)
      .single();
    const label = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: liveEvent?.title || `${label} - United States Immigration News`,
      description: liveEvent?.header_context?.slice(0, 160) || `Live updates for ${label}.`,
      alternates: {
        canonical: `https://www.unitedstatesimmigrationnews.com/${slug}`,
      },
      robots: { index: true, follow: true, 'max-image-preview': 'large' },
    };
  }

  // ─── Otherwise, treat as article ───
  const { data: article } = await supabase
    .from("articles")
    .select("title, sub_title, main_image, author_name, category_label, category_slug, slug")
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
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
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

import { draftMode } from "next/headers";

export default async function SlugPage({ params }) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();

  // ─── Smart Detection: Is this a category page? ───
  const category = await getCategoryBySlug(slug);
  if (category) {
    // Fetch articles for this parent category
    const { data: articles } = await supabase
      .from("articles")
      .select("*")
      .eq("category_slug", slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(50);

    return (
      <CategoryIndexPage
        category={category}
        subcategories={category.subcategories || []}
        articles={articles || []}
      />
    );
  }

  // ─── Smart Detection: Is this a location (state)? ───
  const location = await getLocationBySlug(slug);
  if (location && !location.parent_id) {
    const [cities, articles] = await Promise.all([
      getChildLocations(location.id),
      getArticlesByState(location.id),
    ]);
    return <StateLocationPage location={location} cities={cities} articles={articles} stateSlug={slug} />;
  }

  // ─── Smart Detection: Is this a live event (topic_url or id)? ───
  let liveEventId = await getLiveEventIdByTopicUrl(slug);
  
  if (!liveEventId) {
    const { data } = await supabase.from("live_events").select("id").eq("id", slug).maybeSingle();
    if (data) liveEventId = data.id;
  }

  if (liveEventId) {
    const label = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const { getLiveEventById } = await import("@/lib/liveUpdatesData");
    const event = await getLiveEventById(liveEventId);
    return (
      <LiveUpdatePageContent
        event={event}
        breadcrumbLabel={label}
        pageUrl={`/${slug}/`}
      />
    );
  }

  // ─── Otherwise, render as article page ───
  const [article, sidebarData, { data: sponsoredContent }] = await Promise.all([
    fetchArticleInitialDataBySlug(slug),
    getSidebarData(),
    getActiveSponsoredContent()
  ]);

  const now = new Date();
  const publishedAt = article?.published_at 
    ? new Date(article.published_at) 
    : null;

  if (
    !article ||
    article.status !== 'published' ||
    (publishedAt && publishedAt > now && !isPreview)
  ) {
    return notFound();
  }

  if (article.cluster_slug) {
    const { redirect } = await import('next/navigation');
    redirect(`/${article.cluster_slug}/${article.slug}`);
  }

  // Pre-fetch the second article on the server so the infinite scroll never hangs on first load
  const nextArticle = await fetchNextArticleAction(article.slug, article.published_at);
  // Resolve metadata for custom widgets
  const rawWidgets = article.custom_widgets || { mid: [], end: [] };
  const allLinks = [...(rawWidgets.mid || []), ...(rawWidgets.end || [])];
  
  // Extract slugs from internal links (e.g. "/slug-name" -> "slug-name")
  const extractSlug = (url) => {
    if (!url) return null;
    // Check if it's a relative URL or absolute URL belonging to the site
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url.split('?')[0].replace(/^\/|\/$/g, '');
    }
    // If they pasted a full localhost or production URL, try to extract slug
    try {
      const parsed = new URL(url);
      if (
        parsed.hostname.includes('localhost') || 
        parsed.hostname.includes('stitch') || 
        parsed.hostname.includes('unitedstatesimmigrationnews')
      ) {
        return parsed.pathname.replace(/^\/|\/$/g, '');
      }
    } catch (e) {
      // not a valid URL, ignore
    }
    return null;
  };

  const internalSlugs = allLinks
    .map(link => extractSlug(link.url))
    .filter(Boolean); // Remove nulls

  let resolvedMetadata = {};
  if (internalSlugs.length > 0) {
    const { data } = await supabase
      .from('articles')
      .select('slug, title, read_time, main_image, category_label, published_at')
      .in('slug', internalSlugs)
      .eq('status', 'published');
      
    if (data) {
      data.forEach(item => {
        resolvedMetadata[item.slug] = item;
      });
    }
  }

  const enrichWidget = (links) => {
    return links.map(link => {
      const linkSlug = extractSlug(link.url);
      const meta = linkSlug ? resolvedMetadata[linkSlug] : null;
      
      return {
        ...link, // has url and title
        main_image: meta ? meta.main_image : null,
        read_time: meta ? meta.read_time : null,
        category_label: meta ? meta.category_label : null,
        original_title: meta ? meta.title : null,
      };
    });
  };

  const customWidgets = {
    mid: enrichWidget(rawWidgets.mid || []),
    end: enrichWidget(rawWidgets.end || [])
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.meta_description || article.sub_title,
    image: article.main_image,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      '@type': 'Person',
      name: article.authorName,
      jobTitle: article.authorRole,
      url: `${SITE_URL}/author/${article.authorName?.toLowerCase().replace(/\s+/g, '-')}`,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'United States Immigration News',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${article.slug}`,
    },
  };

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: SITE_URL },
        { name: article.categoryLabel || article.category_label || "News", url: `${SITE_URL}/${article.categorySlug || article.category_slug || article.slug.split('-')[0]}` },
        { name: article.title, url: `${SITE_URL}/${article.slug}` }
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InfiniteScrollContainer initialArticle={article} sidebarData={sidebarData} nextArticle={nextArticle} customWidgets={customWidgets} sponsoredContent={sponsoredContent || []} />
    </>
  );
}
