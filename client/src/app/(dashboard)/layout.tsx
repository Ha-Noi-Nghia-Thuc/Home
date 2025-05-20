"use client";

import AppSidebar from "@/components/layout/app-sidebar";
import Navbar from "@/components/layout/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/store/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Role } from "@/types/prismaTypes";

function isRole(role: any): role is Role {
  return role === "ADMIN" || role === "AUTHOR" || role === "USER";
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading, isError } = useGetAuthUserQuery();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(true);

  // Redirect if not authenticated or error
  useEffect(() => {
    if (
      !isLoading &&
      (isError || !authUser?.userInfo || !isRole(authUser?.userRole))
    ) {
      router.push("/sign-in");
      setShouldRender(false);
    } else {
      setShouldRender(true);
    }
  }, [isLoading, isError, authUser, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!shouldRender) {
    return null;
  }

  // Only render if userRole is a valid Role
  if (!isRole(authUser?.userRole)) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-100 dark:bg-neutral-900">
        <Navbar />
        <div className="flex" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
          <AppSidebar userType={authUser.userRole} />
          <main
            className="flex-grow transition-all duration-300 overflow-auto"
            style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
          >
            <div className="p-4 md:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
