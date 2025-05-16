"use client";

import Footer from "@/components/footer";
import LoadingSpinner from "@/components/loading-spinner";
import Navbar from "@/components/navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/store/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NondashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for userInfo for more robust auth detection
    if (authUser && authUser.userInfo) {
      if (pathname === "/") {
        router.replace("/user", { scroll: false });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) {
    // Replace with your app's spinner or skeleton if available
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main
        className="flex-grow w-full flex flex-col"
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default NondashboardLayout;
