'use client';

import { useCreateCampaign } from '@/hooks/useCampaigns';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 1. Định nghĩa Schema Validation với Zod (Luật validation)
const campaignSchema = z.object({
  title: z.string().min(5, 'Tiêu đề quá ngắn (tối thiểu 5 ký tự)').max(100, 'Tiêu đề quá dài'),
  description: z.string().min(20, 'Mô tả cần chi tiết hơn (tối thiểu 20 ký tự)'),
  requirements: z.string().optional(),
  // Sử dụng coerce để tự động chuyển string từ input -> number
  budget: z.coerce.number().min(100000, 'Ngân sách tối thiểu 100,000 VND'),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Hạn nộp hồ sơ phải ở tương lai",
  }),
});

// Infer type từ schema (Tự động tạo interface từ luật trên)
type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function CreateCampaignPage() {
  const { mutate: createCampaign, isPending } = useCreateCampaign();

  // 2. Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      budget: 0,
      deadline: '',
    },
  });

  // 3. Xử lý Submit
  const onSubmit = (data: CampaignFormValues) => {
    // Gọi API thông qua Hook
    createCampaign({
      ...data,
      budget: Number(data.budget), // Đảm bảo chắc chắn là số
      deadline: new Date(data.deadline).toISOString(), // Chuyển đổi ngày
    });
  };

  return (
    <AuthGuard allowedRoles={['BRAND']}>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 border-b border-gray-200 pb-5">
            <h2 className="text-2xl font-bold leading-7 text-gray-900">
              Tạo chiến dịch mới
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Điền thông tin chi tiết để tìm kiếm KOL phù hợp nhất.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Title Input */}
              <div>
                <Label htmlFor="title">Tiêu đề chiến dịch <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  placeholder="VD: Review bộ sưu tập son mới hè 2026"
                  {...register('title')}
                  className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              {/* Description Input */}
              <div>
                <Label htmlFor="description">Mô tả chi tiết <span className="text-red-500">*</span></Label>
                <textarea
                  id="description"
                  rows={5}
                  placeholder="Mô tả về sản phẩm, kịch bản mong muốn..."
                  {...register('description')}
                  className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus-visible:ring-indigo-500"}`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>

              {/* Requirements Input */}
              <div>
                <Label htmlFor="requirements">Yêu cầu ứng viên</Label>
                <textarea
                  id="requirements"
                  rows={3}
                  placeholder="VD: Nữ, 18-25 tuổi, phong cách năng động..."
                  {...register('requirements')}
                  className="flex w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Budget Input */}
                <div>
                  <Label htmlFor="budget">Ngân sách (VND) <span className="text-red-500">*</span></Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="5000000"
                    {...register('budget')}
                    className={errors.budget ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>}
                </div>

                {/* Deadline Input */}
                <div>
                  <Label htmlFor="deadline">Hạn nộp hồ sơ <span className="text-red-500">*</span></Label>
                  <Input
                    id="deadline"
                    type="date"
                    {...register('deadline')}
                    className={errors.deadline ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline.message}</p>}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  <X className="mr-2 h-4 w-4" /> Hủy
                </Button>
                
                <Button type="submit" isLoading={isPending}>
                  <Save className="mr-2 h-4 w-4" /> Đăng tin ngay
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}