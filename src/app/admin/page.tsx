"use client";

import type { Metadata } from "next";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from 'next/navigation';

// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

const AdminDashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }

    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!checkingAuth && !token) {
      router.push('/login');
    }
  }, [checkingAuth, token, router]);

  if (checkingAuth) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">

    </div>
  );
}

export default AdminDashboard;