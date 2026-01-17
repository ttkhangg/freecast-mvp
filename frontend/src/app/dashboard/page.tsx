'use client';

import AuthGuard from '@/components/AuthGuard';
import DashboardLayout from '@/components/DashboardLayout';
import CampaignList from '@/components/CampaignList';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, DollarSign, Activity, Briefcase, Star, Search } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Role } from '@/types';
import { Input } from '@/components/ui/input';

const StatCard = ({ title, value, icon: Icon, description, trend }: any) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
        {trend && <span className="text-green-600 font-medium">{trend}</span>}
        {description}
      </p>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isKOL = user?.role === Role.KOL;

  return (
    <AuthGuard allowedRoles={['BRAND', 'KOL']}>
      <DashboardLayout>
        <div className="space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {isKOL ? 'Thị trường việc làm' : `Xin chào, ${user?.fullName}! 👋`}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isKOL 
                  ? 'Khám phá hàng ngàn cơ hội hợp tác mới nhất hôm nay.' 
                  : 'Tổng quan hoạt động của doanh nghiệp.'}
              </p>
            </div>
            
            {user?.role === 'BRAND' && (
              <Link href="/brand/campaigns/new">
                <Button variant="brand" size="lg" className="shadow-lg shadow-indigo-500/20">
                  <Plus className="mr-2 h-4 w-4" /> Tạo Chiến Dịch
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Stats Grid (Dynamic based on Role) */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isKOL ? (
              // KOL Stats
              <>
                 <StatCard title="Thu nhập tháng này" value="15.5M đ" icon={DollarSign} trend="+12%" description="so với tháng trước" />
                 <StatCard title="Việc đang làm" value="3" icon={Activity} description="chiến dịch active" />
                 <StatCard title="Việc đã hoàn thành" value="28" icon={Briefcase} description="tổng cộng" />
                 <StatCard title="Đánh giá trung bình" value="4.9" icon={Star} description="trên 5.0 sao" />
              </>
            ) : (
              // Brand Stats
              <>
                 <StatCard title="Tổng chi tiêu" value="$45,231" icon={DollarSign} trend="+20.1%" description="so với tháng trước" />
                 <StatCard title="Chiến dịch Active" value="5" icon={Activity} description="đang chạy" />
                 <StatCard title="KOLs Đã thuê" value="124" icon={Users} description="đối tác" />
                 <StatCard title="Tỷ lệ chuyển đổi" value="5.4%" icon={TrendingUp} description="trung bình" />
              </>
            )}
          </div>
          
          {/* KOL Search Bar */}
          {isKOL && (
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm việc làm theo tên, nhãn hàng..." 
                className="pl-10 h-12 text-base rounded-xl shadow-sm border-muted/40 focus-visible:ring-primary/20" 
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                 {isKOL ? <><Briefcase className="h-5 w-5 text-primary"/> Việc làm mới nhất</> : 'Chiến dịch gần đây'}
               </h3>
               {/* <Button variant="link" className="text-primary p-0 h-auto">Xem tất cả &rarr;</Button> */}
            </div>
            
            {/* Campaign List (Reuse Component) */}
            <CampaignList />
          </div>

        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}