import { getAllArticles } from "@/lib/mockData";
import { getLiveEvents } from "@/lib/liveUpdatesData";
import { getVideos } from "@/lib/supabaseHelpers";
import { getHomepageLayout } from "@/app/actions/homepageLayout";
import HomePageContent from "@/components/HomePageContent";

export const revalidate = 3600; // Cache the HTML for 1 hour instead of 60 seconds

export default async function Home() {
  const [articles, events, vids, layout] = await Promise.all([
    getAllArticles(),
    getLiveEvents(),
    getVideos(),
    getHomepageLayout()
  ]);
  const tickerItems = (events || []).slice(0, 5);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.unitedstatesimmigrationnews.com/#website',
        url: 'https://www.unitedstatesimmigrationnews.com/',
        name: 'United States Immigration News',
        description: 'Latest US immigration news, visa updates, and policy changes.',
        potentialAction: [{
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.unitedstatesimmigrationnews.com/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }]
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.unitedstatesimmigrationnews.com/#organization',
        name: 'United States Immigration News',
        url: 'https://www.unitedstatesimmigrationnews.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.unitedstatesimmigrationnews.com/images/logo.png'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageContent 
        articles={articles}
        tickerItems={tickerItems}
        videoArticles={vids}
        layout={layout}
      />
    </>
  );
}
