'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlusCircle, LayoutGrid, Search, Filter, Loader2, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import Cookies from 'js-cookie';
import NotificationBell from '@/components/NotificationBell';

export default function Dashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState('ALL');

  const fetchCampaigns = () => {
    setLoading(true);
    api.get(`/campaigns?search=${keyword}&platform=${platform}`)
       .then(res => setCampaigns(res.data))
       .catch(console.error)
       .finally(() => setLoading(false));
  };

  useEffect(() => {
    const userRole = Cookies.get('role');
    if (userRole) setRole(userRole);

    const timer = setTimeout(() => {
      fetchCampaigns();
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, platform]);

  const handleCreateCampaign = () => {
    if (role === 'BRAND') {
      router.push('/brand/campaigns/new');
    } else {
      alert("Chức năng chỉ dành cho Brand");
    }
  }

  const handleCardClick = (campaignId: string) => {
    if (role === 'ADMIN') {
        alert("Admin vui lòng sử dụng trang Quản trị (Admin Portal) để quản lý nội dung.");
        return;
    }
    router.push(`/campaigns/${campaignId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="text-indigo-600" /> Sàn Chiến dịch
          </h1>
          <p className="text-slate-500 mt-1">Tìm kiếm và ứng tuyển vào các chiến dịch phù hợp nhất.</p>
        </div>
        
        {role === 'BRAND' && (
          <button 
            onClick={handleCreateCampaign}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <PlusCircle size={20} /> Đăng Campaign Mới
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center sticky top-4 z-30">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={20}/>
          <input 
            type="text" 
            placeholder="Tìm kiếm chiến dịch, thương hiệu..." 
            className="w-full pl-10 p-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="relative min-w-[180px] flex-1 md:flex-none">
                <Filter className="absolute left-3 top-3.5 text-slate-400" size={20}/>
                <select 
                    className="w-full pl-10 p-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-all"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                >
                    <option value="ALL">Tất cả nền tảng</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                </select>
            </div>

            <div className="flex items-center gap-4">
                <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
                <div className="bg-slate-900 rounded-full p-1 shadow-md hover:bg-slate-800 transition-colors">
                    <NotificationBell />
                </div>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-indigo-600 h-8 w-8"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <LayoutGrid size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Không tìm thấy kết quả</h3>
              <p className="text-slate-500">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
            </div>
          ) : campaigns.map((c, i) => (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleCardClick(c.id)}
              className="bg-white p-6 rounded-2xl relative overflow-hidden group cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 p-0 opacity-100 transition-opacity duration-500">
                 {c.productImage ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-l from-white via-white/80 to-transparent w-full h-full z-10"></div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.productImage} alt="bg" className="w-32 h-32 object-cover opacity-50" style={{maskImage: 'linear-gradient(to left, black, transparent)'}} />
                    </>
                 ) : (
                    <div className="w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-10 mr-[-20px] mt-[-20px]"></div>
                 )}
              </div>

              <div className="flex justify-between items-start mb-4 relative z-20">
                <div className="flex flex-col gap-2">
                    <span className={`w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      c.platform === 'TikTok' 
                        ? 'bg-black text-white border-black' 
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {c.platform}
                    </span>
                    {c.productImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.productImage} alt="thumb" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm mt-1" />
                    )}
                </div>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  {c.productValue}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 relative z-20">{c.title}</h3>
              
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 relative z-20">
                  <Calendar size={12}/> {new Date(c.createdAt).toLocaleDateString('vi-VN')}
              </div>

              <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed relative z-20">{c.description}</p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50 relative z-20">
                
                {/* --- FIX: HIỂN THỊ LOGO BRAND --- */}
                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                  {c.brand?.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.brand.logo} alt={c.brand.companyName} className="w-full h-full object-cover" />
                  ) : (
                      <span className="text-xs font-bold text-indigo-600">{c.brand?.companyName?.[0]}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{c.brand?.companyName}</p>
                  <p className="text-[10px] text-slate-500">Verified Brand</p>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleCardClick(c.id);
                  }}
                  className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all duration-300"
                >
                  {role === 'KOL' ? 'Ứng tuyển' : 'Chi tiết'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}