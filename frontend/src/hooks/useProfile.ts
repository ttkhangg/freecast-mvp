import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response: any = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.url as string;
    },
    onError: (error: any) => {
      console.error('Upload Failed Detailed:', error);
      const msg = error?.message || (typeof error === 'string' ? error : 'Lỗi upload ảnh');
      toast.error(msg);
    },
  });
};

export const useUpdateProfile = () => {
  const updateUser = useAuthStore((state) => state.updateUser); 
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      // Backend trả về object User đã update
      // api.patch đã qua interceptor, trả về data.data nếu có
      return await api.patch('/auth/profile', data);
    },
    onSuccess: (updatedUser: any) => {
      // Kiểm tra kỹ dữ liệu trả về
      console.log('Update Success Data:', updatedUser);

      if (updatedUser && updatedUser.id) {
          updateUser(updatedUser);
          queryClient.invalidateQueries({ queryKey: ['me'] });
          toast.success('Cập nhật hồ sơ thành công!');
      } else {
          console.warn('Update returned invalid data', updatedUser);
          toast.warning('Cập nhật thành công nhưng dữ liệu trả về không đầy đủ.');
      }
    },
    onError: (error: any) => {
      // Log toàn bộ error object để debug
      console.error('Update Profile Failed Full Error:', JSON.stringify(error, null, 2)); 
      console.error('Update Profile Failed Raw:', error);

      let errorMsg = 'Lỗi khi cập nhật hồ sơ';

      if (error?.statusCode === 401) {
        errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
        // Optional: Redirect to login
        // router.push('/login'); 
      } else if (error?.message) {
        if (Array.isArray(error.message)) {
            errorMsg = error.message[0]; // Lấy lỗi đầu tiên nếu là mảng validation
        } else {
            errorMsg = error.message;
        }
      } else if (typeof error === 'string') {
          errorMsg = error;
      }

      toast.error(errorMsg);
    },
  });
};