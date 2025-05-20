"use client";

import React, { useState } from "react";
import LoadingSpinner from "@/components/common/loading-spinner";
import ArticleCard from "@/components/articles/article-card";
import FeaturedArticles from "@/components/articles/featured-articles";
import { useGetArticlesQuery } from "@/store/api";

const FEATURED_COUNT = 3;
const ARTICLES_PER_PAGE = 6;

const ArticlePage = () => {
  const { data: articles, error, isLoading } = useGetArticlesQuery();
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 bg-gray-100">
        <span className="text-3xl mb-3">⚠️</span>
        <span className="text-lg">Lỗi khi tải bài viết.</span>
      </div>
    );
  if (!articles || articles.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600 bg-gray-100">
        <span className="text-5xl mb-3">📰</span>
        <span className="text-lg">Không tìm thấy bài viết nào.</span>
      </div>
    );

  const sortedArticles = Array.isArray(articles)
    ? [...articles].sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      })
    : [];

  let featuredArticles = sortedArticles
    .filter((a) => a.featured)
    .slice(0, FEATURED_COUNT);

  let regularArticles = sortedArticles.filter((a) => !a.featured);

  if (featuredArticles.length === 0) {
    featuredArticles = sortedArticles.slice(0, FEATURED_COUNT);
    regularArticles = sortedArticles.slice(FEATURED_COUNT);
  }

  const visibleArticles = regularArticles.slice(0, visibleCount);
  const hasMore = visibleCount < regularArticles.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <section className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-gray-800">
          Bài viết nổi bật
        </h2>
        <FeaturedArticles articles={featuredArticles} />
      </section>

      <section aria-label="All Articles" className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 tracking-tight text-gray-700">
          Tất cả bài viết
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleArticles.map((article, idx) => (
            <div
              key={article.id}
              className="h-full animate-fade-in hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() =>
                setVisibleCount((prev) => prev + ARTICLES_PER_PAGE)
              }
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
            >
              Xem thêm
            </button>
          </div>
        )}
      </section>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default ArticlePage;
