import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Author {
  name?: string;
  avatarUrl?: string;
}
interface Article {
  id: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  featured?: boolean;
  slug?: string;
  author?: Author;
  category?: string;
}

interface FeaturedArticlesProps {
  articles: Article[];
}

const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  const heroArticle = articles[0];
  const secondaryFeatured = articles.slice(1);

  return (
    <section aria-label="Featured Articles" className="mb-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Hero Featured Article */}
        {heroArticle && (
          <div className="md:col-span-2 flex flex-col h-full">
            <a
              href={heroArticle.slug ? `/article/${heroArticle.slug}` : "#"}
              tabIndex={-1}
              className="relative block h-full rounded-2xl overflow-hidden shadow-lg group"
            >
              <div className="relative aspect-[16/7] w-full h-full">
                <img
                  src={heroArticle.coverImageUrl || undefined}
                  alt={heroArticle.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Thay đổi div này */}
                <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full bg-black/40 backdrop-blur-sm flex flex-col justify-end">
                  <div className="mb-auto">
                    {/* Đẩy phần này lên trên */}
                    {heroArticle.category && (
                      <span className="inline-block bg-blue-600 text-xs font-semibold px-2 py-1 rounded mb-2">
                        {heroArticle.category}
                      </span>
                    )}
                    <h2 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow">
                      {heroArticle.title}
                    </h2>
                  </div>
                  {heroArticle.excerpt && (
                    <p className="text-sm md:text-lg mb-4 line-clamp-2 drop-shadow">
                      {heroArticle.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs opacity-90">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={heroArticle.author?.avatarUrl || undefined}
                        alt={
                          heroArticle.author?.name
                            ? `${heroArticle.author.name}'s avatar`
                            : "Avatar tác giả"
                        }
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {heroArticle.author?.name
                          ? heroArticle.author.name[0].toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{heroArticle.author?.name || "Tác giả ẩn danh"}</span>
                    <span className="text-gray-400">•</span>
                    <span>
                      {heroArticle.publishedAt
                        ? new Date(heroArticle.publishedAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
                {heroArticle.featured && (
                  <span className="absolute top-4 left-4 bg-yellow-500 text-xs font-bold px-2 py-1 rounded shadow text-white z-20">
                    Nổi bật
                  </span>
                )}
              </div>
            </a>
          </div>
        )}
        {/* Secondary Featured Articles */}
        <div className="flex flex-col gap-6 h-full">
          {secondaryFeatured.map((article) => (
            <a
              key={article.id}
              href={article.slug ? `/article/${article.slug}` : "#"}
              className="flex bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group h-40"
            >
              <div className="relative aspect-[16/9] w-28 min-w-[7rem]">
                <img
                  src={article.coverImageUrl || undefined}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col justify-between p-4 flex-1">
                <div>
                  {article.category && (
                    <span className="inline-block bg-blue-600 text-xs font-semibold px-2 py-1 rounded mb-1 text-white">
                      {article.category}
                    </span>
                  )}
                  <h3 className="text-base font-bold mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={article.author?.avatarUrl || undefined}
                      alt={
                        article.author?.name
                          ? `${article.author.name}'s avatar`
                          : "Avatar tác giả"
                      }
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {article.author?.name
                        ? article.author.name[0].toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{article.author?.name || "Tác giả ẩn danh"}</span>
                  <span className="text-gray-400">•</span>
                  <span>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
