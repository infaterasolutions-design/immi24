import { getLiveEvents } from "@/lib/liveUpdatesData";
import LiveUpdatesClient from "./LiveUpdatesClient";

export const metadata = {
  title: "Live News Updates - United States Immigration News",
  description: "Follow the latest breaking developments on major immigration policies and impactful global events as they happen.",
};

export default async function LiveUpdatesIndexPage() {
  // Fetch initial data on the server
  const initialUpdates = await getLiveEvents();

  return <LiveUpdatesClient initialUpdates={initialUpdates} />;
}
