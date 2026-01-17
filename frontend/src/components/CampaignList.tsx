'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { Loader2, Calendar, DollarSign, Users, Briefcase, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Campaign {
  id: string;
  title: string;
  budget: number;
  deadline: string;
  status: string;
  brand: {
    fullName: string;
    avatar: string | null;
  };
  _count: {
    applications: number;
  };
  createdAt: string;
}

export default function CampaignList() {
  const { data: campaigns, isLoading, error } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => await api.get('/campaigns'),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-medium">Không thể tải danh sách chiến dịch.</p>
        <p className="text-sm mt-1 opacity-80">{(error as Error).message}</p>
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-muted bg-muted/20">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
           <Briefcase className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-foreground">Chưa có chiến dịch nào</p>
        <p className="text-sm text-muted-foreground mt-1">Hãy quay lại sau hoặc tạo chiến dịch mới.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="group flex flex-col overflow-hidden hover:border-primary/50 cursor-pointer">
          <Link href={`/campaigns/${campaign.id}`} className="flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                 <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
                        {campaign.brand.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                            src={campaign.brand.avatar} 
                            alt={campaign.brand.fullName} 
                            className="h-full w-full object-cover" 
                        />
                        ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 font-bold text-primary">
                            {campaign.brand.fullName?.charAt(0).toUpperCase()}
                        </div>
                        )}
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">Brand</p>
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{campaign.brand.fullName}</p>
                    </div>
                 </div>
                 {/* Status Badge - Có thể thêm logic màu dựa trên status */}
                 <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                    {campaign.status.toLowerCase()}
                 </Badge>
              </div>
              
              <div className="mt-4">
                 <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                    {campaign.title}
                 </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="pb-4 flex-1">
               <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1 p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <div className="flex items-center text-xs text-muted-foreground">
                          <DollarSign className="mr-1 h-3.5 w-3.5" /> Ngân sách
                      </div>
                      <p className="font-semibold text-sm text-foreground">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(campaign.budget)}
                      </p>
                  </div>
                  <div className="space-y-1 p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3.5 w-3.5" /> Hạn nộp
                      </div>
                      <p className="font-semibold text-sm text-foreground">
                        {new Date(campaign.deadline).toLocaleDateString('vi-VN')}
                      </p>
                  </div>
               </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/20 py-3">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground font-medium">
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  {campaign._count.applications} ứng viên
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-primary/10 hover:text-primary gap-1">
                   Chi tiết <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
}