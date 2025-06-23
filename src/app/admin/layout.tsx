"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!isLoading && !user) {
      refreshUser();
    }
  }, [isLoading, user, refreshUser, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader />
          <div className="p-4 mx-auto max-w-screen-2xl md:p-6">{children}</div>
        </div>
      </div>

      <ToastContainer position="top-right" className="!top-25" autoClose={3000} />
    </>
  );
}