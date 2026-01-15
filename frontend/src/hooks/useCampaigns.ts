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
}

// ... (Giữ các hook cũ useCampaignDetail, useMyCampaigns...) ...
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

// --- NEW HOOK: Lấy danh sách việc làm của KOL ---
export const useMyJobs = () => {
  return useQuery<any[]>({ // Trả về list Application
    queryKey: ['my-jobs'],
    queryFn: async () => await api.get('/campaigns/kol/my-jobs'),
  });
};

// ... (Giữ nguyên các hook mutation: create, update, apply, cancel...) ...
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

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCampaignDto> }) => await api.patch(`/campaigns/${id}`, data),
    onSuccess: (data: any) => {
      toast.success('Cập nhật thành công!');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      router.back();
    },
    onError: (e: any) => toast.error(e.message || 'Lỗi'),
  });
};

export const useApplyCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: string) => await api.post(`/campaigns/${campaignId}/apply`),
    onSuccess: () => {
      toast.success('Ứng tuyển thành công!');
      queryClient.invalidateQueries({ queryKey: ['campaign'] });
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] }); // Cập nhật list việc làm
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
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] }); // Cập nhật list việc làm
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