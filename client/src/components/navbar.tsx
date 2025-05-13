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

  const navBackground = scrolled
    ? "bg-background/80 backdrop-blur-md shadow-md"
    : "bg-neutral-950/30 backdrop-blur-sm";

  const navTextColor = scrolled ? "text-accent" : "text-neutral-50";

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBackground}`}
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full h-full py-3 px-4 md:px-8 max-w-7xl mx-auto">
        <Link
          href="/"
          className={`text-xl lg:text-2xl font-heading font-bold ${navTextColor} hover:text-accent transition-colors duration-300`}
        >
          Hà Nội Nghĩa Thục
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button
              variant="outline"
              className={`transition-all duration-300 px-4 py-2 rounded-md text-sm font-medium ${
                scrolled
                  ? "border-border text-foreground hover:bg-muted hover:text-primary"
                  : "border-neutral-300/60 text-primary hover:bg-white/20 hover:border-white hover:text-white"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
            >
              Đăng nhập
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button
              className={`transition-all duration-300 px-4 py-2 rounded-md text-sm font-semibold ${
                scrolled
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-accent/90 text-accent-foreground hover:bg-accent"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
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
