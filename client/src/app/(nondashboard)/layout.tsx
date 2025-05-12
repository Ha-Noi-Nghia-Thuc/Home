import Navbar from "@/components/navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="h-full flex w-full flex-col">{children}</main>
    </div>
  );
};

export default Layout;
