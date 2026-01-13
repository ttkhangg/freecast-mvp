'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { Plus, Calendar, Eye, Loader2, LayoutList, Lock, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Định nghĩa kiểu dữ liệu cho Campaign
interface Campaign {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  _count: {
    applications: number;
  };
}

export default function BrandCampaignsPage() {
  const router = useRouter(); 
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm fetch data
  const fetchCampaigns = () => {
    setLoading(true);
    api.get('/campaigns/brand/my-campaigns')
      .then(res => setCampaigns(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Hàm xử lý đóng chiến dịch
  const handleClose = async (id: string) => {
    if(!confirm("Bạn muốn đóng chiến dịch này? KOL sẽ không thể ứng tuyển nữa.")) return;
    try {
      await api.patch(`/campaigns/${id}/close`);
      alert("Đã đóng chiến dịch thành công!");
      fetchCampaigns(); 
    } catch (err) {
      alert("Lỗi khi đóng chiến dịch.");
    }
  };

  // Hàm xử lý xóa chiến dịch (MỚI - Chuẩn CRUD)
  const handleDelete = async (id: string) => {
    if(!confirm("CẢNH BÁO: Bạn chắc chắn muốn xóa chiến dịch này? Toàn bộ dữ liệu ứng viên của chiến dịch này cũng sẽ bị xóa vĩnh viễn.")) return;
    try {
        await api.delete(`/campaigns/${id}`);
        alert("Đã xóa chiến dịch thành công!");
        fetchCampaigns(); 
    } catch(err) { 
        alert("Lỗi khi xóa chiến dịch."); 
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <LayoutList className="text-indigo-600"/> Quản lý Chiến dịch
            </h1>
            <p className="text-slate-500 mt-1">Theo dõi hiệu quả và duyệt đơn ứng tuyển.</p>
          </div>
          
          <button 
            onClick={() => router.push('/brand/campaigns/new')} 
            className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={20}/> Tạo Chiến dịch
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-indigo-600 h-8 w-8"/>
          </div>
        ) : (
          <div className="grid gap-4">
            {campaigns.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <LayoutList size={48} className="mx-auto text-slate-300 mb-4"/>
                  <p className="text-slate-500 font-medium">Bạn chưa có chiến dịch nào.</p>
              </div>
            ) : campaigns.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                       c.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 
                       c.status === 'LOCKED' ? 'bg-red-50 text-red-600 border-red-100' :
                       'bg-slate-100 text-slate-500 border-slate-200'
                     }`}>
                       {c.status}
                     </span>
                     <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                       <Calendar size={12}/> {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                     </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-bold text-indigo-600">{c._count?.applications || 0}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ứng viên</p>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                      {/* Nút Sửa (Link sang trang Edit) */}
                      <Link 
                        href={`/brand/campaigns/edit/${c.id}`} 
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        title="Chỉnh sửa chiến dịch"
                      >
                        <Edit size={18}/>
                      </Link>

                      {/* Nút Xóa (Gọi API) */}
                      <button 
                        onClick={() => handleDelete(c.id)} 
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" 
                        title="Xóa chiến dịch"
                      >
                          <Trash2 size={18}/>
                      </button>

                      {/* Nút Đóng (Chỉ hiện khi ACTIVE) */}
                      {c.status === 'ACTIVE' && (
                        <button 
                          onClick={() => handleClose(c.id)}
                          className="p-2.5 text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
                          title="Đóng chiến dịch (Dừng tuyển)"
                        >
                          <Lock size={18}/>
                        </button>
                      )}

                      <Link href={`/brand/campaigns/${c.id}`} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 active:scale-95">
                        <Eye size={18}/> Duyệt đơn
                      </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}