'use client';

import { useMyCampaigns } from '@/hooks/useCampaigns';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Loader2, Users, Calendar, DollarSign, Eye, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CampaignStatus } from '@/types';
import { useEffect } from 'react';

export default function BrandCampaignsPage() {
  const { data: campaigns, isLoading, error } = useMyCampaigns();

  // Debug: Xem data trả về là gì
  useEffect(() => {
    console.log("My Campaigns Data:", campaigns);
    console.log("Loading:", isLoading);
    console.log("Error:", error);
  }, [campaigns, isLoading, error]);

  return (
    <AuthGuard allowedRoles={['BRAND']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          
          <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý chiến dịch</h2>
              <p className="mt-1 text-sm text-gray-500">Xem và quản lý tất cả các tin tuyển dụng của bạn.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/brand/campaigns/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Tạo chiến dịch mới
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
             <div className="text-center py-16 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-2" />
                <h3 className="text-red-800 font-medium">Không thể tải danh sách</h3>
                <p className="text-red-600 text-sm">{(error as Error).message}</p>
             </div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="grid gap-6">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id} 
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6 sm:flex sm:justify-between sm:items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          <Link href={`/brand/campaigns/${campaign.id}`} className="hover:text-indigo-600 transition-colors">
                            {campaign.title}
                          </Link>
                        </h3>
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                          campaign.status === CampaignStatus.OPEN ? "bg-green-100 text-green-800" :
                          campaign.status === CampaignStatus.CLOSED ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        )}>
                          {campaign.status.toLowerCase()}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6 text-sm text-gray-500">
                        <div className="flex items-center mt-1 sm:mt-0">
                          <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(campaign.budget)}
                        </div>
                        <div className="flex items-center mt-1 sm:mt-0">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Hạn nộp: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center mt-1 sm:mt-0">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Đăng ngày: {new Date(campaign.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-4">
                      <div className="flex flex-col items-center px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
                        <span className="text-2xl font-bold text-indigo-600">{campaign._count?.applications || 0}</span>
                        <span className="text-xs font-medium text-indigo-600 flex items-center">
                          <Users className="h-3 w-3 mr-1" /> Ứng viên
                        </span>
                      </div>
                      
                      <Link href={`/brand/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" /> Chi tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Briefcase className="h-full w-full" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có chiến dịch nào</h3>
              <p className="mt-1 text-sm text-gray-500">Bắt đầu tuyển dụng KOL bằng cách tạo chiến dịch đầu tiên.</p>
              <div className="mt-6">
                <Link href="/brand/campaigns/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tạo chiến dịch ngay
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}