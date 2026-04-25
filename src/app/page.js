import { getAllArticles } from "@/lib/mockData";
import { getLiveEvents } from "@/lib/liveUpdatesData";
import { getVideos } from "@/lib/supabaseHelpers";
import HomePageClient from "./HomePageClient";

export const revalidate = 60; // Cache the HTML for 60 seconds

export default async function Home() {
  const articles = await getAllArticles();
  const events = await getLiveEvents();
  const tickerItems = (events || []).slice(0, 5);
  const vids = await getVideos();

  return (
    <HomePageClient 
      initialArticles={articles}
      initialTickerItems={tickerItems}
      initialVideoArticles={vids}
    />
  );
}
