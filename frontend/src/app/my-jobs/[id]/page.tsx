'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import Countdown from '@/components/Countdown';
import { Package, Copy, ArrowLeft, CheckCircle2, ExternalLink, AlertCircle, Loader2, Star, Quote, MessageSquarePlus, X } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import ReviewModal from '@/components/ReviewModal';
import ChatBox from '@/components/ChatBox';
import { jwtDecode } from "jwt-decode";
import VerifiedBadge from '@/components/VerifiedBadge';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [userId, setUserId] = useState('');
  
  // State cho Modal đánh giá Brand
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [kolRating, setKolRating] = useState(5);
  const [kolReview, setKolReview] = useState('');

  // State Chat (Toggle hiển thị)
  const [showChat, setShowChat] = useState(false);

  const fetchJob = () => {
    api.get(`/campaigns/application/${id}`)
      .then(res => setJob(res.data))
      .catch(err => alert("Không tải được thông tin đơn hàng"));
  };

  useEffect(() => { 
    const token = Cookies.get('token');
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            setUserId(decoded.sub);
        } catch (error) {}
    }
    fetchJob(); 
  }, [id]);

  const handleAction = async (action: 'receive' | 'submit') => {
    if (action === 'submit' && !link) return alert("Vui lòng điền link bài viết!");
    setLoading(true);
    try {
      if (action === 'receive') {
        await api.patch(`/campaigns/application/${id}/receive`);
      } else {
        await api.patch(`/campaigns/application/${id}/submit`, { link, note: 'Đã hoàn thành' });
      }
      alert('Cập nhật thành công!');
      fetchJob();
    } catch (err) {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReviewBrand = async () => {
    try {
      await api.patch(`/campaigns/application/${id}/kol-review`, { rating: kolRating, review: kolReview });
      alert("Cảm ơn bạn đã đánh giá Brand!");
      setShowReviewModal(false);
      fetchJob();
    } catch (err) {
      alert("Lỗi khi gửi đánh giá");
    }
  };

  if (!job) return (
    <DashboardLayout>
       <div className="flex items-center justify-center h-64">
         <Loader2 className="animate-spin text-indigo-600 h-8 w-8"/>
       </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-20">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
           <Link href="/my-jobs" className="hover:text-indigo-600 transition-colors">Việc của tôi</Link>
           <span>/</span>
           <span className="text-slate-900 font-bold truncate max-w-[200px]">{job.campaign.title}</span>
        </div>

        {/* 1. Header Card (CÓ AVATAR BRAND) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-5">
              {/* Avatar Brand */}
              <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 overflow-hidden shadow-md flex items-center justify-center shrink-0">
                  {job.campaign.brand.logo ? (
                      <img src={job.campaign.brand.logo} alt="Brand Logo" className="w-full h-full object-cover" />
                  ) : (
                      <span className="font-bold text-indigo-600 text-2xl">{job.campaign.brand.companyName?.[0]}</span>
                  )}
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block ${
                    job.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                    job.status === 'SHIPPING' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {job.id.slice(0,8)}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 leading-tight">{job.campaign.title}</h1>
                <div className="flex items-center gap-2">
                    <p className="text-slate-500 font-medium text-sm">Brand:</p>
                    <span className="text-indigo-600 font-bold flex items-center gap-1">
                        {job.campaign.brand.companyName}
                        {job.campaign.brand.user?.isVerified && <VerifiedBadge />}
                    </span>
                </div>
              </div>
            </div>
            {job.campaign.deadline && <Countdown deadline={job.campaign.deadline} />}
          </div>
        </div>

        {/* 2. Progress Bar */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-6">
          <h3 className="font-bold text-slate-900 mb-6 text-lg">Tiến độ công việc</h3>
          <ProgressBar status={job.status} />
        </div>

        {/* 3. Action Zone */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
           {/* Cột trái: Vận chuyển */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Package size={20} className="text-indigo-600"/> Thông tin giao hàng
              </h3>
              {job.shippingCode ? (
                <div className="space-y-4 flex-1">
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-xs text-slate-400 uppercase font-bold mb-1">Đơn vị vận chuyển</p>
                     <p className="font-bold text-slate-900">{job.carrier || 'Không xác định'}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                     <div>
                       <p className="text-xs text-slate-400 uppercase font-bold mb-1">Mã vận đơn</p>
                       <p className="font-bold text-slate-900 text-lg tracking-wide font-mono">{job.shippingCode}</p>
                     </div>
                     <button 
                       onClick={() => { navigator.clipboard.writeText(job.shippingCode); alert("Đã copy!"); }}
                       className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                     >
                       <Copy size={20}/>
                     </button>
                   </div>

                   {job.status === 'SHIPPING' && (
                    <button 
                      onClick={() => handleAction('receive')} 
                      disabled={loading} 
                      className="w-full mt-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                    >
                      {loading ? <Loader2 className="animate-spin"/> : <><CheckCircle2 size={18}/> Xác nhận đã nhận hàng</>}
                    </button>
                   )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex-1 flex flex-col justify-center items-center">
                  <Package size={32} className="mb-2 opacity-50"/>
                  <p>Đang chờ cập nhật mã vận đơn</p>
                </div>
              )}
           </div>

          {/* Cột phải: Nộp bài & Kết quả Review */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ExternalLink size={20} className="text-emerald-600"/> Kết quả công việc
              </h3>
              
              {/* Logic Nộp bài */}
              {job.status === 'RECEIVED' && (
                 <div className="space-y-4 flex-1">
                    <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-xl flex gap-3 border border-yellow-100">
                      <AlertCircle size={20} className="shrink-0"/>
                      <div>Hãy đảm bảo link bài viết ở chế độ <strong>Công khai</strong>.</div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Link bài viết (TikTok/FB/Youtube)</label>
                      <input 
                        type="text" 
                        placeholder="https://..." 
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 bg-white"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => handleAction('submit')}
                      disabled={loading}
                      className="w-full mt-auto py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200"
                    >
                      {loading ? 'Đang gửi...' : 'Gửi bài duyệt'}
                    </button>
                 </div>
              )}

              {job.status === 'SUBMITTED' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-bold text-blue-900 text-lg mb-1">Đã nộp bài!</h4>
                  <a href={job.contentLink} target="_blank" className="text-blue-600 text-sm mb-4 hover:underline break-all block max-w-full px-4">
                    {job.contentLink}
                  </a>
                  <p className="text-slate-500 text-sm">Vui lòng chờ Brand nghiệm thu và thanh toán.</p>
                </div>
              )}

              {job.status === 'COMPLETED' && (
                <div className="flex-1 flex flex-col gap-4">
                  {/* Review của Brand */}
                  <div className="p-5 bg-green-50/30 rounded-xl border border-green-100 relative">
                     <Quote size={24} className="absolute top-2 right-2 text-green-200" />
                     <p className="text-xs text-slate-500 uppercase font-bold mb-2">Brand đánh giá bạn:</p>
                     <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <Star key={star} size={16} className={star <= (job.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                        ))}
                     </div>
                     <p className="text-slate-700 text-sm italic">"{job.review || 'Không có lời nhắn'}"</p>
                  </div>

                  {/* Review của KOL */}
                  {!job.kolRating ? (
                    <button 
                      onClick={() => setShowReviewModal(true)}
                      className="w-full py-3 border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquarePlus size={18}/> Đánh giá lại Brand
                    </button>
                  ) : (
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                       <p className="text-xs text-slate-500 uppercase font-bold mb-2">Bạn đã đánh giá Brand:</p>
                       <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                             <Star key={star} size={14} className={star <= (job.kolRating || 0) ? "fill-orange-400 text-orange-400" : "text-slate-200"} />
                          ))}
                       </div>
                       <p className="text-slate-600 text-sm">"{job.kolReview}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
        
        {/* 4. Chat Button & Box (Fixed Bottom Right) */}
        {['APPROVED', 'SHIPPING', 'RECEIVED', 'SUBMITTED', 'COMPLETED'].includes(job.status) && userId && (
          <div className="fixed bottom-6 right-6 z-50">
             {!showChat ? (
               <button 
                 onClick={() => setShowChat(true)}
                 className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform animate-bounce"
               >
                 <MessageSquarePlus size={24} />
               </button>
             ) : (
               <div className="w-80 md:w-96 shadow-2xl animate-fade-in-up relative">
                  <button 
                    onClick={() => setShowChat(false)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 shadow-md"
                  >
                    <X size={16}/>
                  </button>
                  {/* Truyền Partner Name & Avatar */}
                  <ChatBox 
                    applicationId={id as string} 
                    currentUserId={userId} 
                    partnerName={job.campaign.brand.companyName || 'Brand'} 
                    partnerAvatar={job.campaign.brand.logo} // NEW: Truyền Avatar
                  />
               </div>
             )}
          </div>
        )}

      </div>

      {/* Modal Review */}
      {showReviewModal && (
        <ReviewModal 
          applicationId={id as string} 
          onClose={() => setShowReviewModal(false)} 
          onSuccess={() => { setShowReviewModal(false); fetchJob(); }} 
        />
      )}
    </DashboardLayout>
  );
}
