'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCampaignDetail, useUpdateCampaign } from '@/hooks/useCampaigns';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// --- SCHEMA FIX (NỚI LỎNG) ---
const campaignSchema = z.object({
  title: z.string().min(5, 'Tiêu đề quá ngắn').max(100),
  // Giảm yêu cầu description xuống, hoặc cho phép optional nếu cần
  description: z.string().min(10, 'Mô tả cần chi tiết hơn (tối thiểu 10 ký tự)'), 
  requirements: z.string().optional(),
  // Budget: Cho phép 0 (nghĩa là Freecast/Thương lượng)
  budget: z.coerce.number().min(0, 'Ngân sách không được âm'), 
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Hạn nộp phải ở tương lai",
  }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function EditCampaignPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: campaign, isLoading: isLoadingData, error } = useCampaignDetail(id);
  const { mutate: updateCampaign, isPending } = useUpdateCampaign();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
  });

  useEffect(() => {
    if (campaign) {
      let formattedDeadline = '';
      if (campaign.deadline) {
        try {
          formattedDeadline = new Date(campaign.deadline).toISOString().split('T')[0];
        } catch (e) {
          console.error("Invalid date format:", campaign.deadline);
        }
      }

      reset({
        title: campaign.title || '',
        description: campaign.description || '',
        requirements: campaign.requirements || '',
        budget: campaign.budget || 0,
        deadline: formattedDeadline,
      });
    }
  }, [campaign, reset]);

  const onSubmit = (data: CampaignFormValues) => {
    updateCampaign({
      id,
      data: {
        ...data,
        budget: Number(data.budget),
        deadline: new Date(data.deadline).toISOString(),
      },
    });
  };

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !campaign) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center flex-col">
           <h2 className="text-xl font-bold text-gray-800">Không tìm thấy chiến dịch</h2>
           <Button variant="outline" onClick={() => router.push('/brand/campaigns')}>Quay lại</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <AuthGuard allowedRoles={['BRAND']}>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 border-b border-gray-200 pb-5">
            <h2 className="text-2xl font-bold leading-7 text-gray-900">
              Chỉnh sửa chiến dịch
            </h2>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div>
                <Label htmlFor="title">Tiêu đề chiến dịch</Label>
                <Input id="title" {...register('title')} className={errors.title ? "border-red-500" : ""} />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <textarea
                  id="description"
                  rows={5}
                  {...register('description')}
                  className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? "border-red-500" : "border-gray-300 focus-visible:ring-indigo-500"}`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div>
                <Label htmlFor="requirements">Yêu cầu ứng viên (Tùy chọn)</Label>
                <textarea
                  id="requirements"
                  rows={3}
                  {...register('requirements')}
                  className="flex w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="budget">Ngân sách (VND) - Để 0 nếu thương lượng</Label>
                  <Input id="budget" type="number" {...register('budget')} className={errors.budget ? "border-red-500" : ""} />
                  {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>}
                </div>

                <div>
                  <Label htmlFor="deadline">Hạn nộp hồ sơ</Label>
                  <Input id="deadline" type="date" {...register('deadline')} className={errors.deadline ? "border-red-500" : ""} />
                  {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline.message}</p>}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  <X className="mr-2 h-4 w-4" /> Hủy
                </Button>
                <Button type="submit" isLoading={isPending}>
                  <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}