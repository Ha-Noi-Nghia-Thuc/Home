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

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-colors duration-300",
        "bg-background/95 backdrop-blur-sm border-b border-border"
      )}
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full h-full py-3 px-4 md:px-8 max-w-screen-xl mx-auto">
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
              "text-xl lg:text-2xl font-heading font-bold hover:text-primary transition-colors duration-300",
              navTitleColor
            )}
          >
            Hà Nội Nghĩa Thục
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hover:text-primary transition-colors",
                pathname === link.href
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {pathname === "/" && !authUser && (
          <p className="text-muted-foreground hidden lg:block text-sm">
            Khai dân trí - Chấn dân khí - Hậu dân sinh
          </p>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          {authUser ? (
            <>
              <button
                type="button"
                className="relative hidden md:block p-2 rounded-full hover:bg-muted"
                aria-label="Tin nhắn"
              >
                <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </button>
              <button
                type="button"
                className="relative hidden md:block p-2 rounded-full hover:bg-muted"
                aria-label="Thông báo"
              >
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none rounded-full p-1 hover:bg-muted">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={authUser.userInfo?.avatarUrl || undefined}
                      alt={authUser.userInfo?.name || "User avatar"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {authUser.userInfo?.name
                        ? authUser.userInfo.name[0].toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium text-foreground hidden md:block">
                    {authUser.userInfo?.name}
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
                        authUser.userInfo?.userType === "ADMIN"
                          ? "/admin/settings"
                          : authUser.userInfo?.userType === "AUTHOR"
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
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in" passHref>
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/sign-up" passHref>
                <Button
                  variant="default"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
