'use client';

import { useState } from 'react';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Save, X, ImagePlus, Trash, Gift, Banknote, Sparkles, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUploadImage } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const campaignSchema = z.object({
  title: z.string().min(5, 'Tiêu đề quá ngắn').max(100),
  description: z.string().min(20, 'Mô tả cần chi tiết hơn (tối thiểu 20 ký tự)'),
  requirements: z.string().optional(),
  budget: z.coerce.number().min(0, 'Ngân sách không hợp lệ'),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Hạn nộp phải ở tương lai",
  }),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function CreateCampaignPage() {
  const { mutate: createCampaign, isPending } = useCreateCampaign();
  const { mutateAsync: uploadImage } = useUploadImage();
  const router = useRouter();
  
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [budgetType, setBudgetType] = useState<'CASH' | 'BARTER'>('CASH');

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
    if (images.length + files.length > 5) return alert("Chỉ được upload tối đa 5 ảnh.");

    setIsUploading(true);
    const newImages: string[] = [];

    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
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
      budget: budgetType === 'BARTER' ? 0 : Number(data.budget),
      deadline: new Date(data.deadline).toISOString(),
      images: images,
    });
  };

  return (
    <AuthGuard allowedRoles={['BRAND']}>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
          
          <div className="flex items-center justify-between">
            <div>
               <h2 className="text-3xl font-bold tracking-tight">Tạo chiến dịch mới</h2>
               <p className="text-muted-foreground mt-1">Thu hút hàng ngàn KOL tiềm năng chỉ với vài bước.</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Sparkles className="h-6 w-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* SECTION 1: VISUALS */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">1. Hình ảnh sản phẩm</CardTitle>
                    <CardDescription>Hình ảnh đẹp mắt là yếu tố số 1 để KOL quyết định ứng tuyển.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg border bg-muted overflow-hidden group shadow-sm transition-all hover:ring-2 hover:ring-primary/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                            <Trash size={14} />
                        </button>
                        </div>
                    ))}
                    
                    {images.length < 5 && (
                        <label className={cn(
                            "flex flex-col items-center justify-center aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer transition-all bg-muted/10",
                            isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/20 hover:border-primary/50"
                        )}>
                        {isUploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : (
                            <>
                                <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-xs font-medium text-muted-foreground">Thêm ảnh</span>
                            </>
                        )}
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                    )}
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 2: BASIC INFO */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">2. Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="font-semibold">Tiêu đề chiến dịch <span className="text-destructive">*</span></Label>
                        <Input id="title" placeholder="VD: Review BST Son Mùa Hè 2026" {...register('title')} />
                        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description" className="font-semibold">Mô tả công việc <span className="text-destructive">*</span></Label>
                        <textarea
                            id="description"
                            rows={6}
                            placeholder="Mô tả về sản phẩm, kịch bản mong muốn, các hashtag cần có..."
                            {...register('description')}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="requirements" className="font-semibold">Yêu cầu ứng viên</Label>
                        <textarea
                            id="requirements"
                            rows={3}
                            placeholder="VD: Nữ, 18-25 tuổi, phong cách năng động..."
                            {...register('requirements')}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 3: BUDGET */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">3. Ngân sách & Thời gian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label>Hình thức trả thưởng</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div 
                                    onClick={() => setBudgetType('CASH')}
                                    className={cn(
                                        "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted/50",
                                        budgetType === 'CASH' ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" : "text-muted-foreground"
                                    )}
                                >
                                    <Banknote size={24}/> <span className="text-sm font-semibold">Tiền mặt</span>
                                </div>
                                <div 
                                    onClick={() => { setBudgetType('BARTER'); setValue('budget', 0); }}
                                    className={cn(
                                        "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted/50",
                                        budgetType === 'BARTER' ? "border-pink-500 bg-pink-50 text-pink-600 ring-1 ring-pink-500" : "text-muted-foreground"
                                    )}
                                >
                                    <Gift size={24}/> <span className="text-sm font-semibold">Sản phẩm</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Hạn nộp hồ sơ <span className="text-destructive">*</span></Label>
                            <Input id="deadline" type="date" {...register('deadline')} />
                            {errors.deadline && <p className="text-xs text-destructive">{errors.deadline.message}</p>}
                        </div>
                    </div>

                    {budgetType === 'CASH' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <Label htmlFor="budget">Ngân sách dự kiến (VNĐ)</Label>
                            <div className="relative mt-2">
                                <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">₫</span>
                                <Input id="budget" type="number" className="pl-8 font-bold text-lg" {...register('budget')} />
                            </div>
                            {errors.budget && <p className="text-xs text-destructive mt-1">{errors.budget.message}</p>}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-muted/20 border-t py-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Hủy bỏ</Button>
                    <Button type="submit" disabled={isPending || isUploading} isLoading={isPending || isUploading} className="min-w-[150px]">
                        <Save className="mr-2 h-4 w-4" /> Đăng chiến dịch
                    </Button>
                </CardFooter>
            </Card>

          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}