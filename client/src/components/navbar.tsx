"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetAuthUserQuery } from "@/store/api";
import { signOut as amplifySignOut } from "aws-amplify/auth";
import { Bell, Menu as MenuIconLucide, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  const dashboardPrefixes = ["/user", "/admin", "/author"];
  const isDashboardPage = dashboardPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const handleSignOut = async () => {
    try {
      await amplifySignOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const mainNavLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/courses", label: "Khóa học" },
    { href: "/articles", label: "Bài viết" },
    { href: "/events", label: "Sự kiện" },
    { href: "/forum", label: "Diễn đàn" },
  ];

  const navTitleColor = pathname === "/" ? "text-primary" : "text-foreground";

  // Show logo, slogan, and login/register buttons if not logged in
  if (!authUser || !authUser.userInfo) {
    return (
      <div
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-colors duration-300",
          "bg-background/95 backdrop-blur-sm border-b border-border"
        )}
        style={{ height: `${NAVBAR_HEIGHT}px` }}
      >
        <div className="flex flex-row items-center justify-between w-full h-full px-4 md:px-8 max-w-screen-xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "text-xl lg:text-2xl font-heading font-bold hover:text-primary transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
              navTitleColor
            )}
            tabIndex={0}
          >
            Hà Nội Nghĩa Thục
          </Link>

          {/* Slogan */}
          <p className="hidden md:inline-block text-muted-foreground text-center text-sm font-medium">
            Khai dân trí - Chấn dân khí - Hậu dân sinh
          </p>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-black hover:border-primary focus-visible:ring-2 focus-visible:ring-primary/70"
              onClick={() => router.push("/sign-in")}
            >
              Đăng nhập
            </Button>
            <Button
              variant="default"
              className="hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/70"
              onClick={() => router.push("/sign-up")}
            >
              Đăng ký
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If user IS logged in, show the full navbar
  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-colors duration-300",
        "bg-background/95 backdrop-blur-sm border-b border-border"
      )}
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full h-full py-2 px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger aria-label="Mở thanh bên">
                <MenuIconLucide className="h-6 w-6 text-foreground" />
              </SidebarTrigger>
            </div>
          )}
          <Link
            href="/"
            className={cn(
              "text-xl lg:text-2xl font-heading font-bold hover:text-primary transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
              navTitleColor
            )}
            tabIndex={0}
          >
            Hà Nội Nghĩa Thục
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hover:text-primary transition-colors px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                pathname === link.href
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
              tabIndex={0}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Message and Notification icons (desktop only) */}
          <button
            type="button"
            className="relative hidden md:flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            aria-label="Tin nhắn"
            tabIndex={0}
          >
            <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <button
            type="button"
            className="relative hidden md:flex items-center justify-center p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            aria-label="Thông báo"
            tabIndex={0}
          >
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none rounded-full p-1 hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary/70">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={authUser.userInfo?.data.avatarUrl || undefined}
                  alt={
                    authUser.userInfo?.name ||
                    `${authUser.userInfo.name}'s avatar`
                  }
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {authUser.userInfo?.data.name
                    ? authUser.userInfo.data.name[0].toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-foreground hidden md:block">
                {authUser.userInfo?.data.name}
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-background border-border w-56 shadow-lg mt-1"
              align="end"
            >
              <DropdownMenuItem
                className="cursor-pointer focus:bg-muted focus:text-foreground py-2 px-3"
                onClick={() =>
                  router.push(
                    authUser.userInfo?.userType === "ADMIN"
                      ? "/admin/dashboard"
                      : authUser.userInfo?.userType === "AUTHOR"
                      ? "/author/dashboard"
                      : "/user/profile"
                  )
                }
              >
                Bảng điều khiển
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer focus:bg-muted focus:text-foreground py-2 px-3"
                onClick={() =>
                  router.push(
                    authUser.userInfo?.data.userRole === "ADMIN"
                      ? "/admin/settings"
                      : authUser.userInfo?.data.userRole === "AUTHOR"
                      ? "/author/settings"
                      : "/user/settings"
                  )
                }
              >
                Cài đặt tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-muted focus:text-foreground py-2 px-3 md:hidden">
                Tin nhắn
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-muted focus:text-foreground py-2 px-3 md:hidden">
                Thông báo
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:bg-destructive/90 focus:text-destructive-foreground py-2 px-3"
                onClick={handleSignOut}
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
