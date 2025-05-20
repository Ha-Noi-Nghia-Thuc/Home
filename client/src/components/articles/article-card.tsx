import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt?: string;
    coverImageUrl?: string;
    publishedAt?: string;
    featured?: boolean;
    slug?: string;
    author?: {
      name?: string;
      avatarUrl?: string;
    };
    category?: string;
  };
  onClick?: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const cardContent = (
    <article
      className="relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all cursor-pointer overflow-hidden flex flex-col h-full w-full group focus:ring-2 focus:ring-blue-400"
      tabIndex={0}
      aria-label={`Read article: ${article.title}`}
      onClick={onClick}
      style={{ minHeight: "100%", minWidth: "100%" }}
    >
      <div className="relative aspect-[16/10] w-full">
        <img
          src={article.coverImageUrl}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {article.featured && (
            <span className="flex items-center gap-1 bg-yellow-400/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded shadow text-white ring-1 ring-yellow-300">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
              </svg>
              Featured
            </span>
          )}
          {article.category && (
            <span className="flex items-center gap-1 bg-blue-600/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded text-white ring-1 ring-blue-400">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              {article.category}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={article.author?.avatarUrl || undefined}
              alt={
                article.author?.name ||
                `${article.author?.name || "Unknown"}'s avatar`
              }
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {article.author?.name
                ? article.author?.name[0].toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs text-gray-500 flex flex-col ml-2">
            <span className="font-medium">
              {article.author?.name || "Unknown Author"}
            </span>
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>
        {/* Read more CTA */}
        <div className="mt-4">
          <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-semibold group-hover:underline transition">
            Read more
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );

  // Make the whole card clickable
  return article.slug ? (
    <Link
      href={`/article/${article.slug}`}
      className="block focus:outline-none h-full w-full"
      style={{ minHeight: "100%", minWidth: "100%" }}
      aria-label={`Read article: ${article.title}`}
    >
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default ArticleCard;
