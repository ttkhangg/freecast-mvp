'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Check, X, ArrowLeft, Star, Filter, Search, ExternalLink, Loader2, Eye, MessageSquare, Truck, Lock } from 'lucide-react';
import Link from 'next/link';
import ReviewModal from '@/components/ReviewModal';
import ChatBox from '@/components/ChatBox';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import DashboardLayout from '@/components/DashboardLayout';
import VerifiedBadge from '@/components/VerifiedBadge';

export default function ManageApplicants() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter(); 
  
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApprove, setLoadingApprove] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  
  const [filterFollower, setFilterFollower] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewingAppId, setReviewingAppId] = useState<string | null>(null);
  const [chattingAppId, setChattingAppId] = useState<string | null>(null);

  const fetchApplicants = () => {
    api.get(`/campaigns/${id}/applicants`).then(res => setApplicants(res.data));
  };

  useEffect(() => { 
    const token = Cookies.get('token');
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            setUserId(decoded.sub);
        } catch (error) {}
    }
    fetchApplicants(); 
  }, [id]);

  useEffect(() => {
    const autoChatId = searchParams.get('chatAppId');
    if (autoChatId) setChattingAppId(autoChatId);
  }, [searchParams]);

  // LOGIC SECURE FLOW: Bước 1 - Duyệt đơn (Chưa có vận đơn)
  const handleApprove = async (appId: string) => {
    if(!confirm("Xác nhận duyệt ứng viên này? Sau khi duyệt, bạn sẽ thấy thông tin liên hệ để gửi hàng.")) return;
    
    setLoadingApprove(appId);
    try {
      // Gửi request không có shippingCode -> Status sẽ là APPROVED
      await api.patch(`/campaigns/application/${appId}/approve`, {});
      fetchApplicants();
    } catch (err) {
      alert("Lỗi khi duyệt");
    } finally {
      setLoadingApprove(null);
    }
  };

  // LOGIC SECURE FLOW: Bước 2 - Cập nhật vận đơn (Sau khi đã duyệt)
  const handleUpdateShipping = async (appId: string) => {
    const code = prompt("Nhập mã vận đơn (VD: GHTK123...):");
    if (!code) return;
    
    setLoadingApprove(appId);
    try {
      await api.patch(`/campaigns/application/${appId}/approve`, {
        shippingCode: code,
        carrier: 'GHTK' // Demo, thực tế có thể cho chọn hãng
      });
      alert("Đã cập nhật vận đơn & Thông báo cho KOL!");
      fetchApplicants();
    } catch (err) { alert("Lỗi cập nhật"); }
    finally { setLoadingApprove(null); }
  };

  const filteredApplicants = applicants.filter(app => {
    const matchName = app.kol.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    let matchFollower = true;
    if (filterFollower === '>10k') matchFollower = app.kol.followers >= 10000;
    if (filterFollower === '>50k') matchFollower = app.kol.followers >= 50000;
    if (filterFollower === '>100k') matchFollower = app.kol.followers >= 100000;
    return matchName && matchFollower;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <Link href="/brand/campaigns" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2"/> Quay lại danh sách
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Danh sách ứng viên</h1>
                <p className="text-slate-500 text-sm mt-1">Tổng cộng: {filteredApplicants.length} KOL phù hợp</p>
            </div>
            
            <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
                    <input 
                        type="text" 
                        placeholder="Tìm tên KOL..." 
                        className="pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-48 text-slate-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-3 text-slate-400"/>
                    <select 
                        className="pl-9 pr-8 py-2 bg-slate-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer text-slate-900"
                        value={filterFollower}
                        onChange={(e) => setFilterFollower(e.target.value)}
                    >
                        <option value="ALL">Tất cả Follower</option>
                        <option value=">10k">&gt; 10k Followers</option>
                        <option value=">50k">&gt; 50k Followers</option>
                        <option value=">100k">&gt; 100k Followers</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 font-bold text-slate-600 text-sm uppercase">Thông tin KOL</th>
                <th className="p-4 font-bold text-slate-600 text-sm uppercase">Trạng thái</th>
                <th className="p-4 font-bold text-slate-600 text-sm uppercase text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map(app => (
                <tr key={app.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 align-top max-w-[300px]">
                      <div className="flex items-start gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                            {app.kol.avatar ? <img src={app.kol.avatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">{app.kol.fullName[0]}</div>}
                         </div>
                         <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1">
                                {app.kol.fullName}
                                {app.kol.user?.isVerified && <VerifiedBadge />}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{app.kol.followers.toLocaleString()} followers</div>
                            {app.kol.socialLink && (
                                <a href={app.kol.socialLink} target="_blank" className="text-xs text-indigo-500 hover:underline flex items-center gap-1 mt-1"><ExternalLink size={10}/> Kênh review</a>
                            )}
                            
                            {/* --- SECURE FLOW: Ẩn thông tin nếu chưa duyệt --- */}
                            {['APPROVED', 'SHIPPING', 'RECEIVED', 'SUBMITTED', 'COMPLETED'].includes(app.status) ? (
                                <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-100 text-xs text-slate-700">
                                    <p className="flex items-center gap-1"><span className="font-bold">SĐT:</span> {app.kol.phone}</p>
                                    <p className="flex items-center gap-1 mt-1"><span className="font-bold">Đ/C:</span> {app.kol.address}</p>
                                </div>
                            ) : (
                                <div className="mt-2 text-xs text-slate-400 italic flex items-center gap-1">
                                    <Lock size={10}/> Thông tin liên hệ bị ẩn
                                </div>
                            )}
                         </div>
                      </div>
                  </td>
                  <td className="p-4 align-top">
                    <span className={`px-2 py-1 rounded text-xs font-bold border inline-block mb-2 ${
                      app.status === 'PENDING' ? 'bg-slate-100 text-slate-600 border-slate-200' : 
                      app.status === 'APPROVED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {app.status}
                    </span>
                    {app.shippingCode && <div className="text-[10px] text-slate-500 font-mono bg-slate-100 p-1 rounded border border-slate-200">
                        <Truck size={10} className="inline mr-1"/>{app.shippingCode}
                    </div>}
                  </td>
                  <td className="p-4 text-right align-top">
                    <div className="flex justify-end gap-2 flex-wrap">
                        {/* 1. Nút Duyệt (Chỉ khi Pending) */}
                        {app.status === 'PENDING' && (
                            <button 
                                onClick={() => handleApprove(app.id)} 
                                disabled={loadingApprove === app.id} 
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold text-xs shadow-sm flex items-center gap-1"
                            >
                                {loadingApprove === app.id ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Duyệt
                            </button>
                        )}

                        {/* 2. Nút Giao hàng (Khi đã Duyệt) */}
                        {app.status === 'APPROVED' && (
                            <button 
                                onClick={() => handleUpdateShipping(app.id)} 
                                disabled={loadingApprove === app.id} 
                                className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold text-xs shadow-sm flex items-center gap-1"
                            >
                                <Truck size={14}/> Giao hàng
                            </button>
                        )}
                        
                        {/* 3. Nút Chat (Khi đã duyệt trở đi) */}
                        {['APPROVED', 'SHIPPING', 'RECEIVED', 'SUBMITTED', 'COMPLETED'].includes(app.status) && (
                            <button 
                                onClick={() => setChattingAppId(app.id)} 
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors bg-white border border-slate-200" 
                                title="Chat với KOL"
                            >
                                <MessageSquare size={16} />
                            </button>
                        )}

                        {/* 4. Nút Nghiệm thu (Khi đã nộp bài) */}
                        {app.status === 'SUBMITTED' && (
                             <button 
                                onClick={() => setReviewingAppId(app.id)} 
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-xs shadow-sm flex items-center gap-1"
                            >
                                <Star size={12} className="fill-white"/> Nghiệm thu
                            </button>
                        )}
                        
                        {/* 5. Nút Xem chi tiết (Luôn hiện nếu đã duyệt) */}
                        {['APPROVED', 'SHIPPING', 'RECEIVED', 'SUBMITTED', 'COMPLETED'].includes(app.status) && (
                             <Link href={`/my-jobs/${app.id}`} target="_blank" className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors" title="Xem chi tiết đơn">
                                <Eye size={16} />
                             </Link>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {applicants.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400">Chưa có ứng viên nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {chattingAppId && (
            <div className="fixed bottom-4 right-4 w-96 z-50 shadow-2xl animate-fade-in-up">
                <div className="relative">
                    <button 
                        onClick={() => { setChattingAppId(null); router.replace(`/brand/campaigns/${id}`); }} 
                        className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors shadow-md"
                    >
                        <X size={16}/>
                    </button>
                    {/* Truyền Partner Name & Avatar vào ChatBox */}
                    <ChatBox 
                        applicationId={chattingAppId} 
                        currentUserId={userId} 
                        partnerName={applicants.find(a => a.id === chattingAppId)?.kol.fullName || 'KOL'} 
                        partnerAvatar={applicants.find(a => a.id === chattingAppId)?.kol.avatar}
                    />
                </div>
            </div>
        )}
      </div>

      {reviewingAppId && (
        <ReviewModal 
          applicationId={reviewingAppId} 
          onClose={() => setReviewingAppId(null)} 
          onSuccess={() => { setReviewingAppId(null); fetchApplicants(); }} 
        />
      )}
    </DashboardLayout>
  );
}
