"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Reusable animation variants
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
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const MissionSection = () => {
  const ref = useRef(null);
  // Trigger animation khi 30% phần tử vào tầm nhìn
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      id="gioi-thieu" // ID cho internal link
      className="py-20 md:py-28 px-6 bg-background text-foreground overflow-hidden" // Nền sáng mặc định
      aria-labelledby="mission-title"
    >
      <motion.div
        className="max-w-3xl mx-auto" // Giới hạn chiều rộng nội dung
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Tiêu đề chính của Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-16 md:mb-20"
        >
          <h2
            id="mission-title"
            // Font heading, màu chữ chính
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground"
          >
            Di Sản Khai Phóng, Khát Vọng Non Sông
          </h2>
          {/* Đường gạch trang trí màu Secondary */}
          <div className="h-1 w-20 bg-secondary-500 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Khối nội dung 1 - Bối cảnh lịch sử */}
        <motion.div variants={itemVariants} className="mb-12 md:mb-16 group">
          <div className="flex items-start space-x-4 md:space-x-6">
            {/* Đường trang trí dọc màu Secondary khi hover */}
            <div className="w-1 flex-shrink-0 h-1 group-hover:h-16 bg-secondary-400 rounded-full transition-all duration-700 ease-out mt-2"></div>
            <div className="flex-1">
              {/* Tiêu đề phụ màu Primary */}
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-primary-700 mb-3">
                Ngọn Đuốc Soi Đường Quá Khứ
              </h3>
              {/* Nội dung, màu chữ phụ (hơi mờ) */}
              <p className="text-base md:text-lg font-body text-foreground/85 leading-relaxed">
                Hơn một thế kỷ trước, giữa vận mệnh gian nan của đất nước, Đông
                Kinh Nghĩa Thục bừng sáng như ngọn đuốc trí tuệ, khơi dậy khát
                vọng canh tân và lòng yêu nước. Các bậc sĩ phu thức thời đã
                chung tay mở trường, truyền bá tư tưởng tiến bộ, đặt nền móng
                cho công cuộc chấn hưng dân trí, cổ vũ tinh thần thực học, thực
                nghiệp.
                {/* Đã rút gọn nhẹ */}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Khối nội dung 2 - Sứ mệnh hiện tại */}
        <motion.div variants={itemVariants} className="group">
          <div className="flex items-start space-x-4 md:space-x-6">
            {/* Đường trang trí dọc màu Secondary khi hover */}
            <div className="w-1 flex-shrink-0 h-1 group-hover:h-16 bg-secondary-400 rounded-full transition-all duration-700 ease-out mt-2"></div>
            <div className="flex-1">
              {/* Tiêu đề phụ màu Primary */}
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-primary-700 mb-3">
                Sứ Mệnh Thời Đại Mới
              </h3>
              {/* Nội dung, màu chữ phụ */}
              <p className="text-base md:text-lg font-body text-foreground/85 leading-relaxed">
                Ngày nay, tiếp nối di sản tinh thần ấy,{" "}
                {/* Nhấn mạnh tên dự án bằng màu Primary */}
                <strong className="font-semibold text-primary-600">
                  Hà Nội Nghĩa Thục
                </strong>{" "}
                đã thành hình. Với sứ mệnh lan tỏa ngọn lửa khai phóng trong kỷ
                nguyên số, chúng tôi xây dựng một không gian học liệu mở, thân
                thiện. Đây là nơi tri thức được sẻ chia, tư duy được tự do phát
                triển, và cộng đồng ham học hỏi được gắn kết, góp phần xây dựng
                Việt Nam ngày càng trí tuệ và vững mạnh.
                {/* Đã rút gọn và đổi giọng văn */}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MissionSection;
