'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Building2, Star, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'BRAND' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      alert('Đăng ký thành công! Đang chuyển hướng...');
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
      
      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20">
        <ArrowLeft size={20} /> Trang chủ
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gia nhập <span className="text-gradient">FreeCast</span></h1>
          <p className="text-slate-400 text-sm">Cộng đồng Booking KOL/KOC số 1 Việt Nam</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-900/50 rounded-xl border border-white/5">
            {[
              { id: 'BRAND', label: 'Nhãn hàng', icon: Building2 },
              { id: 'KOL', label: 'Creator', icon: Star }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormData({...formData, role: item.id})}
                className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  formData.role === item.id 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder={formData.role === 'BRAND' ? "Tên Doanh Nghiệp / Shop" : "Họ và Tên / Nickname"} 
                required 
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white outline-none transition-all placeholder:text-slate-600"
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email đăng nhập" 
                required 
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white outline-none transition-all placeholder:text-slate-600"
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Mật khẩu (Tối thiểu 6 ký tự)" 
                required 
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white outline-none transition-all placeholder:text-slate-600"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang khởi tạo...' : 'Đăng Ký Ngay'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Đã có tài khoản? <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline">Đăng nhập</Link>
        </p>
      </motion.div>
    </div>
  );
}