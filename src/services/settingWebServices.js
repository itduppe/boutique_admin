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
            toast.success("Tạo thiết lập website thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi tạo thiết lập website");
        }
    },

    update: async (credentials, id) => {
        try {
            const res = await UserApi.patch(`/settings/${id}`, credentials);
            toast.success("Đổi thông tin thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi thông tin");
        }
    },

    delete: async (id) => {
        try {
            const res = await UserApi.delete(`/settings/${id}`);
            toast.success("Xóa thiết lập website thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi xóa thiết lập website");
        }
    },
};

export default settingServices;