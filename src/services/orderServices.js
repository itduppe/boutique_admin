import { toast } from "react-toastify";
import UserApi from "../lib/UserApi";

const handleError = (error, message = "Đã xảy ra lỗi") => {
    console.error(message, error);
    toast.error(message);
    throw error;
};

const orderServices = {
    getAll: async (params = {}) => {
        try {
            const res = await UserApi.get("/orders", { params });
            const { items, statusCount, total, page, pageSize, totalPages } = res.data.data;

            return {
                data: items,
                statusCount: statusCount,
                total,
                page: page,
                pageSize,
                totalPages
            };

        } catch (error) {
            return handleError(error, "Lỗi khi lấy danh sách đơn hàng");
        }
    },

    getExport: async (params = {}) => {
        try {
            const res = await UserApi.get("/orders/export", {
                params,
                responseType: 'blob',
            });
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi xuất file Excel");
        }
    },

    updateStatusById: async (credentials) => {
        try {
            const res = await UserApi.patch(`/orders/update-status/`, credentials);
            toast.success("Đổi thông tin thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi thông tin");
        }
    },

    deleteList: async () => {
        try {
            const res = await UserApi.post("/orders/delete-many");
            toast.success("Xóa danh sách đơn hàng thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi xóa đơn hàng");
        }
    },

    delete: async (id) => {
        try {
            const res = await UserApi.delete(`/orders/${id}`);
            toast.success("Xóa đơn hàng thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi xóa đơn hàng");
        }
    },
};

export default orderServices;