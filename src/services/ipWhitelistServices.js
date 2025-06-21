import { toast } from "react-toastify";
import UserApi from "../lib/UserApi";

const handleError = (error, message = "Đã xảy ra lỗi") => {
    console.error(message, error);
    toast.error(message);
    throw error;
};

const ipWhitelistServices = {
    getIpWhitelist: async (params = {}) => {
        try {
            const res = await UserApi.get("/ip_whitelist", { params });
            const { items, total, message} = res.data.data;

            return {
                data: items,
                total,
                message
            };

        } catch (error) {
            return handleError(error, "Lỗi khi lấy danh Ip Whitelist");
        }
    },

    postIpWhitelist: async (credentials) => {
        const now = new Date();

        try {
            const res = await UserApi.post("/ip_whitelist", credentials);
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi tạo Ip Whitelist");
        }
    },

    changeIpWhitelist: async (credentials, id) => {
        try {
            const res = await UserApi.patch(`/ip_whitelist/${id}`, credentials);
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi mật khẩu người dùng");
        }
    },

    deleteIpWhitelist: async (id) => {
        try {
            const res = await UserApi.delete(`/ip_whitelist/${id}`);
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi xóa Ip Whitelist");
        }
    },
};

export default ipWhitelistServices;