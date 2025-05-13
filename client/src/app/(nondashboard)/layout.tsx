import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
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

export default Layout;
