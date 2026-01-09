import axios from 'axios';
import Cookies from 'js-cookie';

// CẬP NHẬT: Tự động lấy URL từ biến môi trường (khi deploy) hoặc dùng localhost (khi dev)
// Biến NEXT_PUBLIC_API_URL sẽ được cấu hình trên Vercel sau này
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Nếu lỗi 401 (Unauthorized) thì xóa token để người dùng đăng nhập lại
    if (error.response?.status === 401) {
        Cookies.remove('token');
        // window.location.href = '/login'; // Có thể bỏ comment dòng này nếu muốn redirect ngay
    }
    return Promise.reject(error);
  }
);

export default api;