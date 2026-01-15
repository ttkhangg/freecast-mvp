'use client';

import { useMyJobs } from '@/hooks/useCampaigns';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Loader2, Calendar, DollarSign, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyJobsPage() {
  const { data: applications, isLoading } = useMyJobs();

  return (
    <AuthGuard allowedRoles={['KOL']}>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Việc làm của tôi</h2>
            <p className="mt-1 text-sm text-gray-500">Quản lý các chiến dịch bạn đã ứng tuyển và theo dõi tiến độ.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="grid gap-4">
              {applications.map((app) => (
                <Link key={app.id} href={`/campaigns/${app.campaignId}`} className="block">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between group">
                    
                    <div className="flex items-start gap-4">
                      {/* Brand Avatar */}
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                          {app.campaign.brand.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={app.campaign.brand.avatar} alt="Brand" className="h-full w-full object-cover"/>
                          ) : (
                            <Briefcase className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {app.campaign.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">{app.campaign.brand.fullName}</p>
                        <div className="flex items-center text-xs text-gray-400 gap-4">
                          <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> Apply: {new Date(app.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center justify-between md:flex-col md:items-end gap-2">
                      <Badge variant={
                        app.status === 'PENDING' ? 'warning' :
                        app.status === 'APPROVED' ? 'success' :
                        app.status === 'COMPLETED' ? 'default' : 'destructive'
                      } className="px-3 py-1 text-xs uppercase tracking-wide">
                        {app.status === 'PENDING' ? 'Đang chờ duyệt' :
                         app.status === 'APPROVED' ? 'Đã nhận Job' :
                         app.status === 'COMPLETED' ? 'Hoàn thành' : 'Bị từ chối'}
                      </Badge>
                      
                      {app.status === 'APPROVED' && (
                        <span className="text-xs text-green-600 font-medium animate-pulse">
                          Đang thực hiện...
                        </span>
                      )}
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <div className="mx-auto h-12 w-12 text-gray-300">
                <Briefcase className="h-full w-full" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa ứng tuyển việc nào</h3>
              <p className="mt-1 text-sm text-gray-500">Hãy tìm kiếm chiến dịch mới và ứng tuyển ngay.</p>
              <div className="mt-6">
                <Link href="/campaigns">
                  <Button>Tìm việc ngay</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}