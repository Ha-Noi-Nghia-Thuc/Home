"use client";

import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: "https://facebook.com/yourpage",
      label: "Facebook",
      icon: faFacebookF,
    },
    {
      href: "https://youtube.com/yourchannel",
      label: "YouTube",
      icon: faYoutube,
    },
    {
      href: "mailto:hanoinghiathuc@gmail.com",
      label: "Gửi Email",
      icon: faEnvelope,
    },
  ];

  const navLinks = [
    { href: "/gioi-thieu", label: "Giới thiệu" },
    { href: "/hoc-lieu", label: "Học liệu" },
    { href: "/khoa-hoc", label: "Khóa học" },
    { href: "/cong-dong", label: "Cộng đồng" },
    { href: "/lien-he", label: "Liên hệ" },
  ];

  const legalLinks = [
    { href: "/dieu-khoan", label: "Điều khoản Dịch vụ" },
    { href: "/bao-mat", label: "Chính sách Bảo mật" },
  ];

  return (
    <footer className="bg-muted dark:bg-neutral-900 border-t border-border text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <Link
              href="/"
              className="text-xl lg:text-2xl font-heading font-bold text-foreground hover:text-accent transition-colors duration-300"
              scroll={false}
            >
              Hà Nội Nghĩa Thục
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Kiến tạo một nền tảng học liệu mở, nơi cộng đồng cùng nhau học
              hỏi, sẻ chia và lan tỏa tri thức Việt.
            </p>

            <div className="flex mt-6 space-x-5 md:hidden">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target={
                    social.href.startsWith("mailto:") ? "_self" : "_blank"
                  }
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors duration-300 p-2 rounded-full hover:bg-accent/10"
                >
                  <FontAwesomeIcon icon={social.icon} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:pl-8">
            <h3 className="text-base font-heading font-semibold mb-4">
              Khám phá
            </h3>
            <nav>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-base font-heading font-semibold mb-4">
              Liên hệ
            </h3>
            <address className="not-italic text-sm text-muted-foreground mb-6">
              <p className="mb-2">Đống Đa, Hà Nội</p>
              <p className="mb-2">
                Email:{" "}
                <a
                  href="mailto:hanoinghiathuc@gmail.com"
                  className="hover:text-accent transition-colors duration-300"
                >
                  hanoinghiathuc@gmail.com
                </a>
              </p>
              <p>
                Điện thoại:{" "}
                <a
                  href="tel:+8424769898"
                  className="hover:text-accent transition-colors duration-300"
                >
                  082 476 9898
                </a>
              </p>
            </address>

            {/* Social links on desktop */}
            <div className="hidden md:flex space-x-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target={
                    social.href.startsWith("mailto:") ? "_self" : "_blank"
                  }
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors duration-300 p-2 rounded-full hover:bg-accent/10"
                >
                  <FontAwesomeIcon
                    icon={social.icon}
                    className="h-5 w-5"
                    aria-hidden="true"
                    focusable="false"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright & legal links */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p className="mb-4 md:mb-0">
            © {currentYear} Hà Nội Nghĩa Thục. Bảo lưu mọi quyền.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-accent hover:underline transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#"
              aria-label="Lên đầu trang - Scroll to top"
              className="hover:text-accent hover:underline transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Lên đầu trang
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
