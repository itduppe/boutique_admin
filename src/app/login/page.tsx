'use client';

import { useState } from 'react';
import SignInForm from "@/components/auth/SignInForm";
// import {  Metadata } from "next";
import authServices from '@/services/authServices';
import { useRouter } from 'next/navigation';

// export const metadata: Metadata = {
//   title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Signin Page TailAdmin Dashboard Template",
// };

export default function SignIn() {
  const router = useRouter();

  return <SignInForm />;
}