'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, LayoutGrid, FileText, TrendingUp, DollarSign, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import Link from 'next/link'; // Thêm import Link

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-indigo-600 h-8 w-8"/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header & Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tổng quan hệ thống</h1>
            <p className="text-slate-500 mt-1">Báo cáo hiệu suất vận hành thời gian thực.</p>
          </div>
          
          {/* FIX TECH DEBT #5: Nút truy cập nhanh User Management */}
          <Link 
            href="/admin/users" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2 transition-all hover:-translate-y-0.5"
          >
             <Users size={20}/> Quản lý Người dùng
          </Link>
        </div>
        
        {/* 1. Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tổng người dùng</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</p>
             </div>
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24}/></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Chiến dịch Active</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalCampaigns.toLocaleString()}</p>
             </div>
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><LayoutGrid size={24}/></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tổng đơn ứng tuyển</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalApplications.toLocaleString()}</p>
             </div>
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FileText size={24}/></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">GMV (Ước tính)</p>
                <p className="text-3xl font-bold text-slate-900">$45,200</p>
             </div>
             <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><DollarSign size={24}/></div>
          </div>
        </div>

        {/* 2. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart (Growth) - Chiếm 2 cột */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600"/> Biểu đồ tăng trưởng User
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.growthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#1e293b' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Chart (Status) - Chiếm 1 cột */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-emerald-600"/> Trạng thái đơn hàng
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.applicationStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="status" type="category" stroke="#64748b" fontSize={11} width={80} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="_count.id" name="Số lượng" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* 3. System Alerts */}
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3 items-start">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
                <h4 className="font-bold text-red-700 text-sm">Cảnh báo hệ thống</h4>
                <p className="text-red-600 text-sm mt-1">Phát hiện 3 tài khoản có dấu hiệu spam trong 24h qua. Vui lòng kiểm tra mục <Link href="/admin/users" className="underline font-bold hover:text-red-800">Quản lý Người dùng</Link>.</p>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
