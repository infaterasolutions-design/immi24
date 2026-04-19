import CategoryFeed from "@/components/CategoryFeed";
import { getCategoryBySlug } from "@/lib/categoryConfig";
import { getArticlesByCategorySlug } from "@/lib/mockData";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return { title: 'Not Found' };
  
  return {
    title: `${category.name} - The Digital Diplomat`
  };
}

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  
  if (!category) {
    return notFound();
  }

  const articles = await getArticlesByCategorySlug(categorySlug);

  return (
    <CategoryFeed 
      title={category.name}
      description={`Read the latest developments, news, and analysis concerning ${category.name}.`}
      articles={articles}
    />
  );
}
