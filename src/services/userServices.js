import { toast } from "react-toastify";
import UserApi from "../lib/UserApi";

const handleError = (error, message = "Đã xảy ra lỗi") => {
    console.error(message, error);
    toast.error(message);
    throw error;
};

const userServices = {
    getUser: async (params = {}) => {
        try {
            const res = await UserApi.get("/users", { params });
            const { items, total, page, pageSize, totalPages } = res.data.data;

            return {
                users: items,
                total,
                page: page,
                pageSize,
                totalPages
            };

        } catch (error) {
            return handleError(error, "Lỗi khi lấy danh sách người dùng");
        }
    },

    getByIdUser: async (id) => {
        try {
            const res = await UserApi.get(`/users/${id}`);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi lấy thông tin người dùng");
        }
    },

    postUser: async (credentials) => {
        try {
            const res = await UserApi.post("/users", credentials);
            toast.success("Tạo người dùng thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi tạo người dùng");
        }
    },

    changePasswordUser: async (form, id) => {
        try {
            let credentials = {
                oldPassword: form.oldPassword,
                newPassword: form.password
            };

            const res = await UserApi.patch(`/users/update-password/${id}`, credentials);
            toast.success("Đổi mật khẩu thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi mật khẩu người dùng");
        }
    },

    changeUserStatus: async (id) => {
        try {
            const res = await UserApi.patch(`/users/update-status/${id}`);
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi đổi status người dùng");
        }
    },

    changeUserRole: async (id, role) => {
        try {
            const res = await UserApi.patch(`/users/update-role?id=${id}&role=${role}`);
            toast.success(res.data.message);
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi quyền người dùng");
        }
    },

    deleteUser: async (id) => {
        try {
            const res = await UserApi.delete(`/users/${id}`);
            toast.success("Xóa người dùng thành công!");
            return res.data;
        } catch (error) {
            return handleError(error, "Lỗi khi xóa người dùng");
        }
    },
};

export default userServices;