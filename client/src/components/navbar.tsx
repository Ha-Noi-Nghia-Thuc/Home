"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { NAVBAR_HEIGHT } from "@/lib/constants";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xác định màu nền và màu chữ dựa trên trạng thái cuộn và giả định hero tối
  // Sử dụng màu xám trung tính đậm khi cuộn
  const navBackground = scrolled
    ? "bg-neutral-950/90 backdrop-blur-sm shadow-lg"
    : "bg-transparent"; // Giữ trong suốt ban đầu

  // Giả định chữ luôn cần màu sáng để nổi bật trên nền tối (khi cuộn) hoặc hero tối (ban đầu)
  const navTextColor = "text-neutral-100"; // Xám trắng nhạt nhất quán

  return (
    <div
      // Navbar container
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBackground}`}
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full h-full py-3 px-4 md:px-8 max-w-7xl mx-auto">
        {/* LOGO */}
        <Link
          href="/" // Nên trỏ về trang chủ chính
          className={`text-xl lg:text-2xl font-heading font-bold ${navTextColor} hover:text-primary-400 transition-colors duration-300`} // Hover sang màu Primary sáng
        >
          Hà Nội Nghĩa Thục
        </Link>

        {/* Desktop Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button
              variant="ghost"
              // Chữ màu sáng, hover nền xám đậm hơn
              className={`${navTextColor} hover:text-white hover:bg-neutral-800/60 focus-visible:ring-ring`}
            >
              Đăng nhập
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button
              // Sử dụng màu Secondary (Ochre/Cát)
              className="bg-secondary-400 text-secondary-foreground rounded-md hover:bg-secondary-500 focus-visible:ring-ring"
            >
              Đăng ký
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
