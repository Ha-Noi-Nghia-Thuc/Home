"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CalendarDays,
  Edit3,
  FileText,
  LayoutDashboard,
  Menu as MenuIcon,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

const SIDEBAR_CONTENT_PADDING_X = "px-3";
const ICON_CONTAINER_WIDTH_PLUS_GAP = "ml-5";

// Role-based navigation links config
const roleLinks = {
  ADMIN: [
    {
      icon: LayoutDashboard,
      label: "Tổng Quan Quản Trị",
      href: "/admin/dashboard",
    },
    { icon: Users, label: "Quản Lý Người Dùng", href: "/admin/manage-users" },
    { icon: FileText, label: "Quản Lý Bài Viết", href: "/admin/manage-posts" },
    {
      icon: BookOpen,
      label: "Quản Lý Khóa Học",
      href: "/admin/manage-courses",
    },
    {
      icon: MessageSquare,
      label: "Quản Lý Diễn Đàn",
      href: "/admin/manage-forum",
    },
    {
      icon: CalendarDays,
      label: "Quản Lý Sự Kiện",
      href: "/admin/manage-events",
    },
    {
      icon: ShieldCheck,
      label: "Xét Duyệt Vai Trò",
      href: "/admin/role-requests",
    },
    { icon: Settings, label: "Cài đặt tài khoản", href: "/admin/settings" },
  ],
  AUTHOR: [
    {
      icon: LayoutDashboard,
      label: "Trang Tác Giả",
      href: "/author/dashboard",
    },
    { icon: Edit3, label: "Viết Bài Mới", href: "/author/posts/create" },
    { icon: FileText, label: "Bài Viết Của Tôi", href: "/author/my-posts" },
    {
      icon: MessageSquare,
      label: "Bình Luận Bài Viết",
      href: "/author/comments",
    },
    { icon: Settings, label: "Cài đặt tài khoản", href: "/author/settings" },
  ],
  USER: [
    { icon: LayoutDashboard, label: "Trang Cá Nhân", href: "/user/profile" },
    { icon: BookOpen, label: "Khóa Học Của Tôi", href: "/user/my-courses" },
    {
      icon: MessageSquare,
      label: "Hoạt Động Diễn Đàn",
      href: "/user/forum-activity",
    },
    { icon: FileText, label: "Bài Viết Đã Lưu", href: "/user/saved-posts" },
    { icon: Settings, label: "Cài đặt tài khoản", href: "/user/settings" },
  ],
};

const getSidebarTitle = (userType: string) => {
  if (userType === "ADMIN") return "Trang Quản Trị";
  if (userType === "AUTHOR") return "Không Gian Tác Giả";
  return "Bảng Điều Khiển";
};

const AppSidebar = ({ userType }: AppSidebarProps) => {
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
  const navLinks =
    roleLinks[userType as keyof typeof roleLinks] || roleLinks.USER;

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar
        collapsible="icon"
        className={cn(
          "fixed left-0 bg-background/95 backdrop-blur-sm border-r border-border transition-transform duration-300 ease-in-out z-50 shadow-xl",
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
        <SidebarHeader className="border-b border-border pb-2 pt-1">
          <div
            className={cn(
              "flex min-h-[48px] w-full items-center",
              open || isMobile ? SIDEBAR_CONTENT_PADDING_X : "justify-center"
            )}
          >
            {(open || isMobile) && (
              <h1
                className={cn(
                  "text-lg font-heading font-semibold text-primary truncate flex-grow",
                  ICON_CONTAINER_WIDTH_PLUS_GAP
                )}
              >
                {getSidebarTitle(userType)}
              </h1>
            )}
            <button
              className={cn(
                "hover:bg-muted p-2 rounded-md transition-colors duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                (open || isMobile) && "ml-2"
              )}
              onClick={() => toggleSidebar()}
              aria-label={open ? "Đóng thanh bên" : "Mở thanh bên"}
              aria-expanded={open}
              aria-controls="sidebar-menu"
              tabIndex={0}
            >
              {open ? (
                <X className="h-5 w-5 text-muted-foreground" />
              ) : (
                <MenuIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </SidebarHeader>

        <SidebarContent className="pt-3 overflow-y-auto">
          <nav id="sidebar-menu" aria-label="Thanh điều hướng bên">
            <SidebarMenu>
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex items-center my-0.5 rounded-md transition-colors duration-150 ease-in-out group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        (open || isMobile) &&
                          `${SIDEBAR_CONTENT_PADDING_X} py-2.5 gap-3`,
                        !open &&
                          !isMobile &&
                          "justify-center py-3 w-[calc(100%-8px)] mx-auto",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        isMobile && "py-3 text-base"
                      )}
                      onClick={
                        isMobile && open ? () => setOpen(false) : undefined
                      }
                    >
                      <Link
                        href={link.href}
                        className="w-full h-full flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        scroll={false}
                        aria-current={isActive ? "page" : undefined}
                        tabIndex={0}
                      >
                        <link.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                          aria-hidden="true"
                          focusable="false"
                        />
                        {(open || isMobile) && (
                          <span
                            className={cn(
                              "font-medium text-sm truncate",
                              isMobile && "text-base"
                            )}
                          >
                            {link.label}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
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
