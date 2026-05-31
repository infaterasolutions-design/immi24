import { getAuthorBySlug, getArticlesByAuthor, getAllAuthorSlugs } from "@/app/actions/authorActions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SidebarWidgets from "@/components/SidebarWidgets";

const SITE_URL = "https://www.unitedstatesimmigrationnews.com";
const FALLBACK_IMAGE = "/images/logo.png";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Author Not Found" };

  return {
    title: `${author.name} - United States Immigration News`,
    description: author.bio?.substring(0, 160) || `Articles by ${author.name} on United States Immigration News.`,
    alternates: {
      canonical: `${SITE_URL}/author/${author.slug}`,
    },
    robots: { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      title: `${author.name} - United States Immigration News`,
      description: author.bio?.substring(0, 160),
      url: `${SITE_URL}/author/${author.slug}`,
      type: "profile",
      siteName: "United States Immigration News",
      images: author.photo_url ? [{ url: author.photo_url, width: 400, height: 400, alt: author.name }] : [],
    },
    twitter: {
      card: "summary",
      title: `${author.name} - United States Immigration News`,
      description: author.bio?.substring(0, 160),
    },
  };
}

export async function generateStaticParams() {
  return getAllAuthorSlugs();
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = await getArticlesByAuthor(author.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${SITE_URL}/author/${author.slug}`,
    image: author.photo_url || undefined,
    worksFor: {
      "@type": "NewsMediaOrganization",
      name: "United States Immigration News",
      url: SITE_URL,
    },
    sameAs: [author.twitter_url, author.linkedin_url].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-[1298px] mx-auto px-3 md:px-4 lg:px-24 py-6 md:py-8 mb-12">
        
        {/* ── AUTHOR HEADER CARD (FULL WIDTH) ── */}
        <div className="w-full">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

            {/* Author Photo */}
            <div className="flex-shrink-0">
              {author.photo_url ? (
                <Image
                  src={author.photo_url}
                  alt={author.name}
                  width={100}
                  height={100}
                  className="rounded-full object-cover w-[100px] h-[100px]"
                />
              ) : (
                <div className="w-[100px] h-[100px] rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {author.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 headline-font mb-1">
                {author.name}
              </h1>
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
                {author.role}
              </p>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-5 max-w-2xl">
                {author.bio}
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
                {author.twitter_url && (
                  <a
                    href={author.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-700 rounded-full hover:bg-black hover:text-white transition-colors"
                    aria-label="Follow on X"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {author.linkedin_url && (
                  <a
                    href={author.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-700 rounded-full hover:bg-[#0077b5] hover:text-white transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
              </div>

              {/* Specialty Tags */}
              {author.specialty?.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {author.specialty.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-6 justify-center md:justify-start">
            <div className="text-center md:text-left">
              <p className="text-2xl font-extrabold text-primary headline-font">
                {articles.length}+
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                Articles
              </p>
            </div>
            <div className="w-px bg-slate-200 hidden md:block" />
            <div className="text-center md:text-left">
              <p className="text-2xl font-extrabold text-primary headline-font">
                24/7
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                Coverage
              </p>
            </div>
            <div className="w-px bg-slate-200 hidden md:block" />
            <div className="text-center md:text-left">
              <p className="text-2xl font-extrabold text-primary headline-font">
                U.S.
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                Immigration Focus
              </p>
            </div>
          </div>
        </div>
        </div>

        {/* ── ARTICLES & SIDEBAR GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative mt-10">
          
          {/* Main Feed (Articles) */}
          <div className="lg:col-span-8">
            <h2 className="text-lg md:text-xl font-extrabold headline-font border-l-4 border-primary pl-3 md:pl-4 uppercase tracking-tight mb-6 text-slate-900">
            Latest Articles by {author.name}
          </h2>

          {articles.length === 0 ? (
            <p className="text-slate-500 text-sm">No articles published yet.</p>
          ) : (
            <div className="space-y-0">
              {articles.map((article) => {
                const articleUrl = article.cluster_slug
                  ? `/${article.cluster_slug}/${article.slug}`
                  : `/${article.slug}`;

                return (
                  <article
                    key={article.id}
                    className="group pb-4 mb-4 border-b border-slate-100 flex gap-4 md:gap-6"
                  >
                    <Link href={articleUrl} className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                          {article.category_label}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[10px] text-slate-400 font-medium uppercase">
                          {article.published_at
                            ? new Date(article.published_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold headline-font group-hover:text-primary transition-colors mb-1 text-slate-900 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed hidden md:block">
                        {article.sub_title}
                      </p>
                    </Link>

                    <Link
                      href={articleUrl}
                      className="w-[110px] h-[75px] md:w-[160px] md:h-[106px] overflow-hidden flex-shrink-0 block bg-slate-100 relative rounded-md"
                    >
                      {article.main_image && (
                        <Image
                          src={article.main_image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 110px, 160px"
                        />
                      )}
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 hidden lg:block">
          <SidebarWidgets showLiveCoverage={true} />
        </div>
      </div>
    </main>
    </>
  );
}
