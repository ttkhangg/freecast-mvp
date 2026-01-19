'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, Loader2, Calendar, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AdminCampaignsPage() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = () => {
    setLoading(true);
    api.get(`/admin/campaigns?page=${page}&search=${search}`)
       .then(res => {
         // FIX: API Interceptor đã unwrap data rồi, không cần res.data nữa
         setData(res); 
       })
       .catch(err => {
         console.error("Failed to fetch campaigns:", err);
         setData(null);
       })
       .finally(() => setLoading(false));
  };

  useEffect(() => { 
      const timer = setTimeout(() => fetchCampaigns(), 500);
      return () => clearTimeout(timer);
  }, [page, search]);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'OPEN': return 'success';
          case 'PAUSED': return 'warning';
          case 'CLOSED': return 'destructive';
          case 'COMPLETED': return 'info';
          default: return 'secondary';
      }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản trị Chiến dịch</h1>
            <p className="text-sm text-slate-500">Giám sát toàn bộ nội dung đăng tuyển trên hệ thống.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Tìm tiêu đề..." 
                className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 w-64 bg-white shadow-sm" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8"/></div>
        ) : (
            <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="p-4 text-slate-500 font-medium text-xs uppercase tracking-wider">Chiến dịch</th>
                        <th className="p-4 text-slate-500 font-medium text-xs uppercase tracking-wider">Brand</th>
                        <th className="p-4 text-slate-500 font-medium text-xs uppercase tracking-wider">Ứng tuyển</th>
                        <th className="p-4 text-slate-500 font-medium text-xs uppercase tracking-wider">Trạng thái</th>
                        <th className="p-4 text-slate-500 font-medium text-xs uppercase tracking-wider text-right">Thao tác</th>
                    </tr>
                </thead>
                {/* Safe check data?.data trước khi map */}
                <tbody className="divide-y divide-slate-50">
                    {data?.data?.length > 0 ? (
                        data.data.map((c: any) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="font-semibold text-slate-900 line-clamp-1 max-w-[250px]">{c.title}</div>
                                    <div className="text-xs text-slate-500 flex items-center mt-1">
                                        <Calendar className="w-3 h-3 mr-1"/> {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                            {c.brand.fullName?.[0] || 'B'}
                                        </div>
                                        <div className="text-sm text-slate-700">{c.brand.fullName}</div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium text-slate-700">{c._count?.applications || 0}</div>
                                </td>
                                <td className="p-4">
                                    <Badge variant={getStatusColor(c.status)}>{c.status}</Badge>
                                </td>
                                <td className="p-4 text-right">
                                    <Link href={`/campaigns/${c.id}`} target="_blank">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Xem chi tiết">
                                            <Eye size={18}/>
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                                Không tìm thấy dữ liệu.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        )}
      </div>
      
      {/* Pagination */}
      {data && data.meta && data.meta.lastPage > 1 && (
        <div className="flex gap-2 mt-6 justify-end items-center">
            <button disabled={page===1} onClick={() => setPage(page-1)} className="px-3 py-1.5 bg-white border rounded-lg disabled:opacity-50 hover:bg-slate-50 text-sm">Trước</button>
            <span className="text-sm text-slate-600 font-medium">Trang {data.meta.page} / {data.meta.lastPage}</span>
            <button disabled={page===data.meta.lastPage} onClick={() => setPage(page+1)} className="px-3 py-1.5 bg-white border rounded-lg disabled:opacity-50 hover:bg-slate-50 text-sm">Sau</button>
        </div>
      )}
    </DashboardLayout>
  );
}