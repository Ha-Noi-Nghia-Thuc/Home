"use client";

import Image from "next/image";
import React, { useRef } from "react"; // Bỏ useState, useEffect vì không cần offsetY nữa
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Animation Variants (Giữ nguyên) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};
// ---

const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  // Bỏ state và effect của offsetY

  return (
    // Container chính vẫn giữ overflow-hidden
    <div
      ref={ref}
      id="cta"
      className="relative py-24 md:py-32 overflow-hidden bg-neutral-950"
    >
      {/* Background Image & Overlay - ĐÃ BỎ PARALLAX */}
      <div className="absolute inset-0">
        {/* Image tĩnh, không còn trong motion.div */}
        <Image
          src="/landing-call-to-action.png"
          alt="Không gian đọc sách tại thư viện cổ kính, tượng trưng cho việc học tập và nghiên cứu."
          fill
          className="object-cover object-center" // Chỉ cần object-cover
          loading="lazy"
        />
        {/* Lớp phủ gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/80 to-neutral-950/95"></div>
      </div>

      {/* Nội dung Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative max-w-6xl mx-auto px-6 z-10" // z-10 để nổi lên trên
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-16">
          {/* Nội dung bên trái */}
          <motion.div
            variants={itemVariants}
            className="max-w-2xl text-center md:text-left"
          >
            {/* ... Pill, Headline, Description ... */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-500/15 text-secondary-300 mb-5">
              <BookOpen size={16} className="mr-2" />
              <span className="text-sm font-medium">Hành trình tri thức</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-neutral-50 mb-5">
              Cùng khám phá kho tàng học liệu phi lợi nhuận đầu tiên tại Việt
              Nam
            </h2>
            <p className="text-neutral-200 text-lg mb-8 leading-relaxed">
              Dự án Hà Nội Nghĩa Thục được xây dựng với sứ mệnh mang đến tri
              thức mở và miễn phí, tiếp nối tinh thần của phong trào Đông Kinh
              Nghĩa Thục năm xưa. Chúng tôi tin rằng tri thức là quyền cơ bản
              của mỗi con người.
            </p>
          </motion.div>

          {/* Thẻ kêu gọi hành động (CTA Card) bên phải */}
          <motion.div
            variants={itemVariants}
            className="bg-neutral-900/60 backdrop-blur-md rounded-xl p-8 border border-neutral-700/50 w-full md:max-w-md flex-shrink-0"
          >
            {/* ... Card Title, Description ... */}
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">
              Bắt đầu hành trình của bạn
            </h3>
            <p className="text-neutral-300 mb-6">
              Tham gia cộng đồng học tập với hơn 10,000+ thành viên và 5,000+
              tài liệu miễn phí.
            </p>
            {/* Các nút hành động */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nút 1 */}
              <Link href="/tim-kiem" className="block">
                <Button
                  size="lg"
                  className="w-full bg-primary-500 text-primary-foreground hover:bg-primary-600 focus-visible:ring-ring group"
                >
                  Khám Phá Học Liệu{" "}
                  <ArrowRight
                    size={16}
                    className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </Link>
              {/* Nút 2 */}
              <Link href="/sign-up" className="block">
                <Button
                  size="lg"
                  className="w-full bg-secondary-400 text-secondary-foreground hover:bg-secondary-500 focus-visible:ring-ring group"
                >
                  Đăng Ký Ngay{" "}
                  <ArrowRight
                    size={16}
                    className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CTASection;
