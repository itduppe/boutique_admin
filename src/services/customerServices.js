import { toast } from "react-toastify";
import UserApi from "../lib/UserApi";

const handleError = (error, message = "Đã xảy ra lỗi") => {
    console.error(message, error);
    toast.error(message);
    throw error;
};

const customerServices = {
    getAll: async (params = {}) => {
        try {
            const res = await UserApi.get("/customers", { params });
            const { items, total, page, pageSize, totalPages } = res.data.data;

            return {
                data: items,
                total,
                page: page,
                pageSize,
                totalPages
            };

        } catch (error) {
            return handleError(error, "Lỗi khi lấy danh sách khách hàng");
        }
    },

    updateStatus: async (username, site) => {
        try {
            const res = await UserApi.patch(`/customers/update-status?username=${username}&site=${site}`);
            toast.success("Đổi mật khẩu thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi mật khẩu người dùng");
        }
    },

    findHistories: async (username, site) => {
        try {
            const res = await UserApi.patch(`/customers/find-histories?username=${username}&site=${site}`);
            toast.success("Đổi mật khẩu thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi mật khẩu người dùng");
        }
    }
};

export default customerServices;