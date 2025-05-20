"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetAuthUserQuery } from "@/store/api";
import { signOut as amplifySignOut } from "aws-amplify/auth";
import { motion } from "framer-motion";
import { Bell, Menu as MenuIconLucide, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import UserDropdown from "../utils/user-dropdown";

const mainNavLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/courses", label: "Khóa học" },
  { href: "/articles", label: "Bài viết" },
  { href: "/events", label: "Sự kiện" },
  { href: "/forum", label: "Diễn đàn" },
] as const;

const getNavTitleColor = (pathname: string) =>
  pathname === "/" ? "text-accent" : "text-foreground";

const NavbarGuest = ({ className }: NavbarGuestProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const navTitleColor = getNavTitleColor(pathname);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 w-full z-50",
        "bg-background/80 backdrop-blur-md border-b border-border/50",
        "transition-all duration-300",
        className
      )}
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex flex-row items-center justify-between w-full h-full px-4 md:px-8 max-w-screen-xl mx-auto">
        <Link
          href="/"
          className={cn(
            "text-xl lg:text-2xl font-heading font-bold",
            "transition-all duration-300",
            "hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
            navTitleColor
          )}
          tabIndex={0}
        >
          Hà Nội Nghĩa Thục
        </Link>

        <p className="hidden md:inline-block text-muted-foreground text-center text-sm font-medium">
          Khai dân trí - Chấn dân khí - Hậu dân sinh
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className={cn(
              "border-neutral-400/30 text-foreground",
              "hover:bg-white/10 hover:text-white hover:border-accent/50",
              "focus-visible:ring-2 focus-visible:ring-accent",
              "transition-all duration-300"
            )}
            onClick={() => router.push("/sign-in")}
          >
            Đăng nhập
          </Button>
          <Button
            variant="default"
            className={cn(
              "bg-accent text-accent-foreground",
              "hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20",
              "focus-visible:ring-2 focus-visible:ring-accent",
              "transition-all duration-300"
            )}
            onClick={() => router.push("/sign-up")}
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const NavbarUser = ({ userInfo, className }: NavbarUserProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = useCallback(async () => {
    try {
      await amplifySignOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, []);

  const isDashboardPage = useMemo(
    () => ["/user", "/admin"].some((prefix) => pathname.startsWith(prefix)),
    [pathname]
  );

  const navTitleColor = getNavTitleColor(pathname);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 w-full z-50",
        "bg-background/80 backdrop-blur-md border-b border-border/50",
        "transition-all duration-300",
        className
      )}
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex flex-row items-center justify-between w-full h-full px-4 md:px-8 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger
                aria-label="Mở thanh bên"
                className={cn(
                  "p-2 rounded-md mr-2",
                  "hover:bg-muted/80 hover:text-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  "transition-all duration-300"
                )}
              >
                <MenuIconLucide className="h-6 w-6 text-foreground" />
              </SidebarTrigger>
            </div>
          )}

          <Link
            href="/"
            className={cn(
              "text-xl lg:text-2xl font-heading font-bold",
              "transition-all duration-300",
              "hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
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
                "transition-all duration-300 px-2 py-1 rounded-md",
                "hover:text-accent hover:bg-muted/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                pathname === link.href
                  ? "text-accent font-semibold bg-muted/30"
                  : "text-muted-foreground"
              )}
              tabIndex={0}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
            className={cn(
              "relative hidden md:flex items-center justify-center p-2 rounded-md",
              "hover:bg-muted/80 hover:text-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              "transition-all duration-300"
            )}
            aria-label="Tin nhắn"
            tabIndex={0}
          >
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            type="button"
            className={cn(
              "relative hidden md:flex items-center justify-center p-2 rounded-md",
              "hover:bg-muted/80 hover:text-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              "transition-all duration-300"
            )}
            aria-label="Thông báo"
            tabIndex={0}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <UserDropdown userInfo={userInfo} onSignOut={handleSignOut} />
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();

  if (!authUser || !authUser.userInfo) {
    return <NavbarGuest />;
  }

  return <NavbarUser userInfo={authUser.userInfo} />;
};

export default Navbar;
