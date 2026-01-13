'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft, Save, Loader2, Edit3 } from 'lucide-react';
import Link from 'next/link';

export default function EditCampaignPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false); // Loading khi submit
  const [fetching, setFetching] = useState(true); // Loading khi lấy dữ liệu ban đầu
  
  const [form, setForm] = useState({
    title: '', 
    description: '', 
    productName: '', 
    productValue: '',
    platform: 'TikTok', 
    requirements: '', 
    deadline: ''
  });

  // 1. Lấy dữ liệu chiến dịch cũ
  useEffect(() => {
    if (!id) return;
    
    api.get(`/campaigns/${id}`)
      .then(res => {
        const data = res.data;
        // Format lại ngày tháng để hiển thị đúng trong input type="date"
        const formattedDate = data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '';
        
        setForm({
          title: data.title || '',
          description: data.description || '',
          productName: data.productName || '',
          productValue: data.productValue || '',
          platform: data.platform || 'TikTok',
          requirements: data.requirements || '',
          deadline: formattedDate
        });
      })
      .catch(err => {
        console.error(err);
        alert("Không thể tải thông tin chiến dịch hoặc bạn không có quyền truy cập.");
        router.push('/brand/campaigns');
      })
      .finally(() => setFetching(false));
  }, [id, router]);

  // 2. Xử lý cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/campaigns/${id}`, { 
        ...form, 
        deadline: form.deadline ? new Date(form.deadline) : undefined 
      });
      alert('Cập nhật chiến dịch thành công!');
      router.push('/brand/campaigns');
    } catch (err) {
      alert('Lỗi khi cập nhật chiến dịch. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600 h-8 w-8"/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <Link href="/brand/campaigns" className="flex items-center text-slate-500 mb-6 hover:text-indigo-600 font-medium transition-colors">
            <ArrowLeft size={20} className="mr-2"/> Quay lại danh sách
        </Link>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Edit3 size={24} className="text-indigo-600"/> Chỉnh sửa Chiến dịch
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tên chiến dịch</label>
            <input 
                required 
                type="text" 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                placeholder="VD: Review Tết 2024..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sản phẩm</label>
                <input 
                    required 
                    type="text" 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" 
                    value={form.productName} 
                    onChange={e => setForm({...form, productName: e.target.value})} 
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Giá trị (Quyền lợi)</label>
                <input 
                    required 
                    type="text" 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" 
                    value={form.productValue} 
                    onChange={e => setForm({...form, productValue: e.target.value})} 
                    placeholder="VD: 500.000đ + Sản phẩm"
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nền tảng</label>
                <select 
                    className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" 
                    value={form.platform} 
                    onChange={e => setForm({...form, platform: e.target.value})}
                >
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Hạn nộp hồ sơ</label>
                <input 
                    required 
                    type="date" 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" 
                    value={form.deadline} 
                    onChange={e => setForm({...form, deadline: e.target.value})} 
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả chi tiết</label>
            <textarea 
                required 
                className="w-full p-3 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none" 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Yêu cầu ứng viên</label>
            <textarea 
                required 
                className="w-full p-3 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none" 
                value={form.requirements} 
                onChange={e => setForm({...form, requirements: e.target.value})} 
                placeholder="- Trên 10k Follower..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
             <Link 
                href="/brand/campaigns"
                className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
             >
                Hủy bỏ
             </Link>
             <button 
                type="submit" 
                disabled={loading} 
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>} 
                Lưu Thay Đổi
             </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}