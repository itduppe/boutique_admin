import { jwtDecode } from "jwt-decode";

function getDecodedToken() {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

function logoutHelper() {
  localStorage.removeItem("token");
  localStorage.removeItem("site-system");
}

export { getDecodedToken, logoutHelper };