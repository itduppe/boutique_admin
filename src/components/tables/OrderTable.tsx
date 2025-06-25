import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import { useMultiModal } from "@/hooks/useMultiModal";
import orderServices from '@/services/orderServices';
import { getSiteSystem } from "@/utils/storage";
import { information } from '@/utils/info.const';
import DatePicker from '@/components/form/date-picker';
import { formatDateTimeVN } from "@/utils/formatDateTime";

const initialForm = {
    product_id: '',
    title: '',
    content: '',
    note: '',
    type_message: '',
    site: getSiteSystem(),
    created_by: 'ADMIN'
}

interface OrderStatus {
    id: string;
    status: string;
}

interface Filters {
    username?: string;
    phone_number?: string;
    address?: string;
    full_name?: string;
    product_id?: string;
    from_date?: string;
    to_date?: string;
    status?: string;
    page: number;
    pageSize: number;
}

interface OrderStatusCount {
    allSuccess: number;
    allPending: number;
    allConfirm: number;
    allShipped: number;
    allDeny: number;
}

export interface Order {
    _id: string;
    product_id: string;
    product_name: string;
    color: string;
    size: string;
    username: string;
    full_name: string;
    phone_number: string;
    address: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    status: string;
}

export default function OrderTable() {
    const [data, setData] = useState<Order[]>([]);
    const [countData, setCountData] = useState<OrderStatusCount>({
        allSuccess: 0,
        allPending: 0,
        allConfirm: 0,
        allShipped: 0,
        allDeny: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { isOpen, modalType, openModal, closeModal } = useMultiModal();
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        from_date: "",
        to_date: "",
        username: "",
        phone_number: "",
        address: "",
        full_name: "",
        product_id: "",
        status: "",
        page: 1,
        pageSize: 10
    });
    const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [showMenu, setShowMenu] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0)
    const totalPages = Math.ceil(totalItems / filters.pageSize);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagedData = data.slice(startIndex, endIndex);

    useEffect(() => {
        if (isOpen) {
            setError('');
        }
    }, [isOpen, modalType]);

    const deleteOrder = async (id: string) => {
        try {
            await orderServices.delete(id);
            fetchOrders();
        } catch (err) {
            setError('Xóa bình luận thất bại. Vui lòng kiểm tra thông tin.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = async () => {
        const { username, phone_number, address, full_name, product_id, from_date, to_date, status, page, pageSize } = filters;

        const params = {
            ...(username && { username }),
            ...(phone_number && { phone_number }),
            ...(address && { address }),
            ...(full_name && { full_name }),
            ...(product_id && { product_id }),
            ...(from_date && { from_date }),
            ...(to_date && { to_date }),
            ...(status && { status }),
            page,
            pageSize,
            site: getSiteSystem()
        };

        await fetchOrders(params);
    }

    const handleExportExcel = async () => {
        try {
            const { username, phone_number, address, full_name, product_id, from_date, to_date, status, pageSize } = filters;

            const params = {
                ...(username && { username }),
                ...(phone_number && { phone_number }),
                ...(address && { address }),
                ...(full_name && { full_name }),
                ...(product_id && { product_id }),
                ...(from_date && { from_date }),
                ...(to_date && { to_date }),
                ...(status && { status }),
                pageSize: pageSize || 1000,
                site: getSiteSystem(),
            };

            const blob = await orderServices.getExport(params);

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'orders_export.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Xuất Excel thất bại';
            toast.error(msg);
        }
    };

    const fetchOrders = async (searchParams = {}) => {
        try {
            const params = {
                site: getSiteSystem(),
                ...searchParams
            };

            const orders = await orderServices.getAll(params);
            setData(orders.data);
            setTotalItems(orders.total);
        } catch (err) {
            toast.error("Danh sách lỗi !");
        }
    };

    const updateOrderStatus = async (orderStatus: OrderStatus) => {
        try {
            const res = await orderServices.updateStatusById(orderStatus);

            if (res.status_code == 200) {
                closeModal();
                handleSearch();
                setShowMenu(null);
            } else {
                toast.error(res.message)
            }
        } catch (err) {
            setError('Thao tác thất bại. Vui lòng kiểm tra thông tin.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [filters]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showMenu === null) return;

            const currentRef = menuRefs.current[showMenu];
            if (currentRef && !currentRef.contains(event.target as Node)) {
                setShowMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] !min-h-[80vh]">
                <div className="m-5 flex items-center">
                    <div className="text-2xl">Quản lý đơn hàng | </div>
                    {Object.entries(information.order_status).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setFilters((prev) => ({ ...prev, status: key, page: 1 }))}
                            className={`block text-md px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded ${filters.status === key ? 'bg-blue-500 text-white' : ''
                                }`}
                        >
                            {label} {" "}
                            {key === 'success' && `(${countData.allSuccess})`}
                            {key === 'pending' && `(${countData.allPending})`}
                            {key === 'confirm' && `(${countData.allConfirm})`}
                            {key === 'shipped' && `(${countData.allShipped})`}
                            {key === 'deny' && `(${countData.allDeny})`}
                        </button>
                    ))}
                </div>

                <div className="w-full flex justify-end">
                    <button
                        onClick={() => openModal("add")}
                        type="button"
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Xóa nhiều order
                    </button>

                    <button
                        type="button"
                        onClick={handleExportExcel}
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        Export Order
                    </button>
                </div>

                <div className="m-5 flex justify-between">
                    <div className="w-full pb-10">
                        <div className="flex flex-wrap gap-5 mb-4">
                            <div className="w-[18.6%]">
                                <label htmlFor="username" className="sr-only">Tên Tài khoản</label>
                                <div className="relative w-full">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={filters.username}
                                        onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                                        className="border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5 p-2.5"
                                        placeholder="Tên Tài khoản"
                                    />
                                </div>
                            </div>

                            <div className="w-[18.6%]">
                                <label htmlFor="phone_number" className="sr-only">Số điện thoại</label>
                                <div className="relative w-full">
                                    <input
                                        id="phone_number"
                                        name="phone_number"
                                        type="text"
                                        value={filters.phone_number}
                                        onChange={(e) => setFilters({ ...filters, phone_number: e.target.value })}
                                        className="border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5 p-2.5"
                                        placeholder="Số điện thoại"
                                    />
                                </div>
                            </div>

                            <div className="w-[18.6%]">
                                <label htmlFor="address" className="sr-only">Địa Chỉ</label>
                                <div className="relative w-full">
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={filters.address}
                                        onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                                        className="border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5 p-2.5"
                                        placeholder="Địa Chỉ"
                                    />
                                </div>
                            </div>

                            <div className="w-[18.6%]">
                                <label htmlFor="full_name" className="sr-only">Tên đầy đủ</label>
                                <div className="relative w-full">
                                    <input
                                        id="full_name"
                                        name="full_name"
                                        type="text"
                                        value={filters.full_name}
                                        onChange={(e) => setFilters({ ...filters, full_name: e.target.value })}
                                        className="border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5 p-2.5"
                                        placeholder="Tên đầy đủ"
                                    />
                                </div>
                            </div>

                            <div className="w-[18.6%]">
                                <label htmlFor="product_id" className="sr-only">ID sản phẩm</label>
                                <div className="relative w-full">
                                    <input
                                        id="product_id"
                                        name="product_id"
                                        type="text"
                                        value={filters.product_id}
                                        onChange={(e) => setFilters({ ...filters, product_id: e.target.value })}
                                        className="border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2.5 p-2.5"
                                        placeholder="ID sản phẩm"
                                    />
                                </div>
                            </div>

                            <div className="w-[18.6%]">
                                <DatePicker
                                    id="date-picker"
                                    label="Ngày bắt đầu"
                                    value={filters.from_date}
                                    onChange={(selectedDates, dateStr01) => {
                                        setFilters({ ...filters, from_date: dateStr01 });
                                    }}
                                    placeholder="Chọn ngày bắt đầu"
                                />
                            </div>

                            <div className="w-[18.6%]">
                                <DatePicker
                                    id="date-picker"
                                    label="Ngày kết thúc"
                                    value={filters.to_date}
                                    onChange={(selectedDates, dateStr02) => {
                                        setFilters({ ...filters, to_date: dateStr02 });
                                    }}
                                    placeholder="Chọn ngày kết thúc"
                                />
                            </div>

                            <div className="w-[18.6%] mt-7">
                                <button
                                    onClick={(e) => { e.preventDefault(); handleSearch(); }}
                                    type="submit"
                                    className="h-auto p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800"
                                >
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                    <span className="sr-only">Search</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {["STT", "Sản phẩm", "Tài khoản", "Tên người nhận", "Điện thoại", "Địa chỉ", "TG Đăng Ký", "TG Xác nhận", "IP", "Trạng Thái", "Hành Động"].map((header, idx) => (
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
                                {pagedData.map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">{index + 1}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            Mã sản phẩm: {order.product_id} <br />
                                            {order.product_name} <br />
                                            Màu: {order.color} <br />
                                            Size: {order.size} <br />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{order.username}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{order.full_name}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{order.phone_number}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{order.address}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatDateTimeVN(order.createdAt)}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">{formatDateTimeVN(order.updatedAt)}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400"> Đang cập nhật </TableCell>

                                        <TableCell className="px-4 py-3 text-theme-sm dark:text-gray-400 text-center text-white">
                                            {Object.entries(information.order_status).map(([key, label]) => (
                                                order.status == key ? <div className="text-white bg-green-500" key={key}>{label}</div> : null
                                            ))}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 relative">
                                            <div className="flex justify-center items-center gap-2">
                                                {/* Dropdown sửa trạng thái */}
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        onClick={() => setShowMenu(order._id)}
                                                        type="button"
                                                        className="inline-flex justify-center w-full rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        Sửa trạng thái
                                                    </button>

                                                    {showMenu === order._id && (
                                                        <div
                                                            className="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                            ref={(el) => {
                                                                menuRefs.current[order._id] = el;
                                                            }}
                                                        >
                                                            <div className="py-1">
                                                                {Object.entries(information.order_status).map(([key, label]) => (
                                                                    <button
                                                                        key={key}
                                                                        onClick={() =>
                                                                            updateOrderStatus({
                                                                                status: key,
                                                                                id: order._id,
                                                                            })
                                                                        }
                                                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                                                    >
                                                                        {label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Nút xóa */}
                                                <button
                                                    onClick={() => deleteOrder(order._id)}
                                                    type="button"
                                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between p-5">
                            <select
                                name="pageSize"
                                value={filters.pageSize}
                                onChange={(e) => {
                                    const newPageSize = Number(e.target.value);
                                    setFilters((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
                                }}
                                className="h-10 w-30 appearance-none rounded-lg border border-gray-300 px-4 py-1"
                            >
                                <option value="10">10 / page</option>
                                <option value="20">20 / page</option>
                                <option value="50">50 / page</option>
                                <option value="100">100 / page</option>
                            </select>

                            <div className="flex items-center gap-2 mt-4">
                                <button
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            page: Math.max(prev.page - 1, 1),
                                        }))
                                    }
                                    disabled={filters.page === 1}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    ← Trước
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                page: i + 1,
                                            }))
                                        }
                                        className={`px-3 py-1 border rounded ${filters.page === i + 1 ? "bg-blue-500 text-white" : ""
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            page: Math.min(prev.page + 1, totalPages),
                                        }))
                                    }
                                    disabled={filters.page === totalPages}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    Sau →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
