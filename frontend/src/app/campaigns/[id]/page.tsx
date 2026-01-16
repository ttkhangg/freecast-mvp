'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCampaignDetail, useApplyCampaign, useCancelApplication } from '@/hooks/useCampaigns';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import BookingManager from '@/components/BookingManager';
import { Loader2, Calendar, DollarSign, CheckCircle, ArrowLeft, Briefcase, Trash2, MessageSquare, Info, User as UserIcon } from 'lucide-react';
import { Role } from '@/types';
import { useMemo } from 'react';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const { data: campaign, isLoading, error, refetch } = useCampaignDetail(id);
  const { mutate: apply, isPending: isApplying } = useApplyCampaign();
  const { mutate: cancelApply, isPending: isCanceling } = useCancelApplication();
  const { user } = useAuthStore();

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
            // Lọc review dành cho campaign này (thường là Brand review KOL hoặc KOL review Brand về job này)
            // Ở đây ta hiển thị tất cả review liên quan đến các application của campaign này để tăng uy tín
            reviews.push(...app.reviews);
        }
    });

    const total = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const avg = reviews.length > 0 ? (total / reviews.length).toFixed(1) : 0;
    return { averageRating: avg, reviewsList: reviews };
  }, [campaign]);

  const handleApply = () => {
    if (!user) return router.push('/login');
    if (confirm('Bạn có chắc chắn muốn ứng tuyển?')) apply(id);
  };
  const handleCancel = () => { if (confirm('Huỷ ứng tuyển?')) cancelApply(id); };

  if (isLoading) return <DashboardLayout><div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600"/></div></DashboardLayout>;
  if (error || !campaign) return <DashboardLayout><div className="text-center mt-20">Không tìm thấy chiến dịch</div></DashboardLayout>;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <button onClick={() => router.back()} className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"><ArrowLeft className="mr-1 h-4 w-4"/> Quay lại</button>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 md:flex md:items-center md:justify-between text-white">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                   <h1 className="text-3xl font-bold leading-tight sm:truncate">{campaign.title}</h1>
                   {hasApplied && (
                     <Badge variant={myApplication.status === 'APPROVED' ? 'success' : myApplication.status === 'PENDING' ? 'warning' : 'destructive'} className="border-white/20 text-white bg-white/20">
                        {myApplication.status}
                     </Badge>
                   )}
                </div>
                
                <div className="flex items-center gap-2 mb-3 text-yellow-300">
                    <StarRating rating={Number(averageRating)} readonly size="sm" />
                    <span className="text-white font-bold">{Number(averageRating) > 0 ? averageRating : 'Mới'}</span>
                    <span className="text-indigo-200 text-sm">({reviewsList.length} đánh giá)</span>
                </div>

                <div className="flex gap-6 text-indigo-100 font-medium">
                  <span className="flex items-center"><Calendar className="mr-2 h-5 w-5"/> Hạn: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}</span>
                  <span className="flex items-center"><DollarSign className="mr-2 h-5 w-5"/> <span className="text-white font-bold ml-1">{new Intl.NumberFormat('vi-VN').format(campaign.budget)}</span></span>
                </div>
              </div>
              
              <div className="mt-8 md:mt-0 md:ml-6">
                {user?.role === Role.KOL && (
                  <>
                    {!hasApplied ? (
                      <Button size="lg" onClick={handleApply} isLoading={isApplying} className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-md font-bold">
                        <Briefcase className="mr-2 h-5 w-5"/> Ứng tuyển ngay
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2 items-end">
                        {canCancel && (
                          <Button variant="ghost" size="sm" onClick={handleCancel} isLoading={isCanceling} className="text-white hover:bg-white/20 hover:text-white">
                            <Trash2 className="mr-2 h-4 w-4"/> Huỷ đơn
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
                {user?.id === campaign.brandId && (
                   <Button variant="secondary" onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}>Quản lý Job này</Button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8 space-y-8">
              {showBookingManager && (
                <section className="mb-8 animate-in fade-in zoom-in duration-300">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-indigo-800 flex items-center"><CheckCircle className="mr-2 h-5 w-5"/> Khu vực làm việc</h3>
                        <p className="text-sm text-indigo-600">Thực hiện các bước để hoàn thành và nhận đánh giá.</p>
                    </div>
                    <Button variant="default" size="sm" onClick={() => router.push('/messages')} className="shadow-sm">
                        <MessageSquare className="mr-2 h-4 w-4"/> Chat với Brand
                    </Button>
                  </div>
                  <BookingManager application={myApplication} isBrand={false} onRefresh={refetch} />
                </section>
              )}

              <section>
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4"><Info className="h-5 w-5 text-indigo-600 mr-2"/> Mô tả công việc</h3>
                <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-6 rounded-xl border border-gray-100 leading-relaxed">{campaign.description}</div>
              </section>

              {campaign.requirements && (
                <section>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4"><CheckCircle className="h-5 w-5 text-yellow-600 mr-2"/> Yêu cầu</h3>
                    <div className="text-gray-700 whitespace-pre-line bg-yellow-50/50 p-6 rounded-xl border border-yellow-100 leading-relaxed">{campaign.requirements}</div>
                </section>
              )}

              {/* REVIEW LIST SECTION */}
              {reviewsList.length > 0 && (
                <section className="pt-8 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Đánh giá từ cộng đồng</h3>
                    <div className="space-y-4">
                        {reviewsList.map((review: any) => (
                            <div key={review.id} className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {review.author.avatar ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={review.author.avatar} className="h-full w-full object-cover" alt="Author" />
                                    ) : <div className="h-full w-full flex items-center justify-center text-gray-400"><UserIcon className="h-5 w-5"/></div>}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-sm text-gray-900">{review.author.fullName}</p>
                                        <StarRating rating={review.rating} readonly size="sm" />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">"{review.comment}"</p>
                                    <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}