"use client";

import { useSearchParams } from "next/navigation";
import { getAllArticles } from "@/lib/mockData";
import CategoryFeed from "@/components/CategoryFeed";
import { Suspense, useEffect, useState } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const lowerQuery = query.toLowerCase();

  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    if (!query) {
      setFilteredArticles([]);
      return;
    }

    async function doSearch() {
      const allArticles = await getAllArticles();
      const results = allArticles.filter((article) => {
        const matchTitle = article.title?.toLowerCase().includes(lowerQuery);
        const matchText = article.paragraphs?.[0]?.toLowerCase().includes(lowerQuery);
        const matchCategory = article.categoryLabel?.toLowerCase().includes(lowerQuery);
        
        return matchTitle || matchText || matchCategory;
      });

      setFilteredArticles(results);
    }
    doSearch();
  }, [query, lowerQuery]);

  return (
    <div className="pt-8">
      <CategoryFeed 
        title={query ? `Search Results for "${query}"` : "Search"}
        description={query 
          ? (filteredArticles.length > 0 ? `Found ${filteredArticles.length} articles matching your search.` : "We couldn't find any articles matching your search. Try checking your spelling or using more general terms.")
          : "Enter a search term to find articles."
        }
        articles={filteredArticles}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="font-bold tracking-widest text-xs uppercase text-slate-400">Searching...</div>
      </div>
    }>
      <div className="bg-slate-50 min-h-screen">
        <SearchResults />
      </div>
    </Suspense>
  );
}
