import { cn } from "@/lib/utils";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const UserDropdown = ({ userInfo, onSignOut }: UserDropdownProps) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 focus:outline-none rounded-md p-1.5",
          "hover:bg-muted/80 hover:text-accent",
          "focus-visible:hidden",
          "transition-all duration-300 group"
        )}
      >
        <Avatar
          className={cn(
            "w-8 h-8 ring-2 ring-accent/20",
            "transition-all duration-300",
            "group-hover:ring-accent/40 group-hover:scale-105"
          )}
        >
          <AvatarImage
            src={userInfo.data.avatarUrl || undefined}
            alt={userInfo.data.name || `${userInfo.data.name}'s avatar`}
            className="object-cover"
          />
          <AvatarFallback className="bg-accent/10 text-accent font-medium">
            {userInfo.data.name ? userInfo.data.name[0].toUpperCase() : "N"}
          </AvatarFallback>
        </Avatar>
        <p className="text-xs font-medium text-foreground hidden md:block">
          {userInfo.data.name}
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          "bg-background/95 backdrop-blur-md border border-border/50",
          "w-56 shadow-lg mt-1 rounded-md",
          "animate-in fade-in-80 zoom-in-95"
        )}
        align="end"
      >
        <DropdownMenuItem
          className={cn(
            "cursor-pointer py-2 px-3 text-sm",
            "hover:bg-muted/80 hover:text-accent",
            "focus:bg-muted/80 focus:text-accent",
            "transition-all duration-300 group/item"
          )}
          onClick={() =>
            router.push(
              userInfo.data.userRole === "ADMIN"
                ? "/admin/dashboard"
                : userInfo.data.userRole === "AUTHOR"
                ? "/author/dashboard"
                : "/users/dashboard"
            )
          }
        >
          <LayoutDashboard className="w-4 h-4 mr-2 text-muted-foreground group-hover/item:text-accent transition-colors duration-300" />
          Tổng quan
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "cursor-pointer py-2 px-3 text-sm",
            "hover:bg-muted/80 hover:text-accent",
            "focus:bg-muted/80 focus:text-accent",
            "transition-all duration-300 group/item"
          )}
          onClick={() =>
            router.push(
              userInfo.data.userRole === "ADMIN"
                ? "/admin/profile"
                : userInfo.data.userRole === "AUTHOR"
                ? "/author/profile"
                : "/users/profile"
            )
          }
        >
          <UserCircle className="w-4 h-4 mr-2 text-muted-foreground group-hover/item:text-accent transition-colors duration-300" />
          Hồ sơ
        </DropdownMenuItem>

        <div className="md:hidden">
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem
            className={cn(
              "cursor-pointer py-2 px-3 text-sm",
              "hover:bg-muted/80 hover:text-accent",
              "focus:bg-muted/80 focus:text-accent",
              "transition-all duration-300 group/item"
            )}
            onClick={() => router.push("/messages")}
          >
            <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground group-hover/item:text-accent transition-colors duration-300" />
            Tin nhắn
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "cursor-pointer py-2 px-3 text-sm",
              "hover:bg-muted/80 hover:text-accent",
              "focus:bg-muted/80 focus:text-accent",
              "transition-all duration-300 group/item"
            )}
            onClick={() => router.push("/notifications")}
          >
            <Bell className="w-4 h-4 mr-2 text-muted-foreground group-hover/item:text-accent transition-colors duration-300" />
            Thông báo
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          className={cn(
            "cursor-pointer py-2 px-3 text-sm",
            "text-destructive hover:bg-destructive/10 hover:text-destructive",
            "focus:bg-destructive/10 focus:text-destructive",
            "transition-all duration-300 group/item"
          )}
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 mr-2 text-destructive/70 group-hover/item:text-destructive transition-colors duration-300" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
