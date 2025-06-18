import { toast } from "react-toastify";
import UserApi from "../lib/UserApi";

const handleError = (error, message = "Đã xảy ra lỗi") => {
    console.error(message, error);
    toast.error(message);
    throw error;
};

const sessionPointServices = {
    getAll: async (params = {}) => {
        try {
            const res = await UserApi.get(`/sessions-point/all/${params.site}`);
            const { items, total, page, pageSize, totalPages } = res.data.data;

            return {
                data: items,
                total,
                page: page,
                pageSize,
                totalPages
            };

        } catch (error) {
            return handleError(error, "Lỗi khi lấy danh sách giai đoạn");
        }
    },

    getById: async (id) => {
        try {
            const res = await UserApi.get(`/sessions-point/${id}`);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi lấy thông tin giai đoạn");
        }
    },

    postSession: async (credentials) => {
        try {
            const res = await UserApi.post("/sessions-point", credentials);
            toast.success("Tạo giai đoạn thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi tạo giai đoạn");
        }
    },

    updateSession: async (credentials, id) => {
        try {
            const res = await UserApi.patch(`/sessions-point/${id}`, credentials);
            toast.success("Đổi thông tin thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi thông tin");
        }
    },

    delete: async (id) => {
        try {
            const res = await UserApi.delete(`/sessions-point/${id}`);
            toast.success("Xóa giai đoạn thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi xóa giai đoạn");
        }
    },
};

export default sessionPointServices;