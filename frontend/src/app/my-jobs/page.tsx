'use client';

import { useMyJobs } from '@/hooks/useCampaigns';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { Loader2, Calendar, Briefcase, Clock, Building2, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function MyJobsPage() {
  const { data: applications, isLoading } = useMyJobs();

  // Helper render status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="warning" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Chờ duyệt</Badge>;
      case 'APPROVED': return <Badge variant="success" className="bg-blue-100 text-blue-700 hover:bg-blue-200 animate-pulse">Đang thực hiện</Badge>;
      case 'COMPLETED': return <Badge variant="success">Hoàn thành</Badge>;
      case 'REJECTED': return <Badge variant="destructive">Từ chối</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AuthGuard allowedRoles={['KOL']}>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Việc của tôi</h2>
              <p className="text-muted-foreground mt-1">Quản lý các chiến dịch bạn đã ứng tuyển và theo dõi tiến độ.</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Tìm thêm việc mới</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="grid gap-4">
              {applications.map((app) => (
                <Card key={app.id} className="group hover:shadow-md transition-all duration-200 border-border/60">
                    <div className="flex flex-col md:flex-row">
                        {/* Left Info */}
                        <div className="p-6 flex-1 flex items-start gap-4">
                            <div className="h-14 w-14 rounded-xl bg-secondary/50 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                {app.campaign.brand.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={app.campaign.brand.avatar} alt="Brand" className="h-full w-full object-cover"/>
                                ) : (
                                    <Building2 className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                        <Link href={`/campaigns/${app.campaignId}`}>{app.campaign.title}</Link>
                                    </h3>
                                    {getStatusBadge(app.status)}
                                </div>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                    <span className="text-foreground">{app.campaign.brand.fullName}</span> • 
                                    <span className="text-xs font-normal bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                                        ID: {app.id.slice(0,8)}
                                    </span>
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1"/> Apply: {new Date(app.createdAt).toLocaleDateString('vi-VN')}</span>
                                    {app.status === 'APPROVED' && <span className="flex items-center text-blue-600"><Clock className="w-3.5 h-3.5 mr-1"/> Cần nộp bài sớm</span>}
                                </div>
                            </div>
                        </div>

                        {/* Right Action */}
                        <div className="p-4 md:p-6 md:border-l border-t md:border-t-0 border-border/60 bg-muted/5 flex flex-row md:flex-col items-center md:justify-center justify-between gap-3 min-w-[160px]">
                             {app.status === 'APPROVED' || app.status === 'COMPLETED' ? (
                                 <Link href={`/my-jobs/${app.id}`} className="w-full">
                                    <Button className="w-full shadow-sm" variant={app.status === 'COMPLETED' ? 'outline' : 'default'}>
                                        {app.status === 'COMPLETED' ? 'Xem lại' : 'Báo cáo tiến độ'}
                                    </Button>
                                 </Link>
                             ) : (
                                 <Button variant="secondary" className="w-full cursor-not-allowed opacity-70" disabled>
                                     {app.status === 'PENDING' ? 'Đang chờ duyệt' : 'Đã đóng'}
                                 </Button>
                             )}
                             
                             <Link href={`/campaigns/${app.campaignId}`} className="md:w-full">
                                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                                    Xem tin gốc
                                </Button>
                             </Link>
                        </div>
                    </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-muted/10 rounded-3xl border-2 border-dashed border-muted">
              <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Chưa có công việc nào</h3>
              <p className="text-muted-foreground mt-2 text-center max-w-md">
                Bạn chưa ứng tuyển vào chiến dịch nào. Hãy dạo quanh thị trường để tìm kiếm cơ hội phù hợp nhé.
              </p>
              <div className="mt-8">
                <Link href="/dashboard">
                  <Button size="lg" className="shadow-lg shadow-primary/20 font-bold px-8">Tìm việc ngay</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}