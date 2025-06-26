import axios from 'axios';
import Cookies from 'js-cookie';

const UserApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-quatangv2-f168.attcloud.work/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

UserApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default UserApi;