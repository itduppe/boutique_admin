"use client";

import Cookies from "js-cookie";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import authServices from '@/services/authServices';
import { information } from '@/utils/info.const';
import { toast } from "react-toastify";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '', site: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleChangeSelectSystem = (
    e: React.SyntheticEvent<Element, Event>,
    value: any
  ) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authServices.login(form);
      localStorage.setItem("site-system", form.site);
      Cookies.set("token", res.data, { expires: 0.5, path: '/' });

      if (res.status_code == 200 && res.data) {
        setTimeout(() => {
          router.push("/admin");
        }, 3000);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full m-auto">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5 p-3 mt-30">
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto ">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-center text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng Nhập
            </h1>
          </div>
          <div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="Username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange} />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      name="password"
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>
                    System <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <select
                      name="site"
                      className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                      value={form.site}
                      onChange={(e) => handleChangeSelectSystem(e, e.target.value)}
                    >
                      <option value="">-- Chọn hệ thống --</option>
                      {Object.entries(information.system).map(([key, label]) => (
                        <option key={key} value={label}>
                          {label}
                        </option>
                      ))}

                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    {loading ? 'Loading...' : 'Sign in'}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Chưa có tài khoản vui lòng liên hệ ? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Admin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}