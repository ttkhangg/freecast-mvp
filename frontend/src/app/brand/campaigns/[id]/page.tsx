'use client';

import { useParams, useRouter } from 'next/navigation';
// Sử dụng relative path
import { useCampaignDetail, useApproveApplication, useRejectApplication } from '../../../../hooks/useCampaigns';
import DashboardLayout from '../../../../components/DashboardLayout';
import AuthGuard from '../../../../components/AuthGuard';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import BookingManager from '../../../../components/BookingManager';
import { Loader2, ArrowLeft, Check, X, MessageSquare, User, Users, Calendar, DollarSign, Filter, MoreHorizontal } from 'lucide-react';
import { CampaignStatus } from '../../../../types';
import { useState } from 'react';
import { cn } from '../../../../lib/utils';

export default function BrandCampaignManagePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: campaign, isLoading, error, refetch } = useCampaignDetail(id);
  const { mutate: approve, isPending: isApproving } = useApproveApplication();
  const { mutate: reject, isPending: isRejecting } = useRejectApplication();
  
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

  if (isLoading) return <DashboardLayout><div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div></DashboardLayout>;
  if (error || !campaign) return <DashboardLayout><div className="text-center mt-20">Không tìm thấy chiến dịch</div></DashboardLayout>;

  // Lọc ứng viên
  const applications = campaign.applications || [];
  const filteredApps = applications.filter((app: any) => {
      if (filterStatus === 'ALL') return true;
      if (filterStatus === 'PENDING') return app.status === 'PENDING';
      if (filterStatus === 'APPROVED') return ['APPROVED', 'COMPLETED'].includes(app.status);
      return true;
  });

  const pendingCount = applications.filter((a: any) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a: any) => ['APPROVED', 'COMPLETED'].includes(a.status)).length;

  return (
    <AuthGuard allowedRoles={['BRAND']}>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20">
          
          {/* 1. Header Area */}
          <div className="mb-8">
            <button onClick={() => router.push('/brand/campaigns')} className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4 group">
              <ArrowLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Quay lại danh sách
            </button>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{campaign.title}</h1>
                  <Badge variant={campaign.status === CampaignStatus.OPEN ? 'success' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 mt-3 text-sm text-slate-500">
                  <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1 text-slate-400"/> {new Intl.NumberFormat('vi-VN').format(campaign.budget)} đ</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-slate-400"/> Hạn: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}</span>
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1 text-slate-400"/> {applications.length} Ứng tuyển</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => router.push(`/campaigns/${id}`)}>
                  Xem bài đăng Public
                </Button>
                <Button variant="secondary" size="sm" onClick={() => router.push(`/brand/campaigns/edit/${id}`)}>
                  Chỉnh sửa
                </Button> 
              </div>
            </div>
          </div>

          {/* 2. Filter & Stats Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 border-b border-slate-200 pb-1">
             <button 
                onClick={() => setFilterStatus('ALL')}
                className={cn("pb-3 text-sm font-medium border-b-2 transition-colors px-4", filterStatus === 'ALL' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700")}
             >
                Tất cả ({applications.length})
             </button>
             <button 
                onClick={() => setFilterStatus('PENDING')}
                className={cn("pb-3 text-sm font-medium border-b-2 transition-colors px-4 flex items-center", filterStatus === 'PENDING' ? "border-yellow-500 text-yellow-600" : "border-transparent text-slate-500 hover:text-slate-700")}
             >
                Chờ duyệt <span className="ml-2 bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>
             </button>
             <button 
                onClick={() => setFilterStatus('APPROVED')}
                className={cn("pb-3 text-sm font-medium border-b-2 transition-colors px-4 flex items-center", filterStatus === 'APPROVED' ? "border-green-600 text-green-600" : "border-transparent text-slate-500 hover:text-slate-700")}
             >
                Đang hợp tác <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">{approvedCount}</span>
             </button>
          </div>

          {/* 3. Applicant List */}
          <div className="space-y-4">
              {filteredApps.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3"/>
                      <p className="text-slate-500">Không có ứng viên nào trong mục này.</p>
                  </div>
              ) : (
                  filteredApps.map((app: any) => (
                    <div key={app.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                      
                      {/* Card Header Info */}
                      <div className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                             <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                {app.kol.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={app.kol.avatar} alt="avt" className="w-full h-full object-cover"/>
                                ) : <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={24}/></div>}
                             </div>
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-slate-900">{app.kol.fullName}</h3>
                                    <Badge variant={
                                        app.status === 'PENDING' ? 'warning' : 
                                        app.status === 'APPROVED' ? 'success' : 
                                        app.status === 'COMPLETED' ? 'default' : 'destructive'
                                    }>
                                        {app.status}
                                    </Badge>
                                </div>
                                <div className="text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                                    <span>{app.kol.email}</span>
                                    {app.kol.phone && <span>• {app.kol.phone}</span>}
                                    <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Xem hồ sơ chi tiết</span>
                                </div>
                                <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm italic text-slate-600 relative">
                                    <span className="absolute -left-1 top-3 w-1 h-8 bg-indigo-200 rounded-r"></span>
                                    "{app.coverLetter || 'Tôi rất mong muốn được hợp tác cùng Brand.'}"
                                </div>
                             </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 min-w-[140px]">
                              {app.status === 'PENDING' && (
                                  <>
                                    <Button onClick={() => approve(app.id)} disabled={isApproving} className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                                        <Check className="w-4 h-4 mr-2"/> Duyệt
                                    </Button>
                                    <Button onClick={() => reject(app.id)} disabled={isRejecting} variant="destructive" className="bg-white text-red-600 border border-red-200 hover:bg-red-50">
                                        <X className="w-4 h-4 mr-2"/> Từ chối
                                    </Button>
                                  </>
                              )}
                              {(app.status === 'APPROVED' || app.status === 'COMPLETED') && (
                                  <Button onClick={() => router.push('/messages')} variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                                      <MessageSquare className="w-4 h-4 mr-2"/> Nhắn tin
                                  </Button>
                              )}
                          </div>
                      </div>

                      {/* Booking Manager (Expandable) */}
                      {(app.status === 'APPROVED' || app.status === 'COMPLETED') && (
                          <div className="bg-slate-50 border-t border-slate-100 p-6">
                              <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Tiến độ công việc</h4>
                              <BookingManager application={app} isBrand={true} onRefresh={refetch} />
                          </div>
                      )}
                    </div>
                  ))
              )}
          </div>

        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}