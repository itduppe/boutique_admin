import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

function getDecodedToken() {
  if (typeof window === "undefined") return null;

  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch {
    return null;
  }
}

function logoutHelper() {
  Cookies.remove("token");
  localStorage.removeItem("site-system");
}

export { getDecodedToken, logoutHelper };
