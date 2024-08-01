"use client";
import React, { useState } from "react";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@nextui-org/spinner";
import { redirect } from "next/navigation";
import { SearchCommand } from "@/components/search-command";
import { SidebarProvider } from "./contexts/SidebarContext";
import { Sidebar } from "./_components/Sidebar";

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="text-foreground bg-background h-screen flex items-center justify-center">
        <Spinner color="secondary" className="py-4 mt-10" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="flex h-screen">
      <main>
        <SearchCommand />
        <SidebarProvider>
                  <div className="z-50">
          <Sidebar />
        </div>
          {children}
          </SidebarProvider>
      </main>
    </div>
  );
};

export default MainLayout;
