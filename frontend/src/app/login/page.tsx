'use client';
import { useState } from 'react';
import api from '@/utils/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      Cookies.set('token', res.data.access_token);
      Cookies.set('role', res.data.role);
      router.push('/dashboard');
    } catch (err) {
      alert('Email hoặc mật khẩu không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />

      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20">
        <ArrowLeft size={20} /> Trang chủ
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Chào mừng trở lại!</h1>
          <p className="text-slate-400 text-sm mt-1">Đăng nhập để quản lý chiến dịch</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
              placeholder="Mật khẩu" 
              required 
              className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white outline-none transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white text-slate-950 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Đang kiểm tra...' : 'Đăng Nhập'}
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Chưa có tài khoản? <Link href="/register" className="text-indigo-400 font-bold hover:underline">Đăng ký ngay</Link>
        </p>
      </motion.div>
    </div>
  );
}