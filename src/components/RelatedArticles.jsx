import Link from 'next/link';
import Image from 'next/image';

export default function RelatedArticles({ title, articles, variant }) {
  if (!articles || articles.length === 0) return null;

  if (variant === 'mid') {
    // Parse the category from "Read More on [Category]" if possible
    let prefix = "Read More on ";
    let category = "";
    if (title.startsWith(prefix)) {
      category = title.substring(prefix.length);
    } else {
      prefix = title;
    }

    return (
      <div className="my-8 bg-transparent not-prose">
        <div className="flex items-center gap-4 mb-0">
          <div className="flex-1 h-[2px] bg-[#d4d4d4]" />
          <h3 className="text-[14px] font-serif uppercase text-[#333333] tracking-wider whitespace-nowrap">
            YOU MAY LIKE
          </h3>
          <div className="flex-1 h-[2px] bg-[#d4d4d4]" />
        </div>
        <ul className="list-none p-0 m-0 -mt-1">
          {articles.map((article, idx) => (
            <li key={article.url || idx} className={`py-4 flex items-center gap-5 ${idx !== articles.length - 1 ? 'border-b border-[#ececec]' : ''}`}>
              <Link href={article.url || '#'} className="flex-shrink-0">
                <Image
                  src={article.main_image || '/images/logo.png'}
                  alt={article.title}
                  width={110}
                  height={75}
                  className="object-cover w-[110px] h-[75px] related-articles-img"
                />
              </Link>
              <div className="flex-grow min-w-0">
                <Link href={article.url || '#'} className="block group">
                  <h4 className="text-[19px] font-serif text-[#222222] leading-snug group-hover:text-primary transition-colors line-clamp-3">
                    {article.title}
                  </h4>
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <div className="w-full h-[2px] bg-[#d4d4d4] mt-2" />
      </div>
    );
  }

  if (variant === 'end') {
    return (
      <div className="my-12 bg-transparent not-prose">
        <div className="flex items-center gap-4 mb-0">
          <div className="flex-1 h-[2px] bg-[#d4d4d4]" />
          <h3 className="text-[14px] font-serif uppercase text-[#333333] tracking-wider whitespace-nowrap">
            {title}
          </h3>
          <div className="flex-1 h-[2px] bg-[#d4d4d4]" />
        </div>
        <ul className="list-none p-0 m-0 -mt-1">
          {articles.map((article, idx) => (
            <li key={article.url || idx} className={`py-4 flex items-center gap-5 ${idx !== articles.length - 1 ? 'border-b border-[#ececec]' : ''}`}>
              <Link href={article.url || '#'} className="flex-shrink-0">
                <Image
                  src={article.main_image || '/images/logo.png'}
                  alt={article.title}
                  width={110}
                  height={75}
                  className="object-cover w-[110px] h-[75px] related-articles-img"
                />
              </Link>
              <div className="flex-grow min-w-0">
                <Link href={article.url || '#'} className="block group">
                  <h4 className="text-[19px] font-serif text-[#222222] leading-snug group-hover:text-primary transition-colors line-clamp-3">
                    {article.title}
                  </h4>
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <div className="w-full h-[2px] bg-[#d4d4d4] mt-2" />
      </div>
    );
  }

  return null;
}
