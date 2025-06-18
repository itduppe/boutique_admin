import { toast } from "react-toastify";
import UserApi from '../lib/UserApi';

const authServices = {
  login: async (credentials) => {
    try {
      const res = await UserApi.post('/auth/login', credentials);
      return res.data;
    } catch (error) {
      console.error('Lỗi login:', error);
      throw error;
    }
  },
};

export default authServices;