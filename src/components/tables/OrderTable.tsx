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
import orderServices from '@/services/orderServices';

import TextArea from "../form/input/TextArea";

export default function OrderTable() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { isOpen, modalType, openModal, closeModal } = useMultiModal();
    const [form, setForm] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editReviewId, setEditReviewId] = useState(null);
    const [filters, setFilters] = useState({
        username: '',
    });

    useEffect(() => {
        if (isOpen) {
            setForm({
                product_id: '',
                title: '',
                content: '',
                note: '',
                type_message: '',
                site: 'F168',
                created_by: 'ADMIN'
            });

            setError('');
        }
    }, [isOpen, modalType]);

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let res;
            if (modalType === "update") {
                res = await orderServices.updateStatusById(form, editReviewId);

                if (res.status_code == 200) {
                    alert(res.message)
                    closeModal();
                    fetchOrders();
                } else {
                    alert(res.message)
                }
            }

        } catch (err) {
            setError('Thao tác thất bại. Vui lòng kiểm tra thông tin.');
        } finally {
            setLoading(false);
        }
    };

    const deleteOrder = async (id) => {
        setError('');
        setLoading(true);

        try {
            await orderServices.delete(id);
            toast.success("Xóa bình luận thành công");
            fetchOrders();
        } catch (err) {
            setError('Xóa bình luận thất bại. Vui lòng kiểm tra thông tin.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = async () => {
        const params = {};

        if (filters.username) params.username = filters.username;
        await fetchOrders(params);
    }

    const fetchOrders = async (searchParams = {}) => {
        try {
            const params = {
                page: 1,
                limit: 10,
                site: 'F168',
                ...searchParams
            };

            const review = await orderServices.getAll(params);
            setData(review.data);
            setCurrentPage(review.page);
            setItemsPerPage(review.total);
        } catch (err) {
            toast.error("Danh sách bình luận bị lỗi !");
        }
    };

    const fetchReviewId = async (id) => {
        try {
            // const res = await Orderservices.getById(id);
            // const data = res.data;

            // setForm({
            //     username: data.username,
            //     display_name: data.display_name,
            //     avatar: data.avatar,
            //     content: data.content,
            //     location: data.location,
            //     status: data.status,
            //     created_by: data.created_by,
            // });

            openModal("update");
        } catch (err) {
            console.error("Lỗi lấy dữ liệu review", err);
        }
    }

    // useEffect(() => {
    //     if (editReviewId) {
    //         fetchReviewId(editReviewId);
    //     }
    // }, [editReviewId]);

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="m-5 flex justify-between">
                    <div className="flex items-center max-w-sm">
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                                </svg>
                            </div>
                            <input
                                value={filters.username}
                                onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                                type="text" id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search username..." required />
                        </div>
                        <button
                            onClick={(e) => { e.preventDefault(); handleSearch(); }}
                            type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </div>

                    <button
                        onClick={() => openModal("add")}
                        type="button"
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Xóa nhiều order
                    </button>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {["STT", "Tên tài khoản", "Hệ thống", "Nội dung", "Trạng thái", "Vị trí", "Ngày tạo", "Ngày cập nhật", "Hành Động"].map((header, idx) => (
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
                                {data.map((review, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">{index + 1}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{review.reviewname}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{review.site}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{review.content}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{review.status ? "Hiển thị" : "Tạm ẩn"}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{review.location}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{new Date(review.createdAt).toLocaleDateString("vi-VN", { timeZone: 'UTC' })}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{new Date(review.updatedAt).toLocaleDateString("vi-VN", { timeZone: 'UTC' })}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditReviewId(review._id);
                                                        fetchReviewId(review._id);
                                                    }}
                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => deleteOrder(review._id)}
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
                            {modalType === "add" ? "Tạo tin nhắn khách" : "Sửa tin nhắn khách"}
                        </h4>
                    </div>

                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <>
                                <Label>Tên tài khoản</Label>
                                <select
                                    name="product"
                                    className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                                    value={form.product_id}
                                    onChange={(e) => handleChange(e, e.target.value)}
                                >
                                    <option value="">-- Chọn sản phẩm --</option>

                                    <option value="abc">
                                        Sản phẩm 1
                                    </option>
                                    <option value="abc">
                                        Sản phẩm 1
                                    </option>
                                </select>
                                <br />

                                <Label>Tiêu đề</Label>
                                <Input
                                    type="text"
                                    placeholder="Tiêu đề"
                                    value={form.title}
                                    name="title"
                                    onChange={handleChange}
                                />
                                <br />
                                <Label>Nội dung</Label>
                                <textarea name="content"
                                    rows={4}
                                    onChange={handleChange}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nội dung ở đây ...">
                                </textarea>
                                <br />
                                <Label>Ghi chú</Label>
                                <textarea name="note"
                                    rows={4}
                                    onChange={handleChange}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nội dung ở đây ...">
                                </textarea>
                                <br />
                                <Label>Loại thư</Label>
                                <select
                                    name="type_message"
                                    className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                                    value={form.product_id}
                                    onChange={(e) => handleChange(e, e.target.value)}
                                >
                                    <option value="">-- Chọn sản phẩm --</option>

                                    <option value="deny">
                                        Thông báo từ chối
                                    </option>
                                    <option value="success">
                                        Thông báo thành công
                                    </option>
                                </select>
                            </>

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
