'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCampaignDetail, useApproveApplication, useRejectApplication } from '@/hooks/useCampaigns';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Added 'Users' to the import list below
import { Loader2, ArrowLeft, Check, X, MessageSquare, User, Briefcase, Calendar, DollarSign, Users } from 'lucide-react';
import { CampaignStatus } from '@/types';

export default function BrandCampaignManagePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // Hooks
  const { data: campaign, isLoading, error } = useCampaignDetail(id);
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

  // Helper để lấy số lượng ứng viên theo trạng thái
  const pendingCount = campaign.applications?.filter((a: any) => a.status === 'PENDING').length || 0;
  const approvedCount = campaign.applications?.filter((a: any) => a.status === 'APPROVED').length || 0;

  return (
    <AuthGuard allowedRoles={['BRAND']}>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          {/* Header Navigation */}
          <div className="mb-6">
            <button 
              onClick={() => router.push('/brand/campaigns')} 
              className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
            >
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
                {/* Tính năng edit sẽ làm sau */}
                <Button variant="secondary" size="sm">Chỉnh sửa</Button> 
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
              <p className="text-sm font-medium text-gray-500">Đã tuyển</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
          </div>

          {/* Applicants List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="mr-2 h-5 w-5 text-indigo-600" />
              Danh sách ứng viên
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {campaign.applications?.map((app: any) => (
                <div 
                  key={app.id} 
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          {app.kol.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={app.kol.avatar} alt={app.kol.fullName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <User className="h-6 w-6" />
                            </div>
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
                        app.status === 'APPROVED' ? 'success' : 'destructive'
                      }>
                        {app.status === 'PENDING' ? 'Chờ duyệt' : 
                         app.status === 'APPROVED' ? 'Đã nhận' : 'Từ chối'}
                      </Badge>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-4 border border-gray-100">
                      <p className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-1">Lời nhắn:</p>
                      <p className="italic">"{app.coverLetter || 'Tôi rất mong muốn được hợp tác trong dự án này.'}"</p> 
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="bg-gray-50/80 px-6 py-4 border-t border-gray-100 flex gap-3">
                    {app.status === 'PENDING' && (
                      <>
                        <Button 
                          onClick={() => approve(app.id)} 
                          disabled={isApproving || isRejecting} 
                          className="flex-1 bg-green-600 hover:bg-green-700" 
                          size="sm"
                        >
                          <Check className="mr-1.5 h-4 w-4" /> Duyệt
                        </Button>
                        <Button 
                          onClick={() => reject(app.id)} 
                          disabled={isApproving || isRejecting} 
                          variant="destructive" 
                          size="sm" 
                          className="flex-1"
                        >
                          <X className="mr-1.5 h-4 w-4" /> Từ chối
                        </Button>
                      </>
                    )}
                    
                    {app.status === 'APPROVED' && (
                      <Button variant="outline" size="sm" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        <MessageSquare className="mr-2 h-4 w-4" /> Nhắn tin trao đổi
                      </Button>
                    )}

                    {app.status === 'REJECTED' && (
                       <p className="text-xs text-center w-full text-gray-400 py-2">Đã từ chối hồ sơ này</p>
                    )}
                  </div>
                </div>
              ))}

              {(!campaign.applications || campaign.applications.length === 0) && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Briefcase className="h-10 w-10 text-gray-300 mb-2" />
                  <p>Chưa có ai ứng tuyển.</p>
                  <p className="text-sm">Hãy kiên nhẫn chờ đợi thêm nhé!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}