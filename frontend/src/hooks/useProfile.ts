import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types';

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
      toast.error('Lỗi upload ảnh: ' + (error.message || 'Không xác định'));
    },
  });
};

export const useUpdateProfile = () => {
  // Lấy hàm updateUser từ store
  const updateUser = useAuthStore((state) => state.updateUser); 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      // Backend trả về object User đã update
      return await api.patch('/auth/profile', data);
    },
    onSuccess: (updatedUser: any) => { // Dùng any tạm thời để tránh lỗi type deep
      // 1. Cập nhật Store ngay lập tức
      // Đảm bảo updatedUser có dữ liệu chuẩn từ Backend
      if (updatedUser && updatedUser.id) {
          updateUser(updatedUser);
      }
      
      // 2. Refresh cache
      queryClient.invalidateQueries({ queryKey: ['me'] });

      // 3. Thông báo sau cùng
      toast.success('Cập nhật hồ sơ thành công!');
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || 'Lỗi khi cập nhật hồ sơ');
    },
  });
};