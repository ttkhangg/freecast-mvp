'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCampaignDetail, useApplyCampaign, useCancelApplication } from '@/hooks/useCampaigns';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import BookingManager from '@/components/BookingManager'; // Import Booking Manager
import { Loader2, Calendar, DollarSign, CheckCircle, ArrowLeft, Briefcase, Trash2, MessageSquare } from 'lucide-react';
import { Role } from '@/types';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  // Hooks (Sử dụng refetch để làm mới data khi booking manager update)
  const { data: campaign, isLoading, error, refetch } = useCampaignDetail(id);
  const { mutate: apply, isPending: isApplying } = useApplyCampaign();
  const { mutate: cancelApply, isPending: isCanceling } = useCancelApplication();
  const { user } = useAuthStore();

  const myApplication = campaign?.applications?.find(app => app.kolId === user?.id);
  const hasApplied = !!myApplication;
  const canCancel = hasApplied && myApplication.status === 'PENDING';
  const isApproved = hasApplied && (myApplication.status === 'APPROVED' || myApplication.status === 'COMPLETED');

  const handleApply = () => {
    if (!user) return router.push('/login');
    if (confirm('Bạn có chắc chắn muốn ứng tuyển?')) apply(id);
  };

  const handleCancel = () => {
    if (confirm('Huỷ ứng tuyển?')) cancelApply(id);
  };

  if (isLoading) return <DashboardLayout><div className="flex h-96 items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600"/></div></DashboardLayout>;
  if (error || !campaign) return <DashboardLayout><div className="text-center mt-20">Không tìm thấy chiến dịch</div></DashboardLayout>;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <button onClick={() => router.back()} className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900"><ArrowLeft className="mr-1 h-4 w-4"/> Quay lại</button>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 md:flex md:items-center md:justify-between text-white">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold leading-tight sm:truncate">{campaign.title}</h1>
                <div className="mt-3 flex gap-6 text-indigo-100 font-medium">
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
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center px-4 py-2 rounded-md bg-green-500/20 text-green-100 font-medium border border-green-500/30 backdrop-blur-sm">
                          <CheckCircle className="mr-2 h-4 w-4"/> Đã ứng tuyển
                        </span>
                        {canCancel && (
                          <Button variant="destructive" size="sm" onClick={handleCancel} isLoading={isCanceling} className="bg-red-500/80 border-none text-white">
                            <Trash2 className="mr-2 h-4 w-4"/> Huỷ đơn
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Brand Info */}
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center">
              <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center border-2 border-indigo-100 overflow-hidden shadow-sm">
                {campaign.brand.avatar ? <img src={campaign.brand.avatar} className="h-full w-full object-cover" /> : "B"}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-900">{campaign.brand.fullName}</h3>
                <p className="text-sm text-gray-600">{campaign.brand.bio || 'Nhà tuyển dụng uy tín'}</p>
              </div>
            </div>

            <div className="px-8 py-8 space-y-8">
              <section>
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4"><CheckCircle className="h-5 w-5 text-indigo-600 mr-2"/> Mô tả công việc</h3>
                <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">{campaign.description}</div>
              </section>

              {/* KHU VỰC LÀM VIỆC CỦA KOL (CHỈ HIỆN KHI APPROVED) */}
              {isApproved && (
                <section className="mt-8 pt-8 border-t-2 border-dashed border-indigo-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-indigo-700">Khu vực làm việc</h3>
                    <Button variant="outline" onClick={() => router.push('/messages')}>
                        <MessageSquare className="mr-2 h-4 w-4"/> Chat với Brand
                    </Button>
                  </div>
                  
                  {/* Nhúng Booking Manager để KOL xác nhận nhận hàng / nộp bài */}
                  <BookingManager application={myApplication} isBrand={false} onRefresh={refetch} />
                </section>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}