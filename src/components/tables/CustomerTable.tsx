import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import { useMultiModal } from "@/hooks/useMultiModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import customerServices from '@/services/customerServices';
import { useAuth } from "@/context/AuthContext";

export default function Customer() {
    const [data, setData] = useState([]);
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { isOpen, modalType, openModal, closeModal } = useMultiModal();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ username: '', password: '', site: 'F168' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [filters, setFilters] = useState({
        username: '',
    });

    useEffect(() => {
        if (isOpen) {
            setForm({ username: '', password: '', site: 'F168' });
            setError('');
        }
    }, [isOpen, modalType]);

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let res;
            if (modalType === "add") {
                
            } else if (modalType === "changePass") {
                
            }

        } catch (err) {
            setError('Thao tác thất bại. Vui lòng kiểm tra thông tin.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSearch = async () => {
        const params = {};

        if (filters.username) params.username = filters.username;
        await fetchCustomers(params);
    }

    const fetchCustomers = async (searchParams = {}) => {
        try {
            const params = {
                page: 1,
                limit: 10,
                ...searchParams
            };

            const customers = await customerServices.getAll(params);
            setData(customers.data);
            setCurrentPage(customers.page);
            setItemsPerPage(customers.total);
        } catch (err) {
            toast.error("Danh sách người dùng bị lỗi !");
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {["STT", "Tên tài khoản", "Hành Động"].map((header, idx) => (
                                        <TableCell
                                            key={idx}
                                            isHeader
                                            className={`px-5 py-3 font-medium text-gray-500 ${header === "Hành Động" ? "text-center" : "text-start"} text-theme-xs dark:text-gray-400`}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {data.map((customer, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    // onClick={() => {
                                                    //     setEditCustomerId(user._id);
                                                    //     openModal("changePass");
                                                    // }}
                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                >
                                                    Đổi mật khẩu
                                                </button>
                                                <button
                                                    // onClick={() => deleteCustomer(user._id)}
                                                    type="button"
                                                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {modalType === "add" ? "Tạo người dùng mới" : "Đổi mật khẩu"}
                        </h4>
                    </div>

                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            {modalType === "add" && (
                                <>
                                    <Label>Tên tài khoản</Label>
                                    <Input
                                        type="text"
                                        placeholder="Tên tài khoản"
                                        value={form.username}
                                        name="username"
                                        onChange={handleChange}
                                    />
                                    <br />
                                </>
                            )}

                            {modalType === "changePass" && (
                                <>
                                    <Label>Mật khẩu cũ</Label>
                                    <Input
                                        type="text"
                                        placeholder="Mật khẩu cũ"
                                        value={form.oldPassword}
                                        name="oldPassword"
                                        onChange={handleChange}
                                    />
                                    <br />
                                </>
                            )}

                            <Label>{modalType === "add" ? "Mật khẩu" : "Mật khẩu mới"}</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={modalType === "add" ? "Mật khẩu" : "Mật khẩu mới"}
                                    value={form.password}
                                    name="password"
                                    onChange={handleChange}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute z-30 cursor-pointer right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                                </span>
                            </div>
                            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Đóng
                            </Button>
                            <Button size="sm" onClick={handleSave}>
                                {loading ? 'Đang xử lý...' : 'Lưu thông tin'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
