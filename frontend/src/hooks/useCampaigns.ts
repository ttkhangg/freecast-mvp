import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Campaign, CampaignStatus } from '@/types';

// ... (Giữ các interface cũ) ...
export interface CreateCampaignDto {
  title: string;
  description: string;
  requirements?: string;
  budget: number;
  deadline: string;
  status?: CampaignStatus;
  images?: string[];
}

// ... (Giữ các hook Query cũ useCampaignDetail, useMyCampaigns...) ...
export const useCampaignDetail = (id: string) => {
  return useQuery<Campaign & { applications: any[] }>({
    queryKey: ['campaign', id],
    queryFn: async () => await api.get(`/campaigns/${id}`),
    enabled: !!id,
  });
};

export const useMyCampaigns = () => {
  return useQuery<Campaign[]>({
    queryKey: ['my-campaigns'],
    queryFn: async () => await api.get('/campaigns/brand/my-campaigns'),
  });
};

export const useMyJobs = () => {
  return useQuery<any[]>({
    queryKey: ['my-jobs'],
    queryFn: async () => await api.get('/campaigns/kol/my-jobs'),
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: CreateCampaignDto) => await api.post('/campaigns', data),
    onSuccess: () => {
      toast.success('Chiến dịch đã được tạo thành công!');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      router.push('/brand/campaigns');
    },
    onError: (e: any) => toast.error(e.message || 'Lỗi'),
  });
};

// TECH DEBT #1: Update Campaign
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCampaignDto> }) => await api.patch(`/campaigns/${id}`, data),
    onSuccess: (data: any) => {
      toast.success('Cập nhật thành công!');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      // Không cần back() bắt buộc, để user tự quyết định hoặc stay
    },
    onError: (e: any) => toast.error(e.message || 'Lỗi'),
  });
};

// TECH DEBT #1: Delete Campaign
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (id: string) => await api.delete(`/campaigns/${id}`),
    onSuccess: () => {
      toast.success('Đã xóa chiến dịch.');
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      router.push('/brand/campaigns');
    },
    onError: (e: any) => toast.error(e.message || 'Không thể xóa (Có thể đã có ứng viên)'),
  });
};

// TECH DEBT #1: Stop/Pause Campaign (Dùng chung update)
// Chúng ta có thể tái sử dụng useUpdateCampaign, chỉ cần truyền data: { status: 'CLOSED' }

export const useApplyCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => await api.post(`/campaigns/${campaignId}/apply`),
    onSuccess: () => {
      toast.success('Ứng tuyển thành công! Vui lòng chờ Brand duyệt.');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
    onError: (e: any) => toast.error(e.message || 'Lỗi'),
  });
};

export const useCancelApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => await api.delete(`/campaigns/${campaignId}/apply`),
    onSuccess: () => {
      toast.info('Đã hủy ứng tuyển.');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
    },
    onError: (e: any) => toast.error(e.message || 'Lỗi'),
  });
};

export const useApproveApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: string) => await api.patch(`/campaigns/application/${applicationId}/approve`),
    onSuccess: () => {
      toast.success('Đã duyệt ứng viên!');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    },
    onError: (e: any) => toast.error(e.message || 'Lỗi'),
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: string) => await api.patch(`/campaigns/application/${applicationId}/reject`),
    onSuccess: () => {
      toast.info('Đã từ chối ứng viên.');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
    },
    onError: (e: any) => toast.error(e.message || 'Lỗi'),
  });
};