'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { toast } from 'sonner';
import { Truck, CheckCircle, Link as LinkIcon, Gift, Award, Package, Clock, ExternalLink, MapPin, Phone, User, Lock, Send, AlertTriangle } from 'lucide-react';
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
          <Card className="border-warning bg-warning/5">
              <CardContent className="flex items-center justify-center p-6 text-warning-foreground font-medium gap-2">
                  <Lock className="w-5 h-5" />
                  Thông tin liên hệ được bảo mật. Vui lòng duyệt đơn để xem.
              </CardContent>
          </Card>
      )
  }

  if (application.status !== 'APPROVED' && application.status !== 'COMPLETED') return null;

  // State Logic
  const step1_shipped = !!application.trackingCode;
  const step2_received = application.isProductReceived;
  const step3_submitted = !!application.submissionLink;
  const step4_completed = application.status === 'COMPLETED';

  // Component Step con
  const TimelineStep = ({ active, completed, icon: Icon, title, children, last }: any) => (
    <div className="relative pl-10 pb-10 last:pb-0">
      {/* Connector Line */}
      {!last && (
        <div className={cn(
            "absolute left-[19px] top-10 bottom-0 w-0.5 transition-colors duration-500",
            completed ? "bg-green-500" : "bg-border"
        )} />
      )}
      
      {/* Icon Node */}
      <div className={cn(
          "absolute left-0 top-0 h-10 w-10 rounded-full flex items-center justify-center border-2 z-10 bg-background transition-all shadow-sm", 
          completed ? "border-green-500 text-white bg-green-500" : 
          active ? "border-primary text-primary ring-4 ring-primary/10" : 
          "border-border text-muted-foreground"
      )}>
        {completed ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </div>

      {/* Main Content */}
      <div className={cn("transition-all duration-300", active || completed ? "opacity-100" : "opacity-50 grayscale")}>
        <h4 className={cn("font-bold text-sm mb-3 uppercase tracking-wide flex items-center gap-2", completed ? "text-green-600" : active ? "text-foreground" : "text-muted-foreground")}>
            {title}
            {completed && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full normal-case border border-green-200">Hoàn thành</span>}
        </h4>
        
        {/* Step Body */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      
      {/* 1. GỬI HÀNG */}
      <TimelineStep active={!step1_shipped} completed={step1_shipped} icon={Truck} title="1. Gửi sản phẩm">
          {isBrand && !step1_shipped ? (
            <div className="space-y-4">
               <div className="bg-secondary/50 p-4 rounded-lg border border-border text-sm">
                   <p className="font-semibold text-foreground mb-2 flex items-center"><User className="w-3 h-3 mr-1"/> Người nhận:</p>
                   <div className="pl-4 space-y-1 text-muted-foreground">
                       <p className="font-medium text-foreground">{application.kol.fullName}</p>
                       <p className="flex items-center text-xs"><Phone className="w-3 h-3 mr-1"/> {application.kol.phone || 'Chưa cập nhật'}</p>
                       <p className="flex items-center text-xs"><MapPin className="w-3 h-3 mr-1"/> {application.kol.address || 'Chưa cập nhật'}</p>
                   </div>
               </div>
               <div className="flex gap-2">
                <Input placeholder="Nhập mã vận đơn (VD: SPX123...)" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <Button disabled={loading || !inputValue} onClick={() => handleAction(`/campaigns/application/${application.id}/tracking`, { trackingCode: inputValue }, 'Đã cập nhật mã vận đơn')}>
                    Xác nhận gửi <Send className="w-4 h-4 ml-1"/>
                </Button>
              </div>
            </div>
          ) : step1_shipped ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                <div className="p-2 bg-background rounded border"><Package className="w-5 h-5 text-primary"/></div>
                <div>
                    <p className="text-xs text-muted-foreground">Mã vận đơn</p>
                    <p className="font-mono font-bold text-foreground">{application.trackingCode}</p>
                </div>
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground flex items-center"><Clock className="w-4 h-4 mr-1"/> Brand đang chuẩn bị hàng...</p>
          )}
      </TimelineStep>

      {/* 2. NHẬN HÀNG */}
      <TimelineStep active={step1_shipped && !step2_received} completed={step2_received} icon={Gift} title="2. Nhận hàng">
          {!isBrand && step1_shipped && !step2_received ? (
              <div className="space-y-3">
                  <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded border border-blue-100 flex gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Hãy kiểm tra kỹ sản phẩm trước khi xác nhận.
                  </div>
                  <Button size="lg" className="w-full" disabled={loading} onClick={() => handleAction(`/campaigns/application/${application.id}/receive`, {}, 'Đã nhận hàng')}>
                    <CheckCircle className="mr-2 h-5 w-5"/> Tôi đã nhận được hàng
                  </Button>
              </div>
          ) : step2_received ? (
              <p className="text-green-600 font-medium text-sm flex items-center"><CheckCircle className="w-4 h-4 mr-2"/> KOL xác nhận đã nhận hàng.</p>
          ) : (
              <p className="text-sm italic text-muted-foreground">Đang vận chuyển...</p>
          )}
      </TimelineStep>

      {/* 3. NỘP BÀI */}
      <TimelineStep active={step2_received && !step3_submitted} completed={step3_submitted} icon={LinkIcon} title="3. Nộp bài Review">
           {step3_submitted ? (
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <a href={application.submissionLink} target="_blank" className="text-primary hover:underline font-bold flex items-center truncate max-w-[200px] text-sm">
                    <ExternalLink className="h-4 w-4 mr-2" /> Xem bài đăng
                </a>
                <span className="text-xs text-muted-foreground bg-background border px-2 py-1 rounded">Đã nộp</span>
            </div>
          ) : !isBrand && step2_received ? (
            <div className="space-y-3">
                <Input placeholder="Dán link bài viết (TikTok/FB/Youtube)..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <Button disabled={loading || !inputValue} onClick={() => handleAction(`/campaigns/application/${application.id}/submit`, { link: inputValue }, 'Đã nộp bài')} className="w-full">
                    Gửi bài duyệt
                </Button>
            </div>
          ) : (
             <p className="text-sm italic text-muted-foreground">Chờ KOL trải nghiệm và lên bài...</p>
          )}
      </TimelineStep>

      {/* 4. HOÀN TẤT */}
      <TimelineStep active={step3_submitted && !step4_completed} completed={step4_completed} icon={Award} title="4. Nghiệm thu & Đánh giá" last={true}>
           {step4_completed ? (
             <div className="space-y-4">
                {!myReview ? (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-3">
                       <h5 className="font-bold text-amber-800 text-sm uppercase flex items-center"><Award className="w-4 h-4 mr-1"/> Đánh giá đối tác</h5>
                       <div className="flex justify-center py-2"><StarRating rating={rating} onRatingChange={setRating} size="lg" /></div>
                       <Input placeholder="Nhập nhận xét của bạn..." value={comment} onChange={(e) => setComment(e.target.value)} className="bg-white border-amber-200" />
                       <Button onClick={handleSubmitReview} disabled={loading || rating === 0} className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none">Gửi đánh giá</Button>
                    </div>
                ) : (
                    <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                        <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Đánh giá của bạn</p>
                        <div className="flex items-center gap-2 mb-1">
                            <StarRating rating={myReview.rating} readonly size="sm" />
                            <span className="font-bold text-foreground">{myReview.rating}/5</span>
                        </div>
                        <p className="text-sm text-foreground italic">"{myReview.comment}"</p>
                    </div>
                )}
             </div>
           ) : isBrand && step3_submitted ? (
             <div className="text-center space-y-3">
                 <p className="text-muted-foreground text-sm">Hãy kiểm tra kỹ bài đăng của KOL trước khi thanh toán.</p>
                 <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading} onClick={() => handleAction(`/campaigns/application/${application.id}/complete`, {}, 'Hoàn tất đơn hàng')}>
                    <CheckCircle className="mr-2 h-5 w-5"/> Duyệt bài & Thanh toán
                 </Button>
             </div>
           ) : (
             <p className="text-sm italic text-muted-foreground">Chờ các bước trên hoàn tất...</p>
           )}
      </TimelineStep>

    </div>
  );
}