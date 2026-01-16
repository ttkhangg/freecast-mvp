'use client';

import { useState } from 'react';
// Sử dụng relative path
import api from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { StarRating } from './ui/star-rating';
import { toast } from 'sonner';
import { Truck, CheckCircle, Link as LinkIcon, Gift, Award, Package, Clock, ExternalLink, MapPin, Phone, User, Lock, Send, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

interface Props {
  application: any; 
  isBrand: boolean;
  onRefresh: () => void;
}

export default function BookingManager({ application, isBrand, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleAction = async (url: string, body: any = {}, successMsg: string) => {
    setLoading(true);
    try {
      await api.patch(url, body);
      toast.success(successMsg);
      onRefresh();
      setInputValue('');
    } catch (e: any) { toast.error(e.message || 'Lỗi'); }
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) return toast.error('Vui lòng chọn số sao');
    setLoading(true);
    try {
      await api.post('/reviews', { applicationId: application.id, rating, comment });
      toast.success('Đã gửi đánh giá!');
      onRefresh();
    } catch (e: any) { toast.error(e.message || 'Lỗi gửi review'); }
    setLoading(false);
  };

  const myReview = application.reviews?.find((r: any) => r.authorId === user?.id);

  if (application.status === 'PENDING' && isBrand) {
      return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-center justify-center text-yellow-800 text-sm font-medium shadow-sm">
              <Lock className="w-5 h-5 mr-2 text-yellow-600" />
              <span>Thông tin liên hệ được bảo mật. Vui lòng <b>Duyệt đơn</b> để bắt đầu hợp tác.</span>
          </div>
      )
  }

  if (application.status !== 'APPROVED' && application.status !== 'COMPLETED') return null;

  const step1_shipped = !!application.trackingCode;
  const step2_received = application.isProductReceived;
  const step3_submitted = !!application.submissionLink;
  const step4_completed = application.status === 'COMPLETED';

  const StepIndicator = ({ active, completed, icon: Icon, title, children, last }: any) => (
    <div className="relative pl-12 pb-8 last:pb-0">
      {/* Line */}
      {!last && (
        <div className={cn(
            "absolute left-[19px] top-10 bottom-0 w-0.5 transition-colors duration-500",
            completed ? "bg-green-500" : "bg-slate-200"
        )} />
      )}
      
      {/* Circle Icon */}
      <div className={cn(
          "absolute left-0 top-0 h-10 w-10 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-all shadow-sm", 
          completed ? "border-green-500 text-white bg-green-500" : 
          active ? "border-indigo-600 text-indigo-600 ring-4 ring-indigo-50" : 
          "border-slate-200 text-slate-300"
      )}>
        {completed ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </div>

      {/* Content */}
      <div className={cn("transition-opacity duration-300", active || completed ? "opacity-100" : "opacity-50 blur-[0.5px]")}>
        <h4 className={cn("font-bold text-sm mb-2 uppercase tracking-wide flex items-center", completed ? "text-green-700" : active ? "text-indigo-900" : "text-slate-400")}>
            {title}
            {completed && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full normal-case">Hoàn thành</span>}
        </h4>
        <div className="text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="space-y-0">
        
        {/* STEP 1: SHIP */}
        <StepIndicator active={!step1_shipped} completed={step1_shipped} icon={Truck} title="1. Gửi sản phẩm">
          {isBrand && !step1_shipped ? (
            <div className="space-y-3">
               <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-sm">
                   <p className="font-semibold text-blue-800 mb-2 flex items-center"><User className="w-3 h-3 mr-1"/> Gửi đến:</p>
                   <div className="pl-4 space-y-1 text-slate-700">
                       <p className="font-medium">{application.kol.fullName}</p>
                       <p className="flex items-center text-xs text-slate-500"><Phone className="w-3 h-3 mr-1"/> {application.kol.phone || 'Chưa cập nhật SĐT'}</p>
                       <p className="flex items-center text-xs text-slate-500"><MapPin className="w-3 h-3 mr-1"/> {application.kol.address || 'Chưa cập nhật địa chỉ'}</p>
                   </div>
               </div>
               <div className="flex gap-2">
                <Input placeholder="Nhập mã vận đơn..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-white h-10" />
                <Button disabled={loading || !inputValue} onClick={() => handleAction(`/campaigns/application/${application.id}/tracking`, { trackingCode: inputValue }, 'Đã cập nhật')} className="bg-indigo-600 hover:bg-indigo-700">
                    Gửi hàng <Send className="w-4 h-4 ml-1"/>
                </Button>
              </div>
            </div>
          ) : step1_shipped ? (
            <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600"/>
                <span className="font-mono font-bold text-lg text-slate-900">{application.trackingCode}</span>
                <span className="text-xs text-slate-400 ml-auto">Đã cập nhật mã</span>
            </div>
          ) : (
            <p className="italic text-slate-400 flex items-center"><Clock className="w-4 h-4 mr-1"/> Brand đang chuẩn bị hàng...</p>
          )}
        </StepIndicator>

        {/* STEP 2: RECEIVE */}
        <StepIndicator active={step1_shipped && !step2_received} completed={step2_received} icon={Gift} title="2. Nhận hàng">
          {!isBrand && step1_shipped && !step2_received ? (
              <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md" disabled={loading} onClick={() => handleAction(`/campaigns/application/${application.id}/receive`, {}, 'Đã nhận hàng')}>
                <CheckCircle className="mr-2 h-5 w-5"/> Xác nhận đã nhận được quà
              </Button>
          ) : step2_received ? (
              <p className="text-green-600 font-medium flex items-center"><CheckCircle className="w-4 h-4 mr-2"/> KOL đã nhận được sản phẩm.</p>
          ) : (
              <p className="italic text-slate-400">Chờ hàng được giao đến...</p>
          )}
        </StepIndicator>

        {/* STEP 3: SUBMIT */}
        <StepIndicator active={step2_received && !step3_submitted} completed={step3_submitted} icon={LinkIcon} title="3. Nộp bài đăng">
           {step3_submitted ? (
            <div className="flex items-center justify-between">
                <a href={application.submissionLink} target="_blank" className="text-indigo-600 hover:underline font-bold flex items-center truncate max-w-[200px] md:max-w-xs">
                    <ExternalLink className="h-4 w-4 mr-2" /> Xem bài review
                </a>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Đã nộp</span>
            </div>
          ) : !isBrand && step2_received ? (
            <div className="flex gap-2">
                <Input placeholder="Dán link bài viết (TikTok/FB)..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-white h-10" />
                <Button disabled={loading || !inputValue} onClick={() => handleAction(`/campaigns/application/${application.id}/submit`, { link: inputValue }, 'Đã nộp bài')} className="bg-pink-600 hover:bg-pink-700 text-white">
                    Nộp bài
                </Button>
            </div>
          ) : (
             <p className="italic text-slate-400">Chờ KOL trải nghiệm và lên bài...</p>
          )}
        </StepIndicator>

        {/* STEP 4: COMPLETE */}
        <StepIndicator active={step3_submitted && !step4_completed} completed={step4_completed} icon={Award} title="4. Hoàn tất & Đánh giá" last={true}>
           {step4_completed ? (
             <div className="space-y-4">
                {!myReview ? (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
                       <h5 className="font-bold text-yellow-800 mb-2 text-sm uppercase flex items-center"><Award className="w-4 h-4 mr-1"/> Đánh giá đối tác</h5>
                       <div className="mb-3 flex justify-center"><StarRating rating={rating} onRatingChange={setRating} size="lg" /></div>
                       <Input placeholder="Nhận xét của bạn..." value={comment} onChange={(e) => setComment(e.target.value)} className="mb-3 bg-white" />
                       <Button onClick={handleSubmitReview} disabled={loading || rating === 0} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Gửi đánh giá</Button>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-2">Đánh giá của bạn</p>
                        <div className="flex items-center gap-2 mb-1">
                            <StarRating rating={myReview.rating} readonly size="sm" />
                            <span className="font-bold text-slate-700">{myReview.rating}/5</span>
                        </div>
                        <p className="text-sm text-slate-600 italic">"{myReview.comment}"</p>
                    </div>
                )}
             </div>
           ) : isBrand && step3_submitted ? (
             <div className="text-center">
                 <p className="text-slate-600 mb-3 text-sm">Hãy kiểm tra bài đăng của KOL trước khi hoàn tất.</p>
                 <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200" disabled={loading} onClick={() => handleAction(`/campaigns/application/${application.id}/complete`, {}, 'Hoàn tất')}>
                    <CheckCircle className="mr-2 h-5 w-5"/> Duyệt bài & Thanh toán
                 </Button>
             </div>
           ) : (
             <p className="italic text-slate-400">Chờ các bước trên hoàn tất...</p>
           )}
        </StepIndicator>

      </div>
    </div>
  );
}