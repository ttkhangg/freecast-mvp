'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { Loader2, Calendar, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

// Define the shape of a Campaign object based on what the backend returns
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
}

export default function CampaignList() {
  const { data: campaigns, isLoading, error } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      // The api util returns response.data automatically
      return await api.get('/campaigns'); 
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
        <p>Không thể tải danh sách chiến dịch.</p>
        <p className="text-sm mt-1 text-red-500">{(error as Error).message}</p>
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500">Chưa có chiến dịch nào đang mở.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <div 
          key={campaign.id} 
          className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-lg border border-gray-100"
        >
          <div className="p-5">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                {campaign.brand.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={campaign.brand.avatar} 
                    alt={campaign.brand.fullName} 
                    className="h-10 w-10 rounded-full object-cover border border-gray-200" 
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                    {campaign.brand.fullName?.charAt(0).toUpperCase() || 'B'}
                  </div>
                )}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{campaign.brand.fullName}</p>
                <p className="text-xs text-gray-500">Brand</p>
              </div>
            </div>
            
            <div className="mb-4 h-14">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                <Link href={`/campaigns/${campaign.id}`}>
                  {campaign.title}
                </Link>
              </h3>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span className="font-medium text-green-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(campaign.budget)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span>{new Date(campaign.deadline).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500 font-medium">
              <Users className="h-3.5 w-3.5 mr-1" />
              {campaign._count.applications} ứng tuyển
            </div>
            <Link 
              href={`/campaigns/${campaign.id}`}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
            >
              Xem chi tiết →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}