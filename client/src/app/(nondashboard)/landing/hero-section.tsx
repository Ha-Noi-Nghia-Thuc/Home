"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { ArrowRight, ArrowDown } from "lucide-react"; // Thêm ArrowDown

const HeroSection = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation Variants cho gọn
  const fadeInY = (delay = 0, y = 20) => ({
    initial: { opacity: 0, y: y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay },
  });

  return (
    <div
      // Container chính, chiếm toàn màn hình, ẩn overflow
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: `${NAVBAR_HEIGHT}px` }} // Đẩy nội dung xuống dưới Navbar
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0">
        {/* Ảnh nền với Parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: offsetY * 0.2, scale: 1.05 }} // Áp dụng parallax
        >
          <Image
            src="/khue_van_cac.jpg" // Đảm bảo đường dẫn đúng
            alt="Khuê Văn Các - Biểu tượng của tri thức và văn hiến Việt Nam tại Văn Miếu - Quốc Tử Giám, Hà Nội" // Alt text chi tiết
            fill
            className="object-cover object-center"
            priority // Ưu tiên tải ảnh này
          />
        </motion.div>
        {/* Lớp phủ gradient màu xám trung tính đậm */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/80 to-neutral-950/95"></div>
      </div>

      {/* Nội dung Hero */}
      <div className="relative z-10 px-6 text-center max-w-4xl mx-auto">
        {/* Pre-headline */}
        <motion.div {...fadeInY(0.2)}>
          <p className="text-secondary-400 font-heading font-medium tracking-wider text-lg md:text-xl mb-3">
            Hà Nội Nghĩa Thục
          </p>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          {...fadeInY(0.4)}
          // Chữ trắng/xám rất nhạt, font heading
          className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading text-neutral-50 mb-6"
        >
          Khai dân trí - Chấn dân khí - Hậu dân sinh
        </motion.h1>

        {/* Description */}
        <motion.p
          {...fadeInY(0.6)}
          // Chữ xám nhạt, giới hạn chiều rộng để dễ đọc
          className="text-lg md:text-xl text-neutral-200 leading-relaxed mb-10 max-w-3xl mx-auto"
        >
          Kế thừa tinh thần khai trí Đông Kinh Nghĩa Thục, chúng tôi mang đến
          nền tảng học liệu mở, kết nối cộng đồng và lan tỏa tri thức Việt.
        </motion.p>

        {/* Call to Action Button */}
        <motion.div {...fadeInY(0.8)} className="flex justify-center">
          <Link href="#gioi-thieu">
            {" "}
            {/* Cập nhật link tới section phù hợp */}
            <Button
              size="lg" // Kích thước lớn cho nút chính
              className="bg-secondary-400 text-secondary-foreground rounded-md hover:bg-secondary-500 focus-visible:ring-ring group flex items-center gap-2 transition-transform duration-300 ease-out"
              // Thêm hiệu ứng nhẹ khi hover/focus nguyên nút nếu muốn
              // whileHover={{ scale: 1.03 }}
              // whileTap={{ scale: 0.98 }}
            >
              Tìm hiểu thêm
              <ArrowRight
                size={18}
                className="transform transition-transform duration-300 group-hover:translate-x-1" // Hiệu ứng icon
              />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Chỉ báo cuộn (Scroll Indicator) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }} // Fade in đơn giản
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }} // Hiệu ứng nhấp nháy nhẹ
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <ArrowDown size={24} className="text-neutral-400" />{" "}
          {/* Icon mũi tên xuống */}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
