'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCampaignDetail, useApplyCampaign, useCancelApplication } from '@/hooks/useCampaigns';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, DollarSign, CheckCircle, ArrowLeft, Briefcase, Trash2 } from 'lucide-react';
import { Role } from '@/types';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const { data: campaign, isLoading, error } = useCampaignDetail(id);
  const { mutate: apply, isPending: isApplying } = useApplyCampaign();
  const { mutate: cancelApply, isPending: isCanceling } = useCancelApplication();
  const { user } = useAuthStore();

  // Kiểm tra an toàn trước khi access sâu
  const myApplication = campaign?.applications?.find(app => app.kolId === user?.id);
  const hasApplied = !!myApplication;
  const canCancel = hasApplied && myApplication.status === 'PENDING';

  const handleApply = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn ứng tuyển?')) {
      apply(id);
    }
  };

  const handleCancel = () => {
    if (confirm('Bạn có chắc chắn muốn huỷ ứng tuyển?')) {
      cancelApply(id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !campaign) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center flex-col">
          <h2 className="text-xl font-bold text-gray-800">Không tìm thấy chiến dịch</h2>
          <Button variant="link" onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-1 h-4 w-4" /> Quay lại
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          <button onClick={() => router.back()} className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" /> Quay lại danh sách
          </button>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 md:flex md:items-center md:justify-between text-white">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold leading-tight sm:truncate">
                  {campaign.title}
                </h1>
                <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6 text-indigo-100 font-medium">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Hạn nộp: {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString('vi-VN') : 'N/A'}
                  </div>
                  <div className="flex items-center mt-1 sm:mt-0">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Ngân sách: <span className="text-white font-bold ml-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(campaign.budget)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 md:mt-0 md:ml-6">
                {/* LOGIC NÚT BẤM CHO KOL */}
                {user?.role === Role.KOL && (
                  <>
                    {!hasApplied ? (
                      <Button
                        size="lg"
                        onClick={handleApply}
                        isLoading={isApplying}
                        className="bg-white text-indigo-600 hover:bg-indigo-50 border-transparent shadow-md font-bold"
                      >
                        {!isApplying && <Briefcase className="mr-2 h-5 w-5" />}
                        Ứng tuyển ngay
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center px-4 py-2 rounded-md bg-green-500/20 text-green-100 font-medium border border-green-500/30 backdrop-blur-sm">
                          <CheckCircle className="mr-2 h-4 w-4" /> Đã ứng tuyển
                        </span>
                        {canCancel && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleCancel}
                            isLoading={isCanceling}
                            className="bg-red-500/80 hover:bg-red-600 border-none text-white"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Huỷ đơn
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* LOGIC NÚT BẤM CHO BRAND (Sửa lỗi dead end) */}
                {user?.id === campaign.brandId && (
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={() => router.push(`/brand/campaigns/${campaign.id}`)}
                    >
                      Quản lý ứng viên
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-white border-white/30 hover:bg-white/10"
                      onClick={() => router.push(`/brand/campaigns/edit/${campaign.id}`)}
                    >
                      Chỉnh sửa tin
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Info - Safe Access */}
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-indigo-600 text-2xl font-bold border-2 border-indigo-100 overflow-hidden shadow-sm">
                  {campaign.brand?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={campaign.brand.avatar} alt={campaign.brand.fullName} className="h-full w-full object-cover" />
                  ) : (
                    (campaign.brand?.fullName || 'B').charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-900">{campaign.brand?.fullName || 'Brand'}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{campaign.brand?.bio || 'Nhà tuyển dụng uy tín trên FreeCast'}</p>
              </div>
            </div>

            <div className="px-8 py-8 space-y-8">
              <section>
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                  <div className="p-1.5 bg-indigo-100 rounded-md mr-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600" /> 
                  </div>
                  Mô tả công việc
                </h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed pl-2 border-l-4 border-indigo-100 ml-3">
                  {campaign.description}
                </div>
              </section>

              {campaign.requirements && (
                <section>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                    <div className="p-1.5 bg-yellow-100 rounded-md mr-3">
                      <CheckCircle className="h-5 w-5 text-yellow-600" /> 
                    </div>
                    Yêu cầu ứng viên
                  </h3>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed bg-yellow-50/50 p-6 rounded-xl border border-yellow-100">
                    {campaign.requirements}
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