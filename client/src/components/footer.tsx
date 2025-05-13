import Link from "next/link";
import React from "react";
// Giữ lại Font Awesome cho brand icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF, // Icon Facebook gọn hơn
  faYoutube,
  // faLinkedinIn, // Thêm nếu cần
  // faInstagram, // Thêm nếu cần
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"; // Icon email

const Footer = () => {
  // Lấy năm hiện tại tự động
  const currentYear = new Date().getFullYear();

  // Dữ liệu cho social links (thay # bằng link thật)
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
    // { href: "#", label: "LinkedIn", icon: faLinkedinIn },
    {
      href: "mailto:info@hanoinghithuc.org",
      label: "Gửi Email",
      icon: faEnvelope,
    }, // Email liên hệ
  ];

  // Dữ liệu cho navigation links
  const navLinks = [
    { href: "/gioi-thieu", label: "Giới thiệu" },
    { href: "/hoc-lieu", label: "Học liệu" },
    { href: "/khoa-hoc", label: "Khóa học" },
    { href: "/cong-dong", label: "Cộng đồng" },
    { href: "/lien-he", label: "Liên hệ" },
  ];

  // Dữ liệu cho legal links
  const legalLinks = [
    { href: "/dieu-khoan", label: "Điều khoản Dịch vụ" },
    { href: "/bao-mat", label: "Chính sách Bảo mật" },
    // { href: "/cookie", label: "Chính sách Cookie" }, // Thêm nếu cần
  ];

  return (
    <footer className="bg-neutral-100 border-t border-border text-neutral-700">
      {" "}
      {/* Nền sáng, viền, chữ */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {" "}
        {/* Tăng max-width, padding */}
        {/* Phần trên: Logo, Nav, Social */}
        <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:items-center md:text-left gap-8 md:gap-6 mb-10">
          {/* Logo */}
          <div className="mb-4 md:mb-0 flex-shrink-0">
            {" "}
            {/* Không co lại */}
            <Link
              href="/"
              className="text-xl lg:text-2xl font-heading font-bold text-foreground hover:text-primary-600 transition-colors duration-300" // Màu chữ chính, hover màu primary
              scroll={false}
            >
              Hà Nội Nghĩa Thục
            </Link>
            {/* Optional: Thêm mô tả ngắn nếu muốn */}
            {/* <p className="mt-2 text-sm text-neutral-600 max-w-xs">
              Tiếp nối di sản, kiến tạo tương lai tri thức Việt.
            </p> */}
          </div>

          {/* Navigation */}
          <nav className="mb-4 md:mb-0">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {" "}
              {/* Cho phép wrap, gap */}
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-300" // Màu chữ, hover primary
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target={social.href.startsWith("mailto:") ? "_self" : "_blank"} // Mở mail trong tab hiện tại, link khác tab mới
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-primary-600 transition-colors duration-300" // Màu icon xám, hover primary
              >
                <FontAwesomeIcon icon={social.icon} className="h-5 w-5" />{" "}
                {/* Kích thước icon */}
              </a>
            ))}
          </div>
        </div>
        {/* Phần dưới: Copyright & Legal */}
        <div className="mt-10 pt-8 border-t border-border text-center text-sm text-neutral-500">
          {" "}
          {/* Viền trên, màu chữ xám */}
          <p className="mb-3">
            {" "}
            {/* Đặt copyright vào <p> */}© {currentYear} Hà Nội Nghĩa Thục. Bảo
            lưu mọi quyền.
          </p>
          {/* Legal links xếp hàng ngang, tự xuống dòng nếu cần */}
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary-600 hover:underline transition-colors duration-300" // Hover màu primary và có gạch chân
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
