import { useMutation } from '@tanstack/react-query';
import api from '@/utils/api'; // Import instance axios xịn xò
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const loginStore = useAuthStore((state) => state.login);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: any) => {
      // Gọi API login của Backend
      return await api.post('/auth/login', data);
    },
    onSuccess: (data: any) => {
      // data ở đây là response từ backend (đã qua interceptor lấy .data)
      // data: { user: {...}, token: "..." }
      
      loginStore(data.user, data.token);
      toast.success('Đăng nhập thành công! Chào mừng trở lại.');
      
      // Chuyển hướng dựa trên Role
      if (data.user.role === 'ADMIN') router.push('/admin');
      else router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/auth/register', data);
    },
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Đăng ký thất bại.');
    },
  });
};