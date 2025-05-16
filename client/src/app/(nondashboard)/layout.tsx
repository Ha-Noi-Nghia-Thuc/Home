"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/store/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NonashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      if (pathname === "/") {
        router.push("/user", { scroll: false });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) {
    return <>Loading...</>;
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

export default NonashboardLayout;
