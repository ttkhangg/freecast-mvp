'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, LayoutGrid, FileText, TrendingUp, DollarSign, Activity, AlertCircle, Loader2, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Parallel Fetching
    Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/activity')
    ]).then(([statsRes, actRes]) => {
        setStats(statsRes.data);
        setActivities(actRes.data);
    }).catch(console.error);
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
      <div className="space-y-8 pb-10">
        
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Command Center</h1>
            <p className="text-slate-500 mt-1">Báo cáo hiệu suất & Sức khỏe hệ thống.</p>
        </div>
        
        {/* 1. Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tổng User</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</p>
             </div>
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24}/></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Active Campaigns</p>
                <p className="text-3xl font-bold text-slate-900">{stats.activeCampaigns.toLocaleString()}</p>
             </div>
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><LayoutGrid size={24}/></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tổng Applications</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalApplications.toLocaleString()}</p>
             </div>
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FileText size={24}/></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
             <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Doanh thu (Est)</p>
                <p className="text-3xl font-bold text-slate-900">$45.2k</p>
             </div>
             <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><DollarSign size={24}/></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600"/> Tăng trưởng User (6 tháng)
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
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Alerts & Activity */}
          <div className="space-y-6">
              
              {/* Live Activity Feed */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-emerald-600"/> Hoạt động gần đây
                </h3>
                <div className="space-y-4">
                    {activities.length > 0 ? activities.map((act, i) => (
                        <div key={i} className="flex gap-3 items-start border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0 animate-pulse"></div>
                            <div>
                                <p className="text-sm text-slate-700">{act.message}</p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock size={10}/> {new Date(act.time).toLocaleTimeString('vi-VN')}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-slate-400 italic">Chưa có hoạt động nào.</p>
                    )}
                </div>
              </div>

              {/* System Alerts */}
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                <div className="flex gap-3 items-start">
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-bold text-red-800 text-sm">System Health: Stable</h4>
                        <p className="text-red-600 text-xs mt-1 leading-relaxed">
                            Server Load: 12% <br/>
                            DB Connections: 45/100
                        </p>
                    </div>
                </div>
              </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}