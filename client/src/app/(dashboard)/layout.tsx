"use client";

import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/store/api";
import React from "react";
import { useRouter } from "next/navigation";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p>Loading dashboard...</p>
  </div>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading, isError } = useGetAuthUserQuery();
  const router = useRouter();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !authUser?.userInfo || !authUser?.userRole) {
    React.useEffect(() => {
      router.push("/sign-in");
    }, [router]);
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
