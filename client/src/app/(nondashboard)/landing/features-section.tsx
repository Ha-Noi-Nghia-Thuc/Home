"use client";

// Thay vì Image, import các icon từ lucide-react
import Link from "next/link";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Search, BookOpenCheck, Users } from "lucide-react"; // Import các icon SVG

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
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};
// ---

// Định nghĩa Interface cho Feature props
interface Feature {
  icon: React.ElementType; // Kiểu dữ liệu cho component icon
  title: string;
  description: string;
  link: string;
  color: string; // Class màu nền cho icon
  iconColor: string; // Class màu cho icon SVG
}

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 }); // Trigger khi 20% vào view

  // Dữ liệu features cập nhật với icon SVG và màu sắc nhất quán
  const features: Feature[] = [
    {
      icon: Search, // Dùng component icon <Search />
      title: "Tìm kiếm học liệu",
      description:
        "Khám phá kho tàng học liệu đa dạng, từ lịch sử, văn hóa đến khoa học, công nghệ, được tuyển chọn và hệ thống hóa.",
      link: "/tim-kiem", // Cập nhật link thực tế
      color: "bg-primary-500", // Màu Primary Blue
      iconColor: "text-primary-foreground", // Màu chữ/icon trên nền Primary
    },
    {
      icon: BookOpenCheck, // Dùng component icon <BookOpenCheck />
      title: "Tham gia khóa học",
      description:
        "Tiếp cận các khóa học chất lượng, từ cơ bản đến chuyên sâu, do các chuyên gia và nhà giáo tâm huyết hướng dẫn.",
      link: "/khoa-hoc", // Cập nhật link thực tế
      color: "bg-secondary-400", // Màu Secondary Ochre/Cát
      iconColor: "text-secondary-foreground", // Màu chữ/icon trên nền Secondary
    },
    {
      icon: Users, // Dùng component icon <Users />
      title: "Kết nối cộng đồng",
      description:
        "Giao lưu, thảo luận và chia sẻ kiến thức trong cộng đồng học tập năng động, cùng nhau lan tỏa giá trị tri thức.",
      link: "/cong-dong", // Cập nhật link thực tế
      color: "bg-primary-600", // Màu Primary Blue đậm hơn
      iconColor: "text-primary-foreground", // Màu chữ/icon trên nền Primary
    },
  ];

  return (
    <section ref={ref} id="tinh-nang" className="py-20 md:py-28 bg-background">
      {" "}
      {/* Nền sáng mặc định */}
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-6 md:px-8"
      >
        {/* Tiêu đề Section */}
        <motion.div
          variants={itemVariants}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
            Không Gian Tri Thức Mở
          </h2>
          <p className="mt-4 text-lg md:text-xl text-foreground/85">
            {/* Mô tả section rõ hơn */}
            Nền tảng học tập kế thừa di sản Đông Kinh Nghĩa Thục, được xây dựng
            trên nền tảng công nghệ hiện đại để phục vụ cộng đồng.
          </p>
          {/* Đường gạch trang trí */}
          <div className="h-1 w-20 bg-secondary-500 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Lưới hiển thị các Feature Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map(
            (
              feature // Bỏ index nếu không dùng custom prop
            ) => (
              <motion.div
                key={feature.title} // Dùng title làm key (giả định là duy nhất)
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }} // Hiệu ứng nhấc lên khi hover
                className="h-full"
              >
                {/* Truyền dữ liệu vào FeatureCard */}
                <FeatureCard {...feature} />
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </section>
  );
};

// Component Feature Card đã cập nhật
const FeatureCard = ({
  icon: Icon, // Đổi tên prop thành Icon (viết hoa) để dùng như component
  title,
  description,
  link,
  color,
  iconColor,
}: Feature) => (
  <Link href={link} className="block h-full group text-left">
    {" "}
    {/* Thẻ là một link, căn trái */}
    {/* Thẻ: nền sáng, viền nhẹ, bo góc, đổ bóng nhẹ khi hover */}
    <div className="flex flex-col h-full p-6 md:p-8 rounded-lg bg-card border border-border transition-shadow duration-300 group-hover:shadow-md">
      {/* Phần chứa Icon */}
      <div
        // Màu nền truyền từ props, bo tròn, kích thước cố định
        className={`${color} p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}
      >
        {/* Hiển thị Icon SVG */}
        <Icon className={`w-7 h-7 ${iconColor}`} strokeWidth={1.5} />
      </div>

      {/* Tiêu đề thẻ */}
      <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
        {title}
      </h3>

      {/* Mô tả thẻ */}
      <p className="text-foreground/80 mb-6 flex-grow text-base leading-relaxed">
        {" "}
        {/* Cho phép description co giãn */}
        {description}
      </p>

      {/* Link "Tìm hiểu thêm" */}
      <div className="flex items-center text-secondary-500 font-medium mt-auto group-hover:text-secondary-600 transition-colors duration-300">
        <span>Tìm hiểu thêm</span>
        <ArrowRight
          size={16}
          className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1" // Điều chỉnh khoảng cách và hiệu ứng
        />
      </div>
    </div>
  </Link>
);

export default FeaturesSection;
