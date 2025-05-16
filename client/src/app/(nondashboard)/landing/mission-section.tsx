"use client";

import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import React, { useRef } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const MissionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="mission"
      ref={ref}
      className="py-20 md:py-28 lg:py-32 px-6 bg-background text-foreground overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10"></div>

      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-accent font-medium tracking-wider text-sm md:text-base mb-3 block">
            SỨ MỆNH CỦA CHÚNG TÔI
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground leading-tight">
            Di Sản Khai Phóng, Khát Vọng Non Sông
          </h2>
          <div className="h-1 w-24 bg-accent mx-auto mt-6 rounded-full"></div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-14 md:mb-16 group">
          <div className="flex items-start space-x-4 md:space-x-6">
            <div className="w-1.5 flex-shrink-0 h-1 group-hover:h-20 bg-accent rounded-full transition-all duration-700 ease-out mt-3 md:mt-4"></div>
            <div className="flex-1">
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-primary mb-4">
                Ngọn Đuốc Soi Đường Quá Khứ
              </h3>
              <p className="text-base md:text-lg font-body text-foreground/85 leading-relaxed">
                Hơn một thế kỷ trước, đối diện vận nước gian truân, Đông Kinh
                Nghĩa Thục hiên ngang bừng sáng ngọn đuốc trí tuệ, khơi dậy khát
                vọng canh tân mãnh liệt và tình yêu nước nồng nàn.
                <br />
                Đó là nơi những bậc sĩ phu nặng lòng thời cuộc đã đồng lòng khai
                mở trường học, gieo mầm tư tưởng tiến bộ. Họ đã đặt những viên
                đá nền tảng cho công cuộc chấn hưng dân trí, cổ vũ tinh thần
                thực học, dấn thân thực nghiệp.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="group">
          <div className="flex items-start space-x-4 md:space-x-6">
            <div className="w-1.5 flex-shrink-0 h-1 group-hover:h-20 bg-accent rounded-full transition-all duration-700 ease-out mt-3 md:mt-4"></div>
            <div className="flex-1">
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-primary mb-4">
                Tiếp Nối Ngọn Lửa Khai Phóng
              </h3>
              <p className="text-base md:text-lg font-body text-foreground/85 leading-relaxed">
                Kế thừa dòng chảy minh triết đó, Hà Nội Nghĩa Thục ra đời, mang
                trong mình sứ mệnh tiếp lửa khai phóng cho kỷ nguyên số. Chúng
                tôi kiến tạo một không gian tri thức mở và thân ái – nơi mỗi cá
                nhân được tự do khám phá, mọi ý tưởng được trân trọng sẻ chia,
                và cộng đồng người Việt ham học hỏi cùng nhau vươn lên. Tất cả
                vì một Việt Nam trí tuệ, tự cường và nhân văn.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-16 text-center">
          <Link href="/about" passHref legacyBehavior>
            <Button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-md transition-all duration-300 group"
              aria-label="Tìm hiểu về Đông Kinh Nghĩa Thục"
            >
              <span>Tìm hiểu về Đông Kinh Nghĩa Thục</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MissionSection;
