'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bell, LogOut, Search, PlusCircle, CheckCircle2, LayoutGrid } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return router.push('/login');
    setRole(Cookies.get('role') || '');
    api.get('/campaigns').then(res => setCampaigns(res.data)).catch(console.error);
  }, [router]);

  const handleCreateCampaign = () => {
    alert("Tính năng tạo chiến dịch đang được phát triển và sẽ sớm ra mắt!");
  }

  const handleApply = () => {
    alert("Yêu cầu ứng tuyển đã được gửi! (Demo)");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Top Navigation */}
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">F</div>
          <span className="font-bold text-xl tracking-tight">FreeCast</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-white/5 px-3 py-2 rounded-full text-slate-400 border border-white/5 focus-within:border-indigo-500/50 transition-colors">
            <Search size={18} />
            <input type="text" placeholder="Tìm chiến dịch..." className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-white placeholder:text-slate-600" />
          </div>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{role === 'BRAND' ? 'Tài khoản Brand' : 'Tài khoản Creator'}</p>
              <p className="text-[10px] text-indigo-400 font-medium tracking-wider">THÀNH VIÊN PRO</p>
            </div>
            <button onClick={() => { Cookies.remove('token'); router.push('/login'); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Đăng xuất">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <LayoutGrid className="text-indigo-500" /> Chiến dịch mới nhất
            </h1>
            <p className="text-slate-400 mt-1">Cơ hội hợp tác độc quyền dành cho bạn</p>
          </div>
          {role === 'BRAND' && (
            <button 
              onClick={handleCreateCampaign}
              className="bg-white text-slate-950 px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <PlusCircle size={20} /> Đăng Campaign Mới
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.length === 0 ? (
            <div className="col-span-full py-24 text-center glass-card rounded-3xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <LayoutGrid size={32} />
              </div>
              <p className="text-slate-400 font-medium">Chưa có chiến dịch nào được tạo.</p>
              {role === 'BRAND' && <p className="text-sm text-indigo-400 mt-2 cursor-pointer hover:underline" onClick={handleCreateCampaign}>Tạo ngay chiến dịch đầu tiên</p>}
            </div>
          ) : campaigns.map((c, i) => (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                <div className="w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
              </div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                  c.platform === 'TikTok' 
                    ? 'bg-black/50 border-white/10 text-white' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {c.platform}
                </span>
                <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {c.productValue}
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-2 text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{c.title}</h3>
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed">{c.description}</p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-white/5 relative z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                  {c.brand?.companyName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{c.brand?.companyName}</p>
                  <p className="text-[10px] text-slate-500">Verified Brand</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleApply(); }}
                  className="text-xs font-bold text-slate-950 bg-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-50"
                >
                  Ứng tuyển
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}