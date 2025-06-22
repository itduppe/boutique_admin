import axios from 'axios';
import Cookies from 'js-cookie';

const UserApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-quatangv2-f168.attcloud.work/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  const token = Cookies.get("token");

  if (token) {
    UserApi.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default UserApi;