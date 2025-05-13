"use client";

import Link from "next/link";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Search,
  BookOpenCheck,
  Users,
  FileText,
} from "lucide-react";

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

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  cta: string;
  link: string;
  color: string;
  iconColor: string;
  hoverColor: string;
}

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const features: Feature[] = [
    {
      icon: BookOpenCheck,
      title: "Lớp Học Khai Phóng",
      description:
        "Khám phá các lộ trình học tập đa dạng, từ nhập môn đến chuyên sâu, giúp bạn nâng tầm tri thức và kỹ năng. Nội dung học liệu được xây dựng với mục tiêu khai phóng, dễ tiếp cận, và chúng tôi luôn chào đón sự chung tay đóng góp chuyên môn từ cộng đồng để làm phong phú thêm khoá học.",
      cta: "Xem khóa học",
      link: "/courses",
      color: "bg-secondary/10",
      hoverColor: "bg-secondary/15",
      iconColor: "text-secondary",
    },
    {
      icon: FileText,
      title: "Góc Nhìn Chuyên Sâu",
      description:
        "Nơi chia sẻ những bài viết, phân tích và góc nhìn đa chiều về văn hóa, giáo dục, khoa học và các xu hướng thời đại. Chúng tôi tin rằng mỗi cá nhân đều có những hiểu biết giá trị để đóng góp, làm phong phú thêm diễn đàn tri thức này cùng với những nội dung do Hà Nội Nghĩa Thục biên tập.",
      cta: "Đọc bài viết",
      link: "/articles",
      color: "bg-accent/10",
      hoverColor: "bg-accent/15",
      iconColor: "text-accent",
    },

    {
      icon: Users,
      title: "Kết nối cộng đồng",
      description:
        "Chung tay xây dựng cộng đồng học tập sôi nổi và tiến bộ, nơi bạn tự do giao lưu, chia sẻ hiểu biết, đặt câu hỏi phản biện và cùng nhau kiến tạo, lan tỏa những giá trị tri thức bền vững, góp phần bồi đắp nền tảng văn hóa và trí tuệ Việt Nam.",
      cta: "Tham gia thảo luận",
      link: "/community",
      color: "bg-primary/10",
      hoverColor: "bg-primary/15",
      iconColor: "text-primary",
    },
  ];

  return (
    <section ref={ref} id="tinh-nang" className="py-20 md:py-28 bg-muted/50">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-6 md:px-8"
      >
        <motion.div
          variants={itemVariants}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <span className="text-accent text-sm uppercase tracking-widest font-medium mb-3 inline-block">
            Tinh Thần Khai Phóng
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Nơi Tri Thức Hội Tụ và Lan Tỏa
          </h2>

          <p className="mt-4 text-lg md:text-xl text-foreground/85">
            Tiếp nối di sản Đông Kinh Nghĩa Thục trên nền tảng số: Vì một cộng
            đồng học tập không ngừng, khai phóng và tiến bộ.
          </p>

          <div className="h-1 w-24 bg-accent mx-auto mt-8 rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{
                y: -6,
                transition: { duration: 0.3 },
              }}
              className="h-full"
              custom={index}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  cta,
  link,
  color,
  iconColor,
  hoverColor,
}: Feature) => (
  <Link href={link} className="block h-full group text-left">
    <div className="flex flex-col h-full p-6 md:p-8 rounded-xl bg-card shadow-sm border border-border transition-all duration-300 group-hover:shadow-md group-hover:border-accent/30">
      <div
        className={`${color} group-hover:${hoverColor} p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105`}
      >
        <Icon className={`w-7 h-7 ${iconColor}`} strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
        {title}
      </h3>

      <p className="text-foreground/80 mb-6 flex-grow text-base leading-relaxed">
        {description}
      </p>

      <div className="flex items-center text-accent font-medium mt-auto transition-colors duration-300">
        <span>{cta}</span>
        <ArrowRight
          size={16}
          className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1.5"
        />
      </div>
    </div>
  </Link>
);

export default FeaturesSection;
