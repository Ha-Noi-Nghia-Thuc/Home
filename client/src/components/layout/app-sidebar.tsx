"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit3,
  FileText,
  LayoutDashboard,
  Menu as MenuIcon,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

// Role-based navigation links config
const roleLinks = {
  ADMIN: [
    {
      icon: LayoutDashboard,
      label: "Tổng quan",
      href: "/admin/dashboard",
    },
    { icon: Users, label: "Quản lý người dùng", href: "/admin/manage-users" },
    {
      icon: FileText,
      label: "Quản lý bài viết",
      href: "/admin/manage-articles",
    },
    {
      icon: ShieldCheck,
      label: "Xét duyệt vai trò",
      href: "/admin/role-requests",
    },
    { icon: Settings, label: "Cài đặt", href: "/admin/settings" },
  ],
  AUTHOR: [
    {
      icon: LayoutDashboard,
      label: "Tổng quan",
      href: "/author/dashboard",
    },
    { icon: Edit3, label: "Viết bài mới", href: "/authors/articles/create" },
    { icon: FileText, label: "Bài viết của tôi", href: "/authors/my-articles" },
    { icon: Settings, label: "Cài đặt", href: "/authors/settings" },
  ],
  USER: [
    { icon: LayoutDashboard, label: "Hồ sơ", href: "/users/profile" },
    { icon: FileText, label: "Bài Viết Đã Lưu", href: "/users/saved-posts" },
    { icon: Settings, label: "Cài đặt", href: "/users/settings" },
  ],
} as const;

const getSidebarTitle = (userRole: string) => {
  if (userRole === "ADMIN") return "Trang Quản Trị";
  if (userRole === "AUTHOR") return "Không Gian Tác Giả";
  return "Tổng quan";
};

const AppSidebar = ({ userRole, isLoading }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open, setOpen } = useSidebar();
  const isMobile = useIsMobile();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile && open) {
      setOpen(false);
    }
  }, [pathname, isMobile, setOpen, open]);

  // Close sidebar if switching to mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  // Get links for current role, default to USER
  const navLinks = useMemo(
    () => roleLinks[userRole as keyof typeof roleLinks] || roleLinks.USER,
    [userRole]
  );

  return (
    <>
      <AnimatePresence>
        {/* Overlay for mobile sidebar */}
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      <Sidebar
        collapsible="icon"
        className={cn(
          "fixed left-0",
          "bg-background/95 backdrop-blur-md border-r border-border/50",
          "transition-all duration-300 ease-in-out z-50",
          "shadow-lg shadow-accent/5",
          isMobile
            ? open
              ? "translate-x-0 w-72"
              : "-translate-x-full w-72"
            : open
            ? "w-64"
            : "w-[56px]",
          "pt-0"
        )}
        style={{
          top: `${NAVBAR_HEIGHT}px`,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
        aria-label="Thanh điều hướng bên"
      >
        <SidebarHeader className="border-b border-border/50 pb-2 pt-1 bg-background/95">
          <div
            className={cn(
              "flex min-h-[48px] w-full items-center",
              open || isMobile ? "px-3" : "justify-center"
            )}
          >
            <AnimatePresence mode="wait">
              {(open || isMobile) && (
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "text-lg font-heading font-semibold text-accent",
                    "ml-5"
                  )}
                >
                  {getSidebarTitle(userRole)}
                </motion.h1>
              )}
            </AnimatePresence>
            <button
              className={cn(
                "ml-auto hover:bg-muted/80 p-2 rounded-md",
                "transition-all duration-300 shrink-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "text-muted-foreground hover:text-accent"
              )}
              onClick={() => toggleSidebar()}
              aria-label={open ? "Đóng thanh bên" : "Mở thanh bên"}
              aria-expanded={open}
              aria-controls="sidebar-menu"
              tabIndex={0}
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </SidebarHeader>

        <SidebarContent className="pt-3 overflow-y-auto">
          <nav id="sidebar-menu" aria-label="Thanh điều hướng bên">
            <SidebarMenu>
              {isLoading
                ? // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <div className="flex items-center gap-3 px-3 py-2.5">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </SidebarMenuItem>
                  ))
                : navLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      pathname.startsWith(link.href + "/");

                    const menuButton = (
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "flex items-center my-0.5 rounded-md",
                          "transition-all duration-300 ease-in-out group",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                          (open || isMobile) && `px-3 py-2.5 gap-3`,
                          !open &&
                            !isMobile &&
                            "justify-center py-3 w-[calc(100%-8px)] mx-auto",
                          isActive
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-muted-foreground hover:bg-muted/80 hover:text-accent",
                          isMobile && "py-3 text-base"
                        )}
                        onClick={
                          isMobile && open ? () => setOpen(false) : undefined
                        }
                        tooltip={
                          !open && !isMobile
                            ? {
                                children: (
                                  <div className="flex flex-col gap-1">
                                    <span>{link.label}</span>
                                  </div>
                                ),
                              }
                            : undefined
                        }
                      >
                        <Link
                          href={link.href}
                          className="w-full h-full flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          scroll={false}
                          aria-current={isActive ? "page" : undefined}
                          tabIndex={0}
                        >
                          <link.icon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-colors duration-300",
                              isActive
                                ? "text-accent"
                                : "text-muted-foreground group-hover:text-accent"
                            )}
                            aria-hidden="true"
                            focusable="false"
                          />
                          <AnimatePresence mode="wait">
                            {(open || isMobile) && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                  "font-medium text-sm truncate",
                                  isMobile && "text-base"
                                )}
                              >
                                {link.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Link>
                      </SidebarMenuButton>
                    );

                    return (
                      <SidebarMenuItem key={link.href}>
                        {menuButton}
                      </SidebarMenuItem>
                    );
                  })}
            </SidebarMenu>
          </nav>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
