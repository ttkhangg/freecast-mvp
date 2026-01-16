'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { toast } from 'sonner';
import { Truck, CheckCircle, Link as LinkIcon, Gift, Award, Package, Clock, ExternalLink, MapPin, Phone, User, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center text-yellow-800 text-sm mt-4">
              <Lock className="w-4 h-4 mr-2" />
              <span>Thông tin liên hệ của KOL được bảo mật. Hãy <b>Duyệt đơn</b> để xem.</span>
          </div>
      )
  }

  if (application.status !== 'APPROVED' && application.status !== 'COMPLETED') return null;

  const step1_shipped = !!application.trackingCode;
  const step2_received = application.isProductReceived;
  const step3_submitted = !!application.submissionLink;
  const step4_completed = application.status === 'COMPLETED';

  const TimelineStep = ({ active, completed, icon: Icon, title, children, last = false }: any) => (
    <div className="relative pl-10 pb-8">
      {!last && <div className={cn("absolute left-[15px] top-10 bottom-0 w-0.5 transition-colors duration-500", completed ? "bg-green-500" : "bg-gray-200")} />}
      <div className={cn("absolute left-0 top-0 h-8 w-8 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-all shadow-sm", completed ? "border-green-500 text-green-500 bg-green-50" : active ? "border-primary text-primary ring-4 ring-primary/20" : "border-gray-300 text-gray-300")}>
        {completed ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
      </div>
      <div>
        <h4 className={cn("font-bold text-sm mb-2 uppercase tracking-wide", completed ? "text-green-700" : active ? "text-gray-900" : "text-gray-400")}>{title}</h4>
        <div className="text-sm text-gray-600">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm mt-4 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Gift className="mr-2 h-5 w-5 text-primary" /> Tiến độ hợp tác
        </h3>
        <Badge variant={step4_completed ? "success" : "secondary"}>
            {step4_completed ? "Đã hoàn thành" : "Đang thực hiện"}
        </Badge>
      </div>

      <div className="ml-2">
        <TimelineStep active={!step1_shipped} completed={step1_shipped} icon={Truck} title="1. Gửi sản phẩm">
          {isBrand && !step1_shipped && (
            <div className="bg-blue-50 p-3 rounded mb-3 border border-blue-100 text-sm">
               <p className="font-semibold text-blue-800 mb-1 flex items-center"><User className="w-3 h-3 mr-1"/> Thông tin người nhận:</p>
               <div className="pl-4 space-y-1 text-blue-700">
                   <p>{application.kol.fullName}</p>
                   <p className="flex items-center"><Phone className="w-3 h-3 mr-2"/> {application.kol.phone || 'Chưa cập nhật SĐT'}</p>
                   <p className="flex items-center"><MapPin className="w-3 h-3 mr-2"/> {application.kol.address || 'Chưa cập nhật địa chỉ'}</p>
               </div>
            </div>
          )}
          {step1_shipped ? (
            <div className="flex items-center text-gray-900 font-mono font-bold bg-gray-100 px-3 py-1.5 rounded w-fit border border-gray-200">
              <Package className="mr-2 h-4 w-4 text-gray-500"/> {application.trackingCode}
            </div>
          ) : (
            isBrand ? (
              <div className="flex gap-2 max-w-sm">
                <Input placeholder="Mã vận đơn..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="h-9 bg-white" />
                <Button size="sm" disabled={loading || !inputValue} onClick={() => handleAction(`/campaigns/application/${application.id}/tracking`, { trackingCode: inputValue }, 'Đã cập nhật')}>Xác nhận</Button>
              </div>
            ) : <p className="italic text-gray-400 flex items-center"><Clock className="w-3 h-3 mr-1"/> Chờ Brand gửi hàng...</p>
          )}
        </TimelineStep>

        <TimelineStep active={step1_shipped && !step2_received} completed={step2_received} icon={Package} title="2. Nhận hàng">
          {step2_received ? (
            <p className="text-green-600 font-medium flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Đã nhận hàng thành công.</p>
          ) : (
            !isBrand && step1_shipped ? (
              <Button size="sm" variant="outline" disabled={loading} onClick={() => handleAction(`/campaigns/application/${application.id}/receive`, {}, 'Đã nhận hàng')}>
                <CheckCircle className="mr-2 h-4 w-4"/> Xác nhận đã nhận
              </Button>
            ) : <p className="italic text-gray-400">{step1_shipped ? 'Chờ KOL xác nhận...' : 'Chưa gửi hàng'}</p>
          )}
        </TimelineStep>

        <TimelineStep active={step2_received && !step3_submitted} completed={step3_submitted} icon={LinkIcon} title="3. Nộp bài đăng">
          {step3_submitted ? (
            <a href={application.submissionLink} target="_blank" className="text-primary hover:underline font-medium flex items-center bg-indigo-50 p-2 rounded w-fit border border-indigo-100">
              <ExternalLink className="h-4 w-4 mr-2" /> Xem bài review
            </a>
          ) : (
            !isBrand && step2_received ? (
              <div className="flex gap-2 max-w-sm">
                <Input placeholder="Link bài viết..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="h-9 bg-white" />
                <Button size="sm" disabled={loading || !inputValue} onClick={() => handleAction(`/campaigns/application/${application.id}/submit`, { link: inputValue }, 'Đã nộp bài')}>Nộp</Button>
              </div>
            ) : <p className="italic text-gray-400">{step2_received ? 'Chờ KOL nộp bài...' : 'Chưa nhận hàng'}</p>
          )}
        </TimelineStep>

        <TimelineStep active={step3_submitted && !step4_completed} completed={step4_completed} icon={Award} title="4. Hoàn tất & Đánh giá" last={true}>
          {step4_completed ? (
            <div className="space-y-4">
               <div className="text-green-700 font-bold bg-green-50 px-4 py-3 rounded-lg border border-green-200 shadow-sm flex items-center">
                 <Award className="mr-2 h-5 w-5"/> Hợp tác thành công!
               </div>
               {!myReview ? (
                   <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm animate-in fade-in">
                      <h5 className="font-bold text-yellow-800 mb-2 text-sm uppercase">Đánh giá đối tác</h5>
                      <div className="mb-3"><StarRating rating={rating} onRatingChange={setRating} size="lg" /></div>
                      <Input placeholder="Viết nhận xét..." value={comment} onChange={(e) => setComment(e.target.value)} className="mb-2 bg-white" />
                      <Button onClick={handleSubmitReview} disabled={loading || rating === 0} size="sm">Gửi đánh giá</Button>
                   </div>
               ) : (
                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                       <p className="text-sm text-gray-600 font-medium mb-1">Đánh giá của bạn:</p>
                       <StarRating rating={myReview.rating} readonly size="sm" />
                       <p className="text-sm text-gray-500 mt-1 italic">"{myReview.comment}"</p>
                   </div>
               )}
            </div>
          ) : (
            isBrand && step3_submitted ? (
              <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-md" disabled={loading} onClick={() => handleAction(`/campaigns/application/${application.id}/complete`, {}, 'Hoàn tất')}>
                <CheckCircle className="mr-2 h-4 w-4"/> Duyệt bài & Thanh toán
              </Button>
            ) : <p className="italic text-gray-400">Chờ hoàn tất...</p>
          )}
        </TimelineStep>
      </div>
    </div>
  );
}