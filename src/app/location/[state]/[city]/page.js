import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocationBySlug, getArticlesByLocationId } from "@/app/actions/locationActions";

export const revalidate = 60;

const FALLBACK_IMAGE = "/images/logo.png";

export async function generateMetadata({ params }) {
  const { state, city } = await params;
  const cityLocation = await getLocationBySlug(city);
  if (!cityLocation) return { title: "Location Not Found" };

  const stateName = cityLocation.parent?.name || state;

  return {
    title: `${cityLocation.name}, ${stateName} Immigration News | United States Immigration News`,
    description: `Latest US immigration news, visa updates, and policy changes for ${cityLocation.name}, ${stateName}. Stay informed with breaking coverage.`,
    openGraph: {
      title: `${cityLocation.name}, ${stateName} Immigration News`,
      description: `Latest immigration news and updates for ${cityLocation.name}, ${stateName}.`,
    },
  };
}

export default async function CityLocationPage({ params }) {
  const { state, city } = await params;

  const cityLocation = await getLocationBySlug(city);
  if (!cityLocation) return notFound();

  // Validate parent state matches
  const stateLocation = await getLocationBySlug(state);
  if (!stateLocation || cityLocation.parent_id !== stateLocation.id) {
    return notFound();
  }

  const articles = await getArticlesByLocationId(cityLocation.id);

  return (
    <div className="max-w-[1298px] mx-auto px-3 md:px-4 lg:px-24 py-6 md:py-8 mb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>›</span>
        <Link href={`/location/${state}`} className="hover:text-primary transition-colors">{stateLocation.name}</Link>
        <span>›</span>
        <span className="text-slate-800 font-medium">{cityLocation.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📍</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold headline-font text-slate-900">
            {cityLocation.name}
          </h1>
        </div>
        <p className="text-slate-600 text-lg">
          Immigration news and updates from {cityLocation.name}, {stateLocation.name}
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <Link
              href={article.slug ? `/${article.slug}` : `/article/${article.id}`}
              key={article.id}
              className="group flex flex-col space-y-3 cursor-pointer border border-transparent hover:border-slate-100 pb-4 rounded-xl transition-all hover:shadow-lg bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl w-full">
                <Image
                  width={600} height={400}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={article.main_image || FALLBACK_IMAGE}
                  alt={article.title}
                />
                {article.category_label && (
                  <div className="absolute top-3 left-3 bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest rounded-sm shadow-md">
                    {article.category_label}
                  </div>
                )}
              </div>
              <div className="px-3 md:px-4 space-y-2 flex-grow">
                <h3 className="text-lg font-extrabold headline-font leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-3">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 pt-3 text-[11px] text-slate-500 font-medium tracking-widest uppercase border-t border-slate-100 mt-auto">
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {article.read_time}
                  </span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-slate-500 py-10 text-center bg-slate-50 rounded-xl border border-slate-100">
          No articles found for {cityLocation.name} yet.
        </div>
      )}
    </div>
  );
}
