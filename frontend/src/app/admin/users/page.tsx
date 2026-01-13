'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Check, X, ShieldAlert, ChevronLeft, ChevronRight, Search, Loader2, Ban, Unlock } from 'lucide-react';

export default function UserManagement() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    api.get(`/admin/users?page=${page}&search=${search}`)
       .then(res => setData(res.data))
       .finally(() => setLoading(false));
  };

  useEffect(() => { 
      const timer = setTimeout(() => fetchUsers(), 500);
      return () => clearTimeout(timer);
  }, [page, search]);

  const handleVerify = async (id: string) => {
    await api.patch(`/admin/users/${id}/verify`);
    fetchUsers(); 
  };

  // FIX TECH DEBT #4: Logic Ban riêng biệt
  const handleBan = async (id: string) => {
    if(!confirm("Bạn có chắc chắn muốn khóa/mở khóa tài khoản này?")) return;
    await api.patch(`/admin/users/${id}/ban`);
    fetchUsers();
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h1>
        <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Tìm email..." 
                className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 w-64 bg-white" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>
        ) : (
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="p-4 text-slate-500 font-medium text-sm">User Info</th>
                        <th className="p-4 text-slate-500 font-medium text-sm">Role</th>
                        <th className="p-4 text-slate-500 font-medium text-sm">Trạng thái</th>
                        <th className="p-4 text-slate-500 font-medium text-sm text-right">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.data.map((u: any) => (
                        <tr key={u.id} className={`border-b last:border-0 border-slate-50 hover:bg-slate-50/50 transition-colors ${u.isBanned ? 'bg-red-50' : ''}`}>
                            <td className="p-4">
                                <div className="font-medium text-slate-900">{u.email}</div>
                                <div className="text-xs text-slate-500">{u.role === 'BRAND' ? u.brandProfile?.companyName : u.kolProfile?.fullName || '---'}</div>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    u.role === 'BRAND' ? 'bg-indigo-50 text-indigo-600' : 
                                    u.role === 'KOL' ? 'bg-pink-50 text-pink-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    {u.isVerified && <span className="text-green-600 text-xs font-bold flex items-center gap-1"><Check size={14}/> Verified</span>}
                                    {u.isBanned && <span className="text-red-600 text-xs font-bold flex items-center gap-1"><Ban size={14}/> Banned</span>}
                                    {!u.isVerified && !u.isBanned && <span className="text-slate-400 text-xs">Active</span>}
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {/* Nút Verify */}
                                    <button onClick={() => handleVerify(u.id)} className={`p-2 rounded-lg transition-colors ${u.isVerified ? 'text-slate-400 hover:bg-slate-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`} title={u.isVerified ? "Hủy xác minh" : "Xác minh"}>
                                        {u.isVerified ? <X size={16}/> : <Check size={16}/>}
                                    </button>
                                    
                                    {/* FIX #4: Nút Ban riêng biệt */}
                                    <button onClick={() => handleBan(u.id)} className={`p-2 rounded-lg transition-colors ${u.isBanned ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-red-600 bg-red-50 hover:bg-red-100'}`} title={u.isBanned ? "Mở khóa" : "Chặn tài khoản"}>
                                        {u.isBanned ? <Unlock size={16}/> : <Ban size={16}/>}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
      
      {/* Pagination */}
      {data && (
        <div className="flex gap-2 mt-6 justify-end items-center">
            <button disabled={page===1} onClick={() => setPage(page-1)} className="p-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-slate-50 text-slate-600"><ChevronLeft size={20}/></button>
            <span className="text-sm text-slate-600">Trang {data.meta.page}</span>
            <button disabled={page===data.meta.last_page} onClick={() => setPage(page+1)} className="p-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-slate-50 text-slate-600"><ChevronRight size={20}/></button>
        </div>
      )}
    </DashboardLayout>
  );
}
