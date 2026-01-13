'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload'; // 1. Import Component

export default function CreateCampaign() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', 
    description: '', 
    productName: '', 
    productValue: '',
    platform: 'TikTok', 
    requirements: '', 
    deadline: '',
    productImage: '' // 2. Thêm trường ảnh vào state
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/campaigns', { 
          ...form, 
          deadline: new Date(form.deadline) 
      });
      alert('Tạo chiến dịch thành công!');
      router.push('/brand/campaigns');
    } catch (err) {
      alert('Lỗi khi tạo chiến dịch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <Link href="/brand/campaigns" className="flex items-center text-slate-500 mb-6 hover:text-indigo-600 font-medium transition-colors">
            <ArrowLeft size={20} className="mr-2"/> Quay lại danh sách
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Tạo Chiến dịch Mới</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          
          {/* --- TÍNH NĂNG UPLOAD ẢNH (MỚI) --- */}
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">Hình ảnh sản phẩm (Minh họa)</label>
             <ImageUpload 
                value={form.productImage} 
                onChange={(url) => setForm({...form, productImage: url})} 
             />
          </div>

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
                    placeholder="Tên sản phẩm"
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
                placeholder="Mô tả về chiến dịch, yêu cầu công việc cụ thể..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Yêu cầu ứng viên</label>
            <textarea 
                required 
                className="w-full p-3 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none" 
                value={form.requirements} 
                onChange={e => setForm({...form, requirements: e.target.value})} 
                placeholder="- Trên 10k Follower...&#10;- Có kinh nghiệm review đồ gia dụng..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
             <button 
                type="submit" 
                disabled={loading} 
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex justify-center gap-2 shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>} 
                Đăng Chiến Dịch
             </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}