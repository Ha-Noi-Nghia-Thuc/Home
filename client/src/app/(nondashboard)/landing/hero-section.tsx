"use client";

import { Button } from "@/components/ui/button";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const fadeInY = (delay = 0, y = 20) => ({
  initial: { opacity: 0, y: y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: "easeOut" },
});

const HeroSection = () => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative h-screen min-h-[500px] flex items-center justify-center overflow-hidden"
      style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            y: offsetY * 0.2,
            scale: 1 + offsetY * 0.0003,
          }}
          aria-hidden="true"
        >
          <Image
            src="/landing-hero.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
            role="img"
            aria-label="Khuê Văn Các - Biểu tượng của tri thức và văn hiến Việt Nam tại Văn Miếu - Quốc Tử Giám, Hà Nội"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/75 to-neutral-950/90"></div>
      </div>

      <div className="relative z-10 px-6 text-center max-w-4xl mx-auto">
        <motion.div {...fadeInY(0.2)}>
          <p className="text-accent font-heading font-medium tracking-wider text-lg md:text-xl mb-4">
            Hà Nội Nghĩa Thục: Tiếp Nối Văn Hiến, Khơi Dòng Tri Thức
          </p>
        </motion.div>

        <motion.h1
          {...fadeInY(0.4)}
          className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading text-neutral-50 mb-6 leading-tight"
        >
          Khai dân trí - Chấn dân khí - Hậu dân sinh
        </motion.h1>

        <motion.p
          {...fadeInY(0.6)}
          className="text-lg md:text-xl text-neutral-200 leading-relaxed mb-10 max-w-3xl mx-auto"
        >
          Tiếp nối ngọn lửa khai trí từ Đông Kinh Nghĩa Thục, Hà Nội Nghĩa Thục
          mở ra một không gian học liệu hiện đại, nơi mỗi người chúng ta cùng
          nhau học hỏi, sẻ chia và làm rạng danh kho tàng tri thức Việt.
        </motion.p>

        <motion.div
          {...fadeInY(0.8)}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            aria-label="Khám phá lý tưởng - cuộn xuống phần tiếp theo"
            onClick={() => {
              const element = document.getElementById("mission");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-accent text-accent-foreground font-semibold rounded-md hover:bg-accent/90 focus-visible:ring-ring group flex items-center gap-2 transition-all duration-300 ease-out shadow-lg hover:shadow-xl"
          >
            Khám phá lý tưởng
            <ArrowRight
              size={18}
              className="transform transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
        </motion.div>
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
        aria-label="Cuộn xuống để khám phá thêm"
        onClick={() =>
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          })
        }
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-neutral-300 text-sm font-medium select-none">
            Khám phá thêm
          </span>
          <ChevronDown
            size={24}
            className="text-accent transition-colors hover:text-accent/80"
          />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default HeroSection;
