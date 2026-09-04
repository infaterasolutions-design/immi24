import Link from 'next/link';
import Image from 'next/image';

export default function RelatedArticles({ title, articles, variant }) {
  if (!articles || articles.length === 0) return null;

  // Title Parsing Logic
  let prefix = title;
  let highlightedWord = "";

  if (title.startsWith("Read More on ")) {
    prefix = "Read More on ";
    highlightedWord = title.substring(prefix.length);
  } else if (title === "WHAT TO READ NEXT" || title === "YOU MAY LIKE") {
    // For What To Read Next or You May Like, we'll style the whole thing consistently
    prefix = "";
    highlightedWord = title;
  }

  // Dynamic Read Time Helper
  const getReadTime = (article) => {
    if (article.read_time || article.readTime) {
      return article.read_time || article.readTime;
    }
    // Estimate based on title length or just random 4-8 mins for mock
    const hash = article.title.length;
    return `${(hash % 5) + 3} min read`;
  };

  const isCenteredTitle = title === "WHAT TO READ NEXT" || title === "YOU MAY LIKE";

  return (
    <div className="flex flex-col border border-[#E7E0C9] bg-white w-full mb-8 not-prose box-border">
      
      {/* Header Container */}
      <div className={`flex flex-row items-center p-[12px_24px] border-b border-[#E7E0C9] w-full min-h-[46px] box-border ${isCenteredTitle ? 'justify-center text-center' : 'justify-start'}`}>
        <h4 className="font-headline font-semibold text-[16px] leading-[22px] m-0">
          <span className="text-[#A6A08E]">{prefix}</span>
          {highlightedWord && (
            <span className={`text-[#1F1E19] ${prefix ? 'underline decoration-1 underline-offset-4' : ''}`}>
              {highlightedWord}
            </span>
          )}
        </h4>
      </div>

      {/* Articles Container */}
      <div className="flex flex-col items-start p-[16px_24px_24px] gap-[16px] w-full box-border">
        {articles.map((article, idx) => (
          <div key={article.url || article.id || idx} className="flex flex-col w-full gap-[16px]">
            
            {/* Article Item */}
            <Link href={article.url || '#'} className="flex flex-row !justify-start !items-start gap-[12px] w-full group cursor-pointer !no-underline">
              
              {/* Image Container */}
              <div className="flex-none w-[112px] h-[75px] relative overflow-hidden bg-slate-100 !m-0 !mt-0 !p-0">
                <Image
                  src={article.main_image || article.mainImage || '/images/logo.png'}
                  alt={article.title || article.original_title || "Article"}
                  fill
                  className="!m-0 !p-0 object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="112px"
                />
              </div>

              {/* Text Container */}
              <div className="flex flex-col !justify-start !items-start gap-[8px] flex-grow min-w-0 !pt-0 !m-0">
                <h3 className="font-headline font-semibold text-[16px] leading-[22px] !text-[#1F1E19] group-hover:!text-primary transition-colors !m-0 !p-0 line-clamp-2 !no-underline">
                  {article.title || article.original_title}
                </h3>
                <span className="font-sans font-normal text-[14px] leading-[19px] !text-[#68645A] !m-0 !p-0 !no-underline">
                  {getReadTime(article)}
                </span>
              </div>
            </Link>

            {/* Divider (except last item) */}
            {idx !== articles.length - 1 && (
              <div className="w-full h-[1px] bg-[#E7E0C9]" />
            )}
            
          </div>
        ))}
      </div>
      
    </div>
  );
}
