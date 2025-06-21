import { toast } from "react-toastify";
import UserApi from "../lib/UserApi";

const handleError = (error, message = "Đã xảy ra lỗi") => {
    console.error(message, error);
    toast.error(message);
    throw error;
};

const settingServices = {
    getBySite: async (id) => {
        try {
            const res = await UserApi.get(`/settings/${id}`);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi lấy thông tin thiết lập website");
        }
    },

    postSetting: async (credentials) => {
        try {
            const res = await UserApi.post("/settings", credentials);
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi tạo thiết lập website");
        }
    },

    update: async (credentials, site) => {
        try {
            const res = await UserApi.patch(`/settings/${site}`, credentials);
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi thông tin");
        }
    },

    delete: async (site) => {
        try {
            const res = await UserApi.delete(`/settings/${site}`);
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            console.error("Lỗi xóa:", error.response?.data || error.message);
            return handleError(error, "Lỗi khi xóa thiết lập website");
        }
    },
};

export default settingServices;