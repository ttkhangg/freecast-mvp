'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadImage, useUpdateProfile } from '@/hooks/useProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, Save, Loader2, User as UserIcon } from 'lucide-react';

// Schema Validation
const profileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên quá ngắn').max(50),
  bio: z.string().optional(),
  phone: z.string().optional(),
  // Cho phép chuỗi rỗng HOẶC url hợp lệ
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
      socialLink: user?.socialLink || '',
    },
  });

  // Reset form khi user load xong
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        bio: user.bio || '',
        phone: user.phone || '',
        socialLink: user.socialLink || '',
      });
      setPreviewAvatar(user.avatar || null);
    }
  }, [user, reset]);

  // Xử lý chọn ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewAvatar(objectUrl);
    }
  };

  // Xử lý Submit
  const onSubmit = async (data: ProfileFormValues) => {
    let avatarUrl = user?.avatar;

    // 1. Upload ảnh (nếu có chọn)
    if (selectedFile) {
      try {
        avatarUrl = await uploadImage(selectedFile);
      } catch (error) {
        // Lỗi đã được hook xử lý toast
        return; 
      }
    }

    // 2. Chuẩn bị data (Biến chuỗi rỗng thành undefined để backend không validate sai)
    const payload = {
      ...data,
      avatar: avatarUrl,
      socialLink: data.socialLink === '' ? undefined : data.socialLink,
      bio: data.bio === '' ? undefined : data.bio,
      phone: data.phone === '' ? undefined : data.phone,
    };

    // 3. Gọi API
    updateProfile(payload);
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 border-b border-gray-200 pb-5">
            <h2 className="text-2xl font-bold leading-7 text-gray-900">
              Hồ sơ cá nhân
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Quản lý thông tin hiển thị của bạn trên nền tảng FreeCast.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
              
              {/* Avatar Section */}
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative group">
                  <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-200 flex items-center justify-center">
                    {previewAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewAvatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
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
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900">Ảnh đại diện</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    Cho phép JPG, GIF hoặc PNG. Tối đa 5MB.
                  </p>
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <label htmlFor="avatar-upload">
                      <span className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        Thay đổi
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="border-t border-gray-100 pt-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                
                <div className="sm:col-span-3">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input 
                    id="fullName" 
                    {...register('fullName')} 
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input 
                    id="phone" 
                    {...register('phone')} 
                    placeholder="0912..."
                  />
                </div>

                <div className="sm:col-span-6">
                  <Label htmlFor="bio">Giới thiệu bản thân (Bio)</Label>
                  <textarea
                    id="bio"
                    rows={4}
                    {...register('bio')}
                    className="flex w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    placeholder="Hãy viết gì đó ấn tượng về bạn..."
                  />
                </div>

                <div className="sm:col-span-6">
                  <Label htmlFor="socialLink">Link Mạng xã hội</Label>
                  <Input 
                    id="socialLink" 
                    {...register('socialLink')} 
                    placeholder="https://facebook.com/..."
                    className={errors.socialLink ? "border-red-500" : ""}
                  />
                  {errors.socialLink && <p className="mt-1 text-sm text-red-500">{errors.socialLink.message}</p>}
                </div>
              </div>

              <div className="pt-5 border-t border-gray-100 flex justify-end">
                <Button type="submit" disabled={isUploading || isUpdating} className="w-full sm:w-auto">
                  {(isUploading || isUpdating) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}