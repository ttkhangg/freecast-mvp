'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCampaignDetail, useApplyCampaign, useCancelApplication } from '@/hooks/useCampaigns';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import BookingManager from '@/components/BookingManager';
import { Role } from '@/types';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Loader2, Calendar, CheckCircle, ArrowLeft, ImageIcon, X, MapPin, 
  Clock, DollarSign, ShieldCheck, User 
} from 'lucide-react';

// New UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const { data: campaign, isLoading, error, refetch } = useCampaignDetail(id);
  const { mutate: apply, isPending: isApplying } = useApplyCampaign();
  const { mutate: cancelApply, isPending: isCanceling } = useCancelApplication();
  const { user } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const myApplication = campaign?.applications?.find((app: any) => app.kolId === user?.id);
  const hasApplied = !!myApplication;
  const showBookingManager = hasApplied && (myApplication.status === 'APPROVED' || myApplication.status === 'COMPLETED');

  // Tính toán Rating
  const { reviewsList } = useMemo(() => {
    if (!campaign?.applications) return { reviewsList: [] };
    const reviews: any[] = [];
    campaign.applications.forEach((app: any) => {
        if (app.reviews && app.reviews.length > 0) reviews.push(...app.reviews);
    });
    return { reviewsList: reviews };
  }, [campaign]);

  if (isLoading) return <DashboardLayout><div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary"/></div></DashboardLayout>;
  if (error || !campaign) return <DashboardLayout><div className="p-8 text-center text-muted-foreground">Không tìm thấy chiến dịch</div></DashboardLayout>;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
          
          {/* Breadcrumb / Back Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <button onClick={() => router.back()} className="hover:text-foreground transition-colors flex items-center">
                <ArrowLeft className="mr-1 h-4 w-4"/> Chiến dịch
             </button>
             <span>/</span>
             <span className="text-foreground font-medium truncate max-w-[200px]">{campaign.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN (8/12) */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Header Card */}
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-secondary/20">
                    <CardHeader className="pb-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-1.5">
                                <Badge variant="secondary" className="mb-2">{campaign.status}</Badge>
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{campaign.title}</h1>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="flex items-center"><Clock className="mr-1 h-3.5 w-3.5"/> Đăng: {new Date(campaign.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span>•</span>
                                    <span className="flex items-center text-destructive"><Calendar className="mr-1 h-3.5 w-3.5"/> Hạn: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 divide-x border-t bg-muted/30">
                         <div className="p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-muted-foreground uppercase font-semibold">Ngân sách</span>
                            <span className="text-lg font-bold text-emerald-600 mt-1">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(campaign.budget)}
                            </span>
                         </div>
                         <div className="p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-muted-foreground uppercase font-semibold">Ứng tuyển</span>
                            <span className="text-lg font-bold text-primary mt-1">{campaign._count?.applications || 0}</span>
                         </div>
                    </div>
                </Card>

                {/* 2. Image Gallery */}
                {campaign.images && campaign.images.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary"/> Hình ảnh sản phẩm</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* @ts-ignore */}
                                {campaign.images.map((img: string, idx: number) => (
                                    <div 
                                        key={idx} 
                                        className="aspect-square rounded-lg overflow-hidden border bg-muted cursor-zoom-in relative group"
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt="Product" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 3. Booking Manager (Progress) */}
                {showBookingManager && (
                     <div className="animate-fade-in">
                        <BookingManager application={myApplication} isBrand={false} onRefresh={refetch} />
                     </div>
                )}

                {/* 4. Description Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Nội dung chi tiết</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                            {campaign.description}
                        </div>
                        
                        {campaign.requirements && (
                            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/20">
                                <h4 className="font-semibold text-amber-800 dark:text-amber-500 mb-2 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4"/> Yêu cầu ứng viên
                                </h4>
                                <p className="text-sm text-amber-900/80 dark:text-amber-400 whitespace-pre-line">
                                    {campaign.requirements}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 5. Reviews */}
                {reviewsList.length > 0 && (
                     <Card>
                        <CardHeader><CardTitle>Đánh giá ({reviewsList.length})</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            {reviewsList.map((review: any) => (
                                <div key={review.id} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                        {review.author.avatar ? <img src={review.author.avatar} className="h-full w-full object-cover" alt=""/> : <User className="h-5 w-5 text-muted-foreground"/>}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-sm">{review.author.fullName}</p>
                                            <StarRating rating={review.rating} readonly size="sm" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                                        <p className="text-xs text-muted-foreground/60">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                     </Card>
                )}
            </div>

            {/* RIGHT COLUMN (4/12) - Sticky */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Brand Info Card */}
                <Card className="border-primary/20 shadow-md">
                    <CardContent className="pt-6 text-center">
                        <div className="h-20 w-20 mx-auto rounded-full border-2 border-background shadow-sm overflow-hidden mb-3">
                            {campaign.brand.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={campaign.brand.avatar} className="h-full w-full object-cover" alt="Brand"/>
                            ) : (
                                <div className="h-full w-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                    {campaign.brand.fullName[0]}
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-lg">{campaign.brand.fullName}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 px-4 mb-4">
                            {campaign.brand.bio || "Doanh nghiệp uy tín trên FreeCast"}
                        </p>
                        
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 py-2 rounded-lg mx-4">
                             <MapPin className="h-3 w-3"/> Việt Nam
                             <span className="w-1 h-1 bg-muted-foreground rounded-full"/>
                             <span>Tham gia 2024</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Card */}
                <Card className="sticky top-24 shadow-lg border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-base">Hành động</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {user?.role === Role.KOL ? (
                            <>
                                {hasApplied ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="p-3 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg text-sm font-medium text-center border border-green-100 dark:border-green-900/30 flex items-center justify-center gap-2">
                                            <CheckCircle className="h-4 w-4"/> Đã nộp hồ sơ
                                        </div>
                                        {myApplication.status === 'PENDING' && (
                                            <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => { if(confirm('Hủy?')) cancelApply(id); }} isLoading={isCanceling}>
                                                Rút hồ sơ
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <Button 
                                        className="w-full font-bold h-12 text-base shadow-lg shadow-primary/20" 
                                        variant="brand"
                                        onClick={() => { if(confirm('Apply?')) apply(id); }} 
                                        isLoading={isApplying}
                                    >
                                        Ứng tuyển ngay
                                    </Button>
                                )}
                            </>
                        ) : user?.id === campaign.brandId ? (
                            <Button className="w-full" onClick={() => router.push(`/brand/campaigns/${id}`)}>
                                Quản lý Campaign
                            </Button>
                        ) : (
                            <p className="text-sm text-center text-muted-foreground bg-muted p-2 rounded">Chế độ xem dành cho {user?.role}</p>
                        )}
                        
                        <div className="pt-2 text-center">
                            <p className="text-xs text-muted-foreground">Cam kết thanh toán bảo đảm qua FreeCast Escrow.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>

        {/* Modal xem ảnh Fullscreen */}
        {selectedImage && (
            <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
                <button className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"><X/></button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedImage} alt="Full" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"/>
            </div>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}