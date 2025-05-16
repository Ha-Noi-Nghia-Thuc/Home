"use client";

import LoadingSpinner from "@/components/loading-spinner";
import { useGetArticlesQuery } from "@/store/api";
import ArticleCard from "@/components/article-card";
import React from "react";
import FeaturedArticles from "@/components/featured-articles";

const FEATURED_COUNT = 3;

const ArticlePage = () => {
  const { data: articles, error, isLoading } = useGetArticlesQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-100">
        {/* Đổi màu nền */}
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 bg-gray-100">
        {/* Đổi màu nền */}
        <span className="text-3xl mb-3">⚠️</span> {/* Tăng kích thước icon */}
        <span className="text-lg">Lỗi khi tải bài viết.</span>{" "}
        {/* Rõ ràng hơn */}
      </div>
    );
  if (!articles || articles.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600 bg-gray-100">
        {/* Đổi màu nền và màu chữ */}
        <span className="text-5xl mb-3">📰</span> {/* Tăng kích thước icon */}
        <span className="text-lg">Không tìm thấy bài viết nào.</span>{" "}
        {/* Rõ ràng hơn */}
      </div>
    );

  // Sort by publishedAt descending (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  // Featured: those with .featured === true, sorted, take FEATURED_COUNT
  let featuredArticles = sortedArticles
    .filter((a) => a.featured)
    .slice(0, FEATURED_COUNT);

  // Regular: all others, sorted
  let regularArticles = sortedArticles.filter((a) => !a.featured);

  // If not enough featured, fallback to first N
  if (featuredArticles.length === 0) {
    featuredArticles = sortedArticles.slice(0, FEATURED_COUNT);
    regularArticles = sortedArticles.slice(FEATURED_COUNT);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Tăng max-width và padding */}
      {/* Featured Articles */}
      <section className="mb-10">
        {/* Thêm khoảng cách dưới phần Featured */}
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-gray-800">
          {/* Tiêu đề nổi bật hơn */}
          Bài viết nổi bật
        </h2>
        <FeaturedArticles articles={featuredArticles} />
      </section>
      {/* Regular Articles */}
      <section aria-label="All Articles" className="mt-12">
        {/* Thêm khoảng cách trên phần All Articles */}
        <h2 className="text-2xl font-semibold mb-6 tracking-tight text-gray-700">
          {/* Tiêu đề rõ ràng hơn */}
          Tất cả bài viết
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Điều chỉnh số cột trên màn hình lớn */}
          {regularArticles.map((article, idx) => (
            <div
              key={article.id}
              className="h-full animate-fade-in hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
        {regularArticles.length > 9 && (
          <div className="mt-8 flex justify-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full">
              Xem thêm
            </button>
          </div>
        )}
      </section>
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px); /* Giảm khoảng cách trượt */
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s both; /* Giảm thời gian animation */
        }
      `}</style>
    </div>
  );
};

export default ArticlePage;
