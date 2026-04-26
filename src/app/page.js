import { getAllArticles } from "@/lib/mockData";
import { getLiveEvents } from "@/lib/liveUpdatesData";
import { getVideos } from "@/lib/supabaseHelpers";
import HomePageClient from "./HomePageClient";

export const revalidate = 3600; // Cache the HTML for 1 hour instead of 60 seconds

export default async function Home() {
  const [articles, events, vids] = await Promise.all([
    getAllArticles(),
    getLiveEvents(),
    getVideos(),
  ]);
  const tickerItems = (events || []).slice(0, 5);

  return (
    <HomePageClient 
      initialArticles={articles}
      initialTickerItems={tickerItems}
      initialVideoArticles={vids}
    />
  );
}
