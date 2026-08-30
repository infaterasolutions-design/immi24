import { getAllAuthors } from "@/app/actions/authorActions";
import Link from "next/link";

export const metadata = {
  title: "Our Team - United States Immigration News",
  description: "Meet the experts, analysts, and reporters behind United States Immigration News. Dedicated to bringing you accurate and timely immigration updates.",
  alternates: {
    canonical: "https://www.unitedstatesimmigrationnews.com/our-team",
  },
};

export default async function OurTeam() {
  const authors = await getAllAuthors();

  return (
    <main className="min-h-screen bg-slate-50 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold headline-font text-slate-900 tracking-tight mb-6">
            Meet Our <span className="text-primary">Team</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Our dedicated team of immigration analysts, experienced journalists, and legal researchers work tirelessly to bring you accurate, breaking news on U.S. immigration policy.
          </p>
        </div>

        {authors.length === 0 ? (
          <div className="text-center text-slate-500 py-12">Team members are currently being updated.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {authors.map((author) => (
              <div key={author.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                <div className="flex flex-col items-center text-center mb-6">
                  <Link href={`/author/${author.slug}`} className="relative w-32 h-32 mb-5 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner group-hover:border-primary/10 transition-colors">
                    {author.photo_url ? (
                      <img src={author.photo_url} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
                        {author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <Link href={`/author/${author.slug}`} className="hover:text-primary transition-colors">
                    <h3 className="text-xl font-bold text-slate-900 headline-font">{author.name}</h3>
                  </Link>
                  <p className="text-primary font-bold text-sm tracking-widest uppercase mt-2">{author.role || "Immigration Analyst"}</p>
                </div>

                <div className="flex-grow">
                  <p className="text-slate-600 text-sm leading-relaxed text-center line-clamp-4">
                    {author.bio || `Specializing in U.S. immigration news and updates. Read more articles by ${author.name}.`}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-4">
                  {author.twitter_url && (
                    <a href={author.twitter_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-[#1DA1F2] hover:text-white transition-colors" aria-label={`${author.name} on Twitter`}>
                      <span className="material-symbols-outlined text-[18px]">temp_preferences_custom</span>
                    </a>
                  )}
                  {author.linkedin_url && (
                    <a href={author.linkedin_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-[#0A66C2] hover:text-white transition-colors" aria-label={`${author.name} on LinkedIn`}>
                      <span className="material-symbols-outlined text-[18px]">work</span>
                    </a>
                  )}
                  {author.email && (
                    <a href={`mailto:${author.email}`} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-colors" aria-label={`Email ${author.name}`}>
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                    </a>
                  )}
                  <Link href={`/author/${author.slug}`} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-colors" aria-label={`View ${author.name} Profile`}>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
