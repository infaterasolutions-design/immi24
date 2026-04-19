import CategoryFeed from "@/components/CategoryFeed";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/lib/categoryConfig";
import { getArticlesBySubcategorySlug } from "@/lib/mockData";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { categorySlug, subCategorySlug } = await params;
  const subcategory = await getSubcategoryBySlug(categorySlug, subCategorySlug);
  if (!subcategory) return { title: 'Not Found' };
  
  return {
    title: `${subcategory.name} - The Digital Diplomat`
  };
}

export default async function SubCategoryPage({ params }) {
  const { categorySlug, subCategorySlug } = await params;
  
  const category = await getCategoryBySlug(categorySlug);
  const subcategory = await getSubcategoryBySlug(categorySlug, subCategorySlug);
  
  if (!category || !subcategory) {
    return notFound();
  }

  const articles = await getArticlesBySubcategorySlug(categorySlug, subCategorySlug);

  return (
    <CategoryFeed 
      title={subcategory.name}
      description={`Read the latest developments, news, and analysis concerning ${category.name} > ${subcategory.name}.`}
      articles={articles}
    />
  );
}
