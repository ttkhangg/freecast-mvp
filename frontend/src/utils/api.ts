import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Gắn Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Bóc tách dữ liệu (Unwrapping Data)
api.interceptors.response.use(
  (response) => {
    // Backend NestJS chuẩn trả về: { data: T, statusCode: number, message: string }
    // Chúng ta chỉ cần lấy T để Frontend dùng cho gọn
    if (response.data && response.data.data !== undefined) {
      return response.data.data; 
    }
    // Trường hợp API trả về trực tiếp (VD: file upload) hoặc lỗi format
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          // Xử lý logout nếu cần, nhưng cẩn thận loop
          // localStorage.removeItem('token'); 
        }
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;