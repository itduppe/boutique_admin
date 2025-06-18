import axios from 'axios';

const UserApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-quatangv2-f168.attcloud.work/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');

  if (token) {
    UserApi.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default UserApi;