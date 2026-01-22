'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useUploadImage, useUpdateProfile } from '@/hooks/useProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, Save, User as UserIcon, Link as LinkIcon, Phone, FileText, MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';

// Schema Validation - Updated Address
const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên quá ngắn').max(50),
  bio: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(), // Tech debt #2
  socialLink: z.union([z.string().url('Link không hợp lệ'), z.literal('')]).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(user?.avatar || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      address: user?.address || '',
      socialLink: user?.socialLink || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        bio: user.bio || '',
        phone: user.phone || '',
        address: user.address || '',
        socialLink: user.socialLink || '',
      });
      setPreviewAvatar(user.avatar || null);
    }
  }, [user, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewAvatar(objectUrl);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    let avatarUrl = user?.avatar;

    if (selectedFile) {
      try {
        avatarUrl = await uploadImage(selectedFile);
      } catch (error) {
        return; 
      }
    }

    const payload = {
      ...data,
      avatar: avatarUrl,
      // Clean undefined/empty strings
      socialLink: data.socialLink || undefined,
      bio: data.bio || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
    };

    updateProfile(payload);
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h2>
            <p className="text-muted-foreground mt-1">
              Quản lý thông tin hiển thị và liên lạc để tăng độ uy tín.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Cột trái: Avatar & Quick Stats */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                   <div className="relative group">
                      <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-lg ring-2 ring-border">
                        {previewAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={previewAvatar} alt="Avatar" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="h-full w-full bg-secondary flex items-center justify-center">
                             <UserIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all rounded-full cursor-pointer backdrop-blur-sm"
                      >
                        <Camera className="h-8 w-8" />
                      </label>
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                   </div>
                   
                   <div className="mt-4">
                      <h3 className="font-bold text-lg">{user?.fullName}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role.toLowerCase()}</p>
                   </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                      <CardTitle className="text-base text-primary">Trạng thái tài khoản</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="font-medium">Đang hoạt động</span>
                      </div>
                  </CardContent>
              </Card>
            </div>

            {/* Cột phải: Form thông tin */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>Các thông tin này sẽ được dùng cho hợp đồng booking.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Họ và tên / Tên Doanh nghiệp</Label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="fullName" className="pl-9" {...register('fullName')} />
                    </div>
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" className="pl-9" {...register('phone')} placeholder="0912..." />
                        </div>
                      </div>
                      
                      {/* Tech Debt #2: Add Address */}
                      <div className="grid gap-2">
                        <Label htmlFor="address">Địa chỉ (Nhận hàng/Gửi hàng)</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="address" className="pl-9" {...register('address')} placeholder="123 ABC..." />
                        </div>
                      </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Giới thiệu (Bio)</Label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <textarea
                            id="bio"
                            rows={4}
                            {...register('bio')}
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Hãy viết gì đó ấn tượng về bạn..."
                        />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mạng xã hội</CardTitle>
                  <CardDescription>Link kênh chính của bạn (TikTok/YouTube/Facebook).</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="grid gap-2">
                    <Label htmlFor="socialLink">Link Channel</Label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="socialLink" 
                            className="pl-9"
                            {...register('socialLink')} 
                            placeholder="https://tiktok.com/@username"
                        />
                    </div>
                    {errors.socialLink && <p className="text-xs text-destructive">{errors.socialLink.message}</p>}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 py-4 flex justify-end">
                    <Button type="submit" disabled={isUploading || isUpdating} isLoading={isUploading || isUpdating} size="lg">
                        <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                    </Button>
                </CardFooter>
              </Card>
            </div>

          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}