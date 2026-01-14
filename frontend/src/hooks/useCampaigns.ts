import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Campaign, CampaignStatus } from '@/types';

export interface CreateCampaignDto {
  title: string;
  description: string;
  requirements?: string;
  budget: number;
  deadline: string;
  status?: CampaignStatus;
}

// 1. Hook lấy chi tiết
export const useCampaignDetail = (id: string) => {
  return useQuery<Campaign & { applications: any[] }>({
    queryKey: ['campaign', id],
    queryFn: async () => {
      // api.get giờ đây trả về đúng object Campaign (do interceptor đã bóc vỏ)
      return await api.get(`/campaigns/${id}`);
    },
    enabled: !!id,
    retry: 1,
  });
};

// 2. Hook lấy chiến dịch của tôi
export const useMyCampaigns = () => {
  return useQuery<Campaign[]>({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      return await api.get('/campaigns/brand/my-campaigns');
    },
  });
};

// 3. Tạo chiến dịch
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateCampaignDto) => {
      return await api.post('/campaigns', data);
    },
    onSuccess: () => {
      toast.success('Chiến dịch đã được tạo thành công!');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      router.push('/brand/campaigns');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Lỗi khi tạo chiến dịch');
    },
  });
};

// 4. Update chiến dịch
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCampaignDto> }) => {
      return await api.patch(`/campaigns/${id}`, data);
    },
    onSuccess: (data: any) => {
      toast.success('Cập nhật thành công!');
      queryClient.invalidateQueries({ queryKey: ['campaign'] }); 
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      router.back();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Lỗi khi cập nhật');
    },
  });
};

// Các hook khác giữ nguyên (Apply, Cancel, Approve, Reject)
export const useApplyCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => {
      return await api.post(`/campaigns/${campaignId}/apply`);
    },
    onSuccess: () => {
      toast.success('Ứng tuyển thành công!');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Lỗi ứng tuyển');
    },
  });
};

export const useCancelApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => {
      return await api.delete(`/campaigns/${campaignId}/apply`);
    },
    onSuccess: () => {
      toast.info('Đã hủy ứng tuyển.');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể hủy đơn');
    },
  });
};

export const useApproveApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: string) => {
      return await api.patch(`/campaigns/application/${applicationId}/approve`);
    },
    onSuccess: () => {
      toast.success('Đã duyệt ứng viên!');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Lỗi xử lý');
    },
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: string) => {
      return await api.patch(`/campaigns/application/${applicationId}/reject`);
    },
    onSuccess: () => {
      toast.info('Đã từ chối ứng viên.');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Lỗi xử lý');
    },
  });
};