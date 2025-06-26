import { toast } from "react-toastify";
import UserApi from '../lib/UserApi';

const authServices = {
  login: async (credentials) => {
    try {
      const res = await UserApi.post('/auth/login', credentials);

      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
};

export default authServices;