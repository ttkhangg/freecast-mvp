'use client';

import { useState } from 'react';
// FIX: Sử dụng đường dẫn tương đối chính xác
import { useCreateCampaign } from '@/hooks/useCampaigns';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, ImagePlus, Trash, Gift, Banknote } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUploadImage } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

// 1. Schema Validation (Cho phép budget = 0)
const campaignSchema = z.object({
  title: z.string().min(5, 'Tiêu đề quá ngắn').max(100),
  description: z.string().min(20, 'Mô tả cần chi tiết hơn (tối thiểu 20 ký tự)'),
  requirements: z.string().optional(),
  // Budget không được âm, cho phép 0
  budget: z.coerce.number().min(0, 'Ngân sách không hợp lệ'),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Hạn nộp phải ở tương lai",
  }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function CreateCampaignPage() {
  const { mutate: createCampaign, isPending } = useCreateCampaign();
  const { mutateAsync: uploadImage } = useUploadImage();
  
  // State quản lý UI
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [budgetType, setBudgetType] = useState<'CASH' | 'BARTER'>('CASH'); // CASH = Tiền, BARTER = Sản phẩm

  const {
    register,
    handleSubmit,
    setValue,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Giới hạn tối đa 5 ảnh
    if (images.length + files.length > 5) {
        alert("Chỉ được upload tối đa 5 ảnh.");
        return;
    }

    setIsUploading(true);
    const newImages: string[] = [];

    try {
      // Upload tuần tự (để đơn giản) hoặc song song (Promise.all)
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      
      // Lọc các url null/undefined nếu có lỗi
      urls.forEach(url => { if(url) newImages.push(url); });
      
      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: CampaignFormValues) => {
    createCampaign({
      ...data,
      budget: budgetType === 'BARTER' ? 0 : Number(data.budget), // Nếu chọn Tặng sp thì set budget = 0
      deadline: new Date(data.deadline).toISOString(),
      images: images,
    });
  };

  return (
    <AuthGuard allowedRoles={['BRAND']}>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 border-b border-gray-200 pb-5">
            <h2 className="text-3xl font-bold leading-tight text-gray-900">
              Tạo chiến dịch mới
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Điền thông tin chi tiết và tải ảnh sản phẩm để thu hút KOL.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 w-full"></div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              
              {/* ALBUM ẢNH (Đưa lên đầu để nổi bật) */}
              <div>
                <Label className="text-base font-semibold text-gray-800">Hình ảnh sản phẩm (Tối đa 5 ảnh)</Label>
                <p className="text-sm text-gray-500 mb-4">Hình ảnh đẹp giúp tăng 300% tỷ lệ ứng tuyển của KOL.</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden group shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <label className={cn(
                        "flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-all duration-200",
                        isUploading ? "bg-gray-50 opacity-50 cursor-not-allowed" : "hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md"
                    )}>
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                           <span className="text-xs text-indigo-600 font-medium">Đang tải...</span>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-2">
                             <ImagePlus className="h-6 w-6" />
                          </div>
                          <span className="text-xs font-semibold text-gray-600">Thêm ảnh</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Cột Trái */}
                 <div className="space-y-6">
                    <div>
                        <Label htmlFor="title" className="font-semibold">Tiêu đề chiến dịch <span className="text-red-500">*</span></Label>
                        <Input
                        id="title"
                        placeholder="VD: Review BST Son Mùa Hè 2026"
                        {...register('title')}
                        className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="deadline" className="font-semibold">Hạn nộp hồ sơ <span className="text-red-500">*</span></Label>
                        <Input
                        id="deadline"
                        type="date"
                        {...register('deadline')}
                        className={errors.deadline ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline.message}</p>}
                    </div>
                    
                    {/* NGÂN SÁCH (TECH DEBT V2.4) */}
                    <div>
                        <Label className="font-semibold mb-3 block">Hình thức thù lao</Label>
                        <div className="flex gap-4 mb-4">
                            <div 
                                onClick={() => setBudgetType('CASH')}
                                className={cn(
                                    "flex-1 p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2",
                                    budgetType === 'CASH' ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-2 ring-indigo-600 ring-offset-2" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                )}
                            >
                                <Banknote size={20}/> Tiền mặt
                            </div>
                            <div 
                                onClick={() => { setBudgetType('BARTER'); setValue('budget', 0); }}
                                className={cn(
                                    "flex-1 p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2",
                                    budgetType === 'BARTER' ? "border-pink-600 bg-pink-50 text-pink-700 font-bold ring-2 ring-pink-600 ring-offset-2" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                )}
                            >
                                <Gift size={20}/> Tặng sản phẩm
                            </div>
                        </div>

                        {budgetType === 'CASH' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="budget">Ngân sách (VND) <span className="text-red-500">*</span></Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    placeholder="5000000"
                                    {...register('budget')}
                                    className={errors.budget ? "border-red-500" : ""}
                                />
                                {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>}
                            </div>
                        )}
                        {budgetType === 'BARTER' && (
                            <div className="bg-pink-50 text-pink-800 p-4 rounded-lg text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2 border border-pink-100">
                                <Gift className="shrink-0 mt-0.5" size={16}/>
                                <span>Bạn sẽ gửi tặng sản phẩm cho KOL để đổi lấy bài review. Vui lòng mô tả kỹ giá trị sản phẩm trong phần mô tả.</span>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Cột Phải */}
                 <div className="space-y-6">
                    <div>
                        <Label htmlFor="description" className="font-semibold">Mô tả chi tiết <span className="text-red-500">*</span></Label>
                        <textarea
                        id="description"
                        rows={8}
                        placeholder="Mô tả về sản phẩm, kịch bản mong muốn, các hashtag cần có..."
                        {...register('description')}
                        className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${errors.description ? "border-red-500" : "border-gray-300 focus-visible:ring-indigo-500"}`}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="requirements" className="font-semibold">Yêu cầu ứng viên</Label>
                        <textarea
                        id="requirements"
                        rows={4}
                        placeholder="VD: Nữ, 18-25 tuổi, phong cách năng động, kênh TikTok > 10k follow..."
                        {...register('requirements')}
                        className="flex w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        />
                    </div>
                 </div>
              </div>

              <div className="pt-6 flex justify-end gap-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => window.history.back()}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <X className="mr-2 h-5 w-5" /> Hủy bỏ
                </Button>
                
                <Button type="submit" isLoading={isPending || isUploading} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                  <Save className="mr-2 h-5 w-5" /> Đăng tin ngay
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}