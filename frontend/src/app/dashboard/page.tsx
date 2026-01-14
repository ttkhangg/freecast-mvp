'use client';

import AuthGuard from '@/components/AuthGuard';
import DashboardLayout from '@/components/DashboardLayout';
import CampaignList from '@/components/CampaignList'; // Import component mới
import { useAuthStore } from '@/store/useAuthStore';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <AuthGuard allowedRoles={['BRAND', 'KOL']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          {/* Header Section */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Xin chào, {user?.fullName || 'User'}!
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === 'BRAND' 
                  ? 'Quản lý chiến dịch của bạn và tìm kiếm những gương mặt đại diện xuất sắc.' 
                  : 'Khám phá các chiến dịch mới và tìm kiếm cơ hội hợp tác phù hợp.'}
              </p>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
              {user?.role === 'BRAND' && (
                <Link
                  href="/brand/campaigns/new" // Đường dẫn tạo chiến dịch
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <PlusCircle className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                  Tạo Chiến Dịch
                </Link>
              )}
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.role === 'BRAND' ? 'Chiến dịch của bạn' : 'Chiến dịch đang mở'}
              </h3>
              {/* Nút xem tất cả tạm thời ẩn hoặc dẫn đến trang list đầy đủ nếu có */}
            </div>
            
            {/* Campaign List Component */}
            <CampaignList />
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}