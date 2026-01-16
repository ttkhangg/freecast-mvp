'use client';

import { useParams, useRouter } from 'next/navigation';
// Sử dụng relative path để đảm bảo build thành công 100%
import { useCampaignDetail, useApplyCampaign, useCancelApplication } from '../../../hooks/useCampaigns';
import { useAuthStore } from '../../../store/useAuthStore';
import DashboardLayout from '../../../components/DashboardLayout';
import AuthGuard from '../../../components/AuthGuard';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { StarRating } from '../../../components/ui/star-rating';
import BookingManager from '../../../components/BookingManager';
import { Loader2, Calendar, DollarSign, CheckCircle, ArrowLeft, Briefcase, Trash2, MessageSquare, Info, User as UserIcon, Image as ImageIcon, Gift, MapPin } from 'lucide-react';
import { Role } from '../../../types';
import { useMemo, useState } from 'react';
import { cn } from '../../../lib/utils';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const { data: campaign, isLoading, error, refetch } = useCampaignDetail(id);
  const { mutate: apply, isPending: isApplying } = useApplyCampaign();
  const { mutate: cancelApply, isPending: isCanceling } = useCancelApplication();
  const { user } = useAuthStore();
  
  // State xem ảnh fullsize
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const myApplication = campaign?.applications?.find((app: any) => app.kolId === user?.id);
  const hasApplied = !!myApplication;
  const canCancel = hasApplied && myApplication.status === 'PENDING';
  const showBookingManager = hasApplied && (myApplication.status === 'APPROVED' || myApplication.status === 'COMPLETED');

  // Tính toán sao & Lấy list reviews
  const { averageRating, reviewsList } = useMemo(() => {
    if (!campaign?.applications) return { averageRating: 0, reviewsList: [] };
    const reviews: any[] = [];
    campaign.applications.forEach((app: any) => {
        if (app.reviews && app.reviews.length > 0) {
            reviews.push(...app.reviews);
        }
    });

    const total = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const avg = reviews.length > 0 ? (total / reviews.length).toFixed(1) : 0;
    return { averageRating: avg, reviewsList: reviews };
  }, [campaign]);

  const handleApply = () => {
    if (!user) return router.push('/login');
    if (user.role === Role.BRAND) return alert("Tài khoản Brand không thể ứng tuyển!");
    if (confirm('Bạn có chắc chắn muốn ứng tuyển vào chiến dịch này?')) apply(id);
  };

  const handleCancel = () => { if (confirm('Huỷ ứng tuyển?')) cancelApply(id); };

  if (isLoading) return <DashboardLayout><div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600"/></div></DashboardLayout>;
  if (error || !campaign) return <DashboardLayout><div className="text-center mt-20">Không tìm thấy chiến dịch</div></DashboardLayout>;

  // Xử lý hiển thị Ngân sách
  const displayBudget = campaign.budget > 0 
    ? new Intl.NumberFormat('vi-VN').format(campaign.budget) + ' đ'
    : 'Tặng sản phẩm';

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20">
          {/* Navigation */}
          <button onClick={() => router.back()} className="mb-6 flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group">
            <ArrowLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform"/> Quay lại danh sách
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Main Content */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. HERO SECTION (Title + Brand) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-2">{campaign.title}</h1>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <span className="font-semibold text-indigo-600">{campaign.brand.fullName}</span>
                                <span>•</span>
                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> Hết hạn: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                        {/* Status Badge cho KOL đã apply */}
                        {hasApplied && (
                             <Badge variant={myApplication.status === 'APPROVED' ? 'success' : myApplication.status === 'PENDING' ? 'warning' : 'destructive'} className="shrink-0">
                                {myApplication.status}
                             </Badge>
                        )}
                    </div>
                </div>

                {/* 2. IMAGE GALLERY (FIX UX: Luôn hiển thị nếu có ảnh) */}
                {/* @ts-ignore */}
                {campaign.images && campaign.images.length > 0 ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-indigo-600"/> Hình ảnh sản phẩm
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* @ts-ignore */}
                            {campaign.images.map((img: string, idx: number) => (
                                <div 
                                    key={idx} 
                                    className="aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in relative group"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Empty state cho ảnh
                    <div className="bg-slate-50 rounded-2xl p-8 border border-dashed border-slate-200 text-center">
                        <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
                        <p className="text-slate-400 text-sm">Chưa có hình ảnh sản phẩm</p>
                    </div>
                )}

                {/* 3. BOOKING MANAGER (Chỉ hiện khi đã được duyệt) */}
                {showBookingManager && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-1 rounded-2xl border border-indigo-100">
                            <div className="bg-white rounded-xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500"/> Khu vực làm việc
                                    </h3>
                                    <Button variant="outline" size="sm" onClick={() => router.push('/messages')} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                        <MessageSquare className="mr-2 h-4 w-4"/> Chat ngay
                                    </Button>
                                </div>
                                <BookingManager application={myApplication} isBrand={false} onRefresh={refetch} />
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. DESCRIPTION & REQUIREMENTS */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-8">
                    <section>
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5 text-slate-400"/> Mô tả chi tiết
                        </h3>
                        <div className="text-slate-600 whitespace-pre-line leading-relaxed text-sm md:text-base">
                            {campaign.description}
                        </div>
                    </section>

                    <div className="h-px bg-slate-100"></div>

                    {campaign.requirements && (
                        <section>
                            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-slate-400"/> Yêu cầu ứng viên
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                {campaign.requirements}
                            </div>
                        </section>
                    )}
                </div>

                {/* 5. REVIEWS */}
                {reviewsList.length > 0 && (
                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Đánh giá từ các KOL trước ({reviewsList.length})</h3>
                        <div className="space-y-4">
                            {reviewsList.map((review: any) => (
                                <div key={review.id} className="flex gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                        {review.author.avatar ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={review.author.avatar} className="w-full h-full object-cover" alt="avt"/>
                                        ) : <UserIcon size={16} className="text-slate-400"/>}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm text-slate-900">{review.author.fullName}</p>
                                            <StarRating rating={review.rating} readonly size="sm" />
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1">"{review.comment}"</p>
                                        <p className="text-xs text-slate-400 mt-1">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
            </div>

            {/* RIGHT COLUMN: Sticky Action Card */}
            <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-50">
                        <div className="text-center mb-6">
                            <p className="text-sm text-slate-500 mb-1">Thù lao ước tính</p>
                            <div className={cn("text-2xl font-black", campaign.budget > 0 ? "text-emerald-600" : "text-pink-600")}>
                                {displayBudget}
                            </div>
                        </div>

                        {user?.role === Role.KOL ? (
                            <div className="space-y-3">
                                {!hasApplied ? (
                                    <Button 
                                        size="lg" 
                                        onClick={handleApply} 
                                        isLoading={isApplying} 
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-200"
                                    >
                                        Ứng tuyển ngay
                                    </Button>
                                ) : (
                                    <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center border border-green-100 font-medium">
                                        <CheckCircle className="w-5 h-5 mx-auto mb-1"/>
                                        Bạn đã nộp hồ sơ
                                    </div>
                                )}

                                {canCancel && (
                                    <Button 
                                        variant="ghost" 
                                        onClick={handleCancel} 
                                        isLoading={isCanceling} 
                                        className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
                                    >
                                        Rút hồ sơ
                                    </Button>
                                )}
                            </div>
                        ) : user?.id === campaign.brandId ? (
                            <Button 
                                className="w-full" variant="outline"
                                onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}
                            >
                                Quản lý Campaign này
                            </Button>
                        ) : (
                            <div className="text-center text-sm text-slate-400 bg-slate-50 p-3 rounded-lg">
                                Bạn đang xem dưới quyền {user?.role}
                            </div>
                        )}
                    </div>

                    {/* Brand Info Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase text-center">Thông tin Brand</h4>
                        <div className="flex flex-col items-center text-center">
                             <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 mb-3 overflow-hidden">
                                {campaign.brand.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={campaign.brand.avatar} className="w-full h-full object-cover" alt="Brand"/>
                                ) : <div className="w-full h-full flex items-center justify-center font-bold text-xl text-slate-300">{campaign.brand.fullName[0]}</div>}
                             </div>
                             <p className="font-bold text-slate-900">{campaign.brand.fullName}</p>
                             <p className="text-xs text-slate-500 mt-1 line-clamp-2">{campaign.brand.bio || 'Chưa có giới thiệu'}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
          >
             <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"><X size={32}/></button>
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"/>
          </div>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}