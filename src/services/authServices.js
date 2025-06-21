import { toast } from "react-toastify";
import UserApi from '../lib/UserApi';

const authServices = {
  login: async (credentials) => {
    try {
      const res = await UserApi.post('/auth/login', credentials);

      return res.data;
    } catch (error) {
      toast.error("Vui lòng liên hệ quản trị viên Website");
      throw error;
    }
  },
};

export default authServices;