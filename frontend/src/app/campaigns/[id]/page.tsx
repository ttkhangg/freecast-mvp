'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useParams, useRouter } from 'next/navigation';
import { Building2, DollarSign, Calendar, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Countdown from '@/components/Countdown';
import Cookies from 'js-cookie';
import VerifiedBadge from '@/components/VerifiedBadge';

export default function CampaignDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = Cookies.get('role');
    if (role) setUserRole(role);

    api.get(`/campaigns/${id}`)
      .then(res => setCampaign(res.data))
      .catch(err => {
        console.error("Lỗi tải campaign:", err);
        setError(err.response?.data?.message || 'Không tìm thấy chiến dịch.');
      });

    if (role === 'KOL') {
        api.get('/campaigns/my-jobs').then(res => {
            const myJobs = res.data;
            const isApplied = myJobs.some((job: any) => job.campaignId === id);
            setHasApplied(isApplied);
        }).catch(() => {});
    }
  }, [id]);

  const handleApply = async () => {
    setLoading(true);
    try {
      await api.post(`/campaigns/${id}/apply`);
      alert('Ứng tuyển thành công! Vui lòng chờ Brand duyệt.');
      router.push('/my-jobs');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Lỗi ứng tuyển';
      if (message.includes('cập nhật') || message.includes('địa chỉ') || message.includes('điện thoại')) {
          if(confirm("Bạn cần cập nhật thông tin liên hệ để ứng tuyển. Đi đến trang Hồ sơ ngay?")) {
              router.push('/profile');
          }
      } else {
          alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4"/>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Đã xảy ra lỗi</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <Link href="/dashboard" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
                Về Dashboard
            </Link>
        </div>
    </div>
  );

  if (!campaign) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center font-sans">
      <div className="max-w-4xl w-full">
        <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform"/> Quay lại Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
          
          <div className="relative bg-slate-900">
             {campaign.productImage && (
               <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={campaign.productImage} alt={campaign.productName} className="w-full h-full object-cover opacity-30 blur-sm scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
               </div>
             )}

             <div className="p-8 md:p-10 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {campaign.productImage && (
                        <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={campaign.productImage} alt={campaign.productName} className="w-full h-full object-cover" />
                        </div>
                    )}
                    
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                                campaign.platform === 'TikTok' ? 'bg-black text-white border-white/20' : 
                                campaign.platform === 'YouTube' ? 'bg-red-600 text-white border-white/20' : 
                                'bg-white/10 text-white border-white/20'
                            }`}>
                                {campaign.platform}
                            </span>
                            <span className="text-xs font-mono text-slate-400">ID: {campaign.id.slice(0,8)}</span>
                        </div>
                        
                        <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight text-white">{campaign.title}</h1>
                        
                        <div className="flex items-center gap-3">
                           {/* --- FIX: HIỂN THỊ LOGO BRAND --- */}
                           <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0 border border-white/20">
                              {campaign.brand?.logo ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={campaign.brand.logo} alt="Brand Logo" className="w-full h-full object-cover"/>
                              ) : (
                                  <span className="font-bold text-indigo-600">{campaign.brand?.companyName?.[0]}</span>
                              )}
                           </div>
                           
                           <div>
                               <div className="font-bold text-white flex items-center gap-2 text-sm md:text-base">
                                   {campaign.brand?.companyName} 
                                   {campaign.brand?.user?.isVerified && <VerifiedBadge />}
                               </div>
                               <p className="text-xs text-slate-400">
                                   {campaign.brand?.user?.isVerified ? 'Đã xác thực doanh nghiệp' : 'Chưa xác thực'}
                               </p>
                           </div>
                        </div>
                    </div>
                </div>
             </div>
             
             {!campaign.productImage && <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>}
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
               <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col justify-center">
                  <p className="text-xs text-emerald-600 font-bold uppercase mb-2">Quyền lợi</p>
                  <p className="text-3xl font-bold text-emerald-900 flex items-center gap-2">
                    <DollarSign size={28} className="text-emerald-600"/> {campaign.productValue}
                  </p>
                  <p className="text-sm text-emerald-700 mt-1 pl-9">Sản phẩm: {campaign.productName}</p>
               </div>
               <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col justify-center">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-2">Hạn nộp hồ sơ</p>
                  <div className="flex items-center gap-3">
                    <Calendar size={28} className="text-blue-600"/> 
                    <div>
                        <p className="text-xl font-bold text-blue-900">
                            {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString('vi-VN') : 'ASAP'}
                        </p>
                        {campaign.deadline && <Countdown deadline={campaign.deadline} />}
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-10 mb-12">
               <div>
                   <h3 className="font-bold text-xl text-slate-900 mb-4 border-l-4 border-indigo-600 pl-4">Mô tả công việc</h3>
                   <div className="text-slate-600 leading-relaxed whitespace-pre-line text-lg bg-slate-50 p-6 rounded-2xl border border-slate-100">
                       {campaign.description}
                   </div>
               </div>
               
               <div>
                   <h3 className="font-bold text-xl text-slate-900 mb-4 border-l-4 border-pink-500 pl-4">Yêu cầu ứng viên</h3>
                   <div className="bg-white border-2 border-dashed border-slate-200 p-6 rounded-2xl">
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{campaign.requirements}</p>
                   </div>
               </div>
            </div>

            <div className="border-t border-slate-100 pt-8 flex flex-col items-center gap-4">
                {userRole === 'KOL' ? (
                    hasApplied ? (
                        <Link href="/my-jobs" className="w-full md:w-auto px-10 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2">
                            <CheckCircle2 /> Xem trạng thái đơn hàng
                        </Link>
                    ) : (
                        <button 
                            onClick={handleApply}
                            disabled={loading}
                            className="w-full md:w-auto bg-indigo-600 text-white font-bold py-4 px-12 rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin"/> : <CheckCircle2 />} 
                            Ứng Tuyển Ngay
                        </button>
                    )
                ) : (
                    <div className="text-slate-500 italic bg-slate-100 px-6 py-3 rounded-full">
                        Đăng nhập với tư cách KOL để ứng tuyển
                    </div>
                )}
                
                {!hasApplied && userRole === 'KOL' && (
                    <p className="text-xs text-slate-400">
                        * Bằng việc ứng tuyển, bạn đồng ý chia sẻ Hồ sơ năng lực (Profile) của mình với nhãn hàng.
                    </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}