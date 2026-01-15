'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCampaignDetail, useApproveApplication, useRejectApplication } from '@/hooks/useCampaigns';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BookingManager from '@/components/BookingManager'; // Import Component mới
import { Loader2, ArrowLeft, Check, X, MessageSquare, User, Users, Calendar, DollarSign } from 'lucide-react';
import { CampaignStatus } from '@/types';

export default function BrandCampaignManagePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // Hooks (Sử dụng hook data cũ nhưng thêm refetch để BookingManager gọi lại khi update)
  const { data: campaign, isLoading, error, refetch } = useCampaignDetail(id);
  const { mutate: approve, isPending: isApproving } = useApproveApplication();
  const { mutate: reject, isPending: isRejecting } = useRejectApplication();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !campaign) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center flex-col">
          <h2 className="text-xl font-bold text-gray-800">Không tìm thấy chiến dịch</h2>
          <Button variant="link" onClick={() => router.push('/brand/campaigns')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const pendingCount = campaign.applications?.filter((a: any) => a.status === 'PENDING').length || 0;
  const approvedCount = campaign.applications?.filter((a: any) => a.status === 'APPROVED' || a.status === 'COMPLETED').length || 0;

  return (
    <AuthGuard allowedRoles={['BRAND']}>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6">
            <button onClick={() => router.push('/brand/campaigns')} className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4">
              <ArrowLeft className="mr-1 h-4 w-4" /> Quay lại danh sách
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>
                  <Badge variant={campaign.status === CampaignStatus.OPEN ? 'success' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1"/> {new Intl.NumberFormat('vi-VN').format(campaign.budget)} đ</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Hạn: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => router.push(`/campaigns/${id}`)}>
                  Xem bài đăng công khai
                </Button>
                <Button variant="secondary" size="sm" onClick={() => router.push(`/brand/campaigns/edit/${id}`)}>
                  Chỉnh sửa
                </Button> 
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Tổng ứng viên</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.applications?.length || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Đang chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Đã tuyển (Approved)</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="mr-2 h-5 w-5 text-indigo-600" />
              Danh sách ứng viên
            </h2>

            <div className="space-y-6">
              {campaign.applications?.map((app: any) => (
                <div key={app.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          {app.kol.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={app.kol.avatar} alt={app.kol.fullName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400"><User className="h-6 w-6" /></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-base font-bold text-gray-900">{app.kol.fullName}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-0.5">
                            <span>{app.kol.email}</span>
                            {app.kol.phone && <span className="mx-1">• {app.kol.phone}</span>}
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        app.status === 'PENDING' ? 'warning' : 
                        app.status === 'APPROVED' ? 'success' : 
                        app.status === 'COMPLETED' ? 'default' : 'destructive'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mt-4 border border-gray-100">
                      <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-1">Lời nhắn:</p>
                      <p className="italic">"{app.coverLetter || 'Tôi rất mong muốn được hợp tác.'}"</p> 
                    </div>

                    {/* KHU VỰC HÀNH ĐỘNG */}
                    
                    {/* 1. Nếu PENDING -> Hiện nút Duyệt/Từ chối */}
                    {app.status === 'PENDING' && (
                      <div className="mt-4 flex gap-3">
                        <Button onClick={() => approve(app.id)} disabled={isApproving} className="flex-1 bg-green-600 hover:bg-green-700" size="sm">
                          <Check className="mr-1.5 h-4 w-4" /> Duyệt hồ sơ
                        </Button>
                        <Button onClick={() => reject(app.id)} disabled={isRejecting} variant="destructive" size="sm" className="flex-1">
                          <X className="mr-1.5 h-4 w-4" /> Từ chối
                        </Button>
                      </div>
                    )}

                    {/* 2. Nếu APPROVED -> Hiện Booking Manager & Chat */}
                    {(app.status === 'APPROVED' || app.status === 'COMPLETED') && (
                      <div className="mt-6 border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className="text-sm font-bold text-gray-900">Quản lý hợp tác</h4>
                           <Button variant="outline" size="sm" onClick={() => router.push('/messages')} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                              <MessageSquare className="mr-2 h-4 w-4" /> Chat ngay
                           </Button>
                        </div>
                        
                        {/* NHÚNG BOOKING MANAGER VÀO ĐÂY */}
                        <BookingManager application={app} isBrand={true} onRefresh={refetch} />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {(!campaign.applications || campaign.applications.length === 0) && (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p>Chưa có ai ứng tuyển.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}