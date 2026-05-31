import CategoryIndexPage from "@/components/CategoryIndexPage";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/lib/categoryConfig";
import { fetchArticleInitialDataBySlug, fetchNextArticleAction } from "@/app/actions/article";
import { getSidebarData } from "@/app/actions/sidebar";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getLocationBySlug, getArticlesByLocationId } from "@/app/actions/locationActions";
import { getActiveSponsoredContent } from "@/app/actions/sponsoredActions";
import CityLocationPage from "@/components/CityLocationPage";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.unitedstatesimmigrationnews.com").replace(/\/+$/, "");

// ISR
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug, sub } = await params;

  // 1. Is this a Category > Subcategory page?
  const category = await getCategoryBySlug(slug);
  if (category) {
    const subcategory = await getSubcategoryBySlug(slug, sub);
    if (subcategory) {
      return {
        title: subcategory.seo_title || `${subcategory.name} | ${category.name} - United States Immigration News`,
        description: subcategory.seo_description || subcategory.description || `Latest ${subcategory.name} news and updates.`,
        alternates: {
          canonical: `https://www.unitedstatesimmigrationnews.com/${category.slug}/${subcategory.slug}/`,
        },
        robots: { index: true, follow: true, 'max-image-preview': 'large' },
      };
    }
  }

  // 1.5. Is this a Location page? (slug = state, sub = city)
  const cityLocation = await getLocationBySlug(sub);
  if (cityLocation && cityLocation.parent_id) {
    const stateLocation = await getLocationBySlug(slug);
    if (stateLocation && cityLocation.parent_id === stateLocation.id) {
      return {
        title: `${cityLocation.name}, ${stateLocation.name} Immigration News | United States Immigration News`,
        description: `Latest US immigration news, visa updates, and policy changes for ${cityLocation.name}, ${stateLocation.name}. Stay informed with breaking coverage.`,
        openGraph: {
          title: `${cityLocation.name}, ${stateLocation.name} Immigration News`,
          description: `Latest immigration news and updates for ${cityLocation.name}, ${stateLocation.name}.`,
        },
        alternates: {
          canonical: `https://www.unitedstatesimmigrationnews.com/${stateLocation.slug}/${cityLocation.slug}/`,
        },
        robots: { index: true, follow: true },
      };
    }
  }

  // 2. Is this a Clustered Article page? (slug = cluster, sub = article slug)
  const { data: article } = await supabase
    .from("articles")
    .select("title, sub_title, main_image, author_name, category_label, slug, cluster_slug")
    .eq("slug", sub)
    .eq("cluster_slug", slug)
    .single();

  if (!article) return { title: "Not Found" };

  const title = article.title;
  const description = article.sub_title || `Read the latest on ${article.category_label || "US Immigration"} - United States Immigration News`;
  const rawImage = article.main_image || `${SITE_URL}/images/logo.png`;
  const url = `${SITE_URL}/${slug}/${article.slug}`;
  const ogImageUrl = `${SITE_URL}/_next/image?url=${encodeURIComponent(rawImage)}&w=1200&q=75`;

  return {
    title: `${title} - United States Immigration News`,
    description,
    alternates: {
      canonical: `https://www.unitedstatesimmigrationnews.com/${slug}/${article.slug}`,
      languages: {
        'en-US': `https://www.unitedstatesimmigrationnews.com/${slug}/${article.slug}`,
        'x-default': `https://www.unitedstatesimmigrationnews.com/${slug}/${article.slug}`,
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

export default async function SubcategoryPage({ params }) {
  const { slug, sub } = await params;

  // 1. Validate parent category exists
  const category = await getCategoryBySlug(slug);
  if (category) {
    // Validate subcategory exists under this parent
    const subcategory = await getSubcategoryBySlug(slug, sub);
    if (subcategory) {
      // Fetch articles for this exact subcategory
      const { data: articles } = await supabase
        .from("articles")
        .select("*")
        .eq("category_slug", slug)
        .eq("sub_category_slug", sub)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(50);

      return (
        <CategoryIndexPage
          category={category}
          subcategories={category.subcategories || []}
          articles={articles || []}
          activeSubcategory={sub}
        />
      );
    }
  }

  // 1.5. Is this a Location page? (slug = state, sub = city)
  const cityLocation = await getLocationBySlug(sub);
  if (cityLocation && cityLocation.parent_id) {
    const stateLocation = await getLocationBySlug(slug);
    if (stateLocation && cityLocation.parent_id === stateLocation.id) {
      const articles = await getArticlesByLocationId(cityLocation.id);
      return <CityLocationPage cityLocation={cityLocation} stateLocation={stateLocation} articles={articles} stateSlug={slug} />;
    }
  }

  // 2. Not a category? Check if it's a clustered article URL (slug = cluster, sub = article slug)
  const [article, sidebarData, { data: sponsoredContent }] = await Promise.all([
    fetchArticleInitialDataBySlug(sub),
    getSidebarData(),
    getActiveSponsoredContent(),
  ]);

  const now = new Date();
  const publishedAt = article?.published_at 
    ? new Date(article.published_at) 
    : null;

  if (
    !article ||
    article.status !== 'published' ||
    (publishedAt && publishedAt > now) ||
    article.cluster_slug !== slug
  ) {
    return notFound();
  }

  // Pre-fetch the second article on the server so the infinite scroll never hangs on first load
  const nextArticle = await fetchNextArticleAction(article.slug, article.published_at);
  
  // Resolve metadata for custom widgets
  const rawWidgets = article.custom_widgets || { mid: [], end: [] };
  const allLinks = [...(rawWidgets.mid || []), ...(rawWidgets.end || [])];
  
  const extractSlug = (url) => {
    if (!url) return null;
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url.split('?')[0].replace(/^\/|\/$/g, '');
    }
    try {
      const parsed = new URL(url);
      if (
        parsed.hostname.includes('localhost') || 
        parsed.hostname.includes('stitch') || 
        parsed.hostname.includes('unitedstatesimmigrationnews')
      ) {
        return parsed.pathname.replace(/^\/|\/$/g, '');
      }
    } catch (e) {}
    return null;
  };

  const internalSlugs = allLinks
    .map(link => extractSlug(link.url))
    .filter(Boolean);

  let resolvedMetadata = {};
  if (internalSlugs.length > 0) {
    // Actually extract just the article slug if the url had a cluster e.g. /cluster/article-slug
    const cleanSlugs = internalSlugs.map(s => s.split('/').pop());
    const { data } = await supabase
      .from('articles')
      .select('slug, title, read_time, main_image, category_label, published_at')
      .in('slug', cleanSlugs)
      .eq('status', 'published');
      
    if (data) {
      data.forEach(item => {
        resolvedMetadata[item.slug] = item;
      });
    }
  }

  const enrichWidget = (links) => {
    return links.map(link => {
      let linkSlug = extractSlug(link.url);
      if (linkSlug) linkSlug = linkSlug.split('/').pop(); // Extract last part
      const meta = linkSlug ? resolvedMetadata[linkSlug] : null;
      
      return {
        ...link,
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

  const SITE_URL = "https://www.unitedstatesimmigrationnews.com";
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
      url: `${SITE_URL}/author/${article.authorName?.toLowerCase()}`,
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
      '@id': `${SITE_URL}/${article.cluster_slug}/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InfiniteScrollContainer initialArticle={article} sidebarData={sidebarData} nextArticle={nextArticle} customWidgets={customWidgets} sponsoredContent={sponsoredContent || []} />
    </>
  );
}
