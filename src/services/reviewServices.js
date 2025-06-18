import { toast } from "react-toastify";
import UserApi from "../lib/UserApi";

const handleError = (error, message = "Đã xảy ra lỗi") => {
    console.error(message, error);
    toast.error(message);
    throw error;
};

const reviewServices = {
    getAll: async (params = {}) => {
        try {
            const res = await UserApi.get(`/reviews/all/${params.site}`);
            const { items, total, page, pageSize, totalPages } = res.data.data;

            return {
                data: items,
                total,
                page: page,
                pageSize,
                totalPages
            };

        } catch (error) {
            return handleError(error, "Lỗi khi lấy danh sách đánh giá");
        }
    },

    getById: async (id) => {
        try {
            const res = await UserApi.get(`/reviews/${id}`);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi lấy thông tin đánh giá");
        }
    },

    postReview: async (credentials) => {
        try {
            const res = await UserApi.post("/reviews", credentials);
            toast.success("Tạo đánh giá thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi tạo đánh giá");
        }
    },

    updateReview: async (credentials, id) => {
        try {
            const res = await UserApi.patch(`/reviews/${id}`, credentials);
            toast.success("Đổi thông tin thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi thông tin");
        }
    },

    delete: async (id) => {
        try {
            const res = await UserApi.delete(`/reviews/${id}`);
            toast.success("Xóa đánh giá thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi xóa đánh giá");
        }
    },
};

export default reviewServices;