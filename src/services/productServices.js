import { toast } from "react-toastify";
import UserApi from "../lib/UserApi";

const handleError = (error, message = "Đã xảy ra lỗi") => {
    console.error(message, error);
    toast.error(message);
    throw error;
};

const productServices = {
    getAll: async (params = {}) => {
        try {
            const res = await UserApi.get("/products", { params });
            const { items, total, page, pageSize, totalPages } = res.data.data;

            return {
                data: items,
                total,
                page: page,
                pageSize,
                totalPages
            };

        } catch (error) {
            return handleError(error, "Lỗi khi lấy danh sách sản phẩm");
        }
    },

    getById: async (id) => {
        try {
            const res = await UserApi.get(`/products/${id}`);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi lấy thông tin sản phẩm");
        }
    },

    postProduct: async (credentials) => {
        try {
            const res = await UserApi.post("/products", credentials);
            toast.success("Tạo sản phẩm thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi tạo sản phẩm");
        }
    },

    update: async (credentials, id) => {
        try {
            const res = await UserApi.patch(`/products/${id}`, credentials);
            toast.success("Đổi thông tin thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi thông tin");
        }
    },

    delete: async (id) => {
        try {
            const res = await UserApi.delete(`/products/${id}`);
            toast.success("Xóa sản phẩm thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi xóa sản phẩm");
        }
    },
};

export default productServices;