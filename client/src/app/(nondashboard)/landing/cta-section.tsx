"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-neutral-950"
    >
      <div className="absolute inset-0">
        <Image
          src="/landing-call-to-action.png"
          alt="Không gian đọc sách tại thư viện cổ kính, tượng trưng cho việc học tập và nghiên cứu."
          fill
          className="object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/80 via-neutral-950/85 to-accent/10"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative max-w-6xl mx-auto px-6 z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-16">
          <motion.div
            variants={itemVariants}
            className="max-w-2xl text-center md:text-left"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground mb-5 backdrop-blur-sm">
              <Sparkles size={16} className="mr-2 text-accent" />
              <span className="text-sm font-medium">Khai mở tâm trí</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-neutral-50 mb-5 leading-tight">
              Khám phá kho tàng học liệu hoàn toàn miễn phí và phi lợi nhuận,
              góp phần xây dựng bởi và vì cộng đồng Việt.
            </h2>

            <p className="text-neutral-200 text-lg mb-8 leading-relaxed">
              Với sứ mệnh trao gửi tri thức mở và hoàn toàn miễn phí, dự án Hà
              Nội Nghĩa Thục tiếp nối ngọn lửa khai phóng của Đông Kinh Nghĩa
              Thục năm xưa. Chúng tôi tin rằng, khi tri thức trở thành quyền
              năng cơ bản của mỗi người, một xã hội Việt Nam học tập và không
              ngừng tiến bộ sẽ được vun đắp.
            </p>

            <div className="hidden md:block">
              <Link
                href="/about"
                className="inline-flex items-center text-accent hover:text-accent/90 font-medium transition-colors duration-300"
              >
                Tìm hiểu thêm về dự án
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-background/10 backdrop-blur-md rounded-xl p-8 border border-accent/20 w-full md:max-w-md flex-shrink-0 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">
              Mở Khóa Tri Thức Cùng Chúng Tôi
            </h3>

            <p className="text-neutral-300 mb-6">
              Gia nhập cộng đồng học tập sôi nổi và tâm huyết, khám phá kho tài
              liệu phong phú và hoàn toàn miễn phí đang không ngừng được làm
              giàu.
            </p>

            <ul className="mb-6 space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                </div>
                <span className="ml-3 text-neutral-200">
                  Học liệu được tuyển chọn/biên soạn tâm huyết
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                </div>
                <span className="ml-3 text-neutral-200">
                  Hoàn toàn miễn phí
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                </div>
                <span className="ml-3 text-neutral-200">
                  Cộng đồng hỗ trợ tích cực
                </span>
              </li>
            </ul>

            <div className="grid grid-cols-1 gap-4">
              <Link href="/sign-up" className="block">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-neutral-400/30 text-primary hover:bg-white/10 hover:text-white focus-visible:ring-accent transition-all duration-300 group"
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
