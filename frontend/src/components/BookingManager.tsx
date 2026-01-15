'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Truck, CheckCircle, Link as LinkIcon, Gift, Award, Package, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  application: any; 
  isBrand: boolean;
  onRefresh: () => void;
}

export default function BookingManager({ application, isBrand, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // API Actions
  const handleAction = async (url: string, body: any = {}, successMsg: string) => {
    setLoading(true);
    try {
      await api.patch(url, body);
      toast.success(successMsg);
      onRefresh();
      setInputValue('');
    } catch (e: any) { 
      toast.error(e.message || 'Có lỗi xảy ra'); 
    }
    setLoading(false);
  };

  // Chỉ hiện khi đã duyệt (APPROVED) hoặc hoàn tất (COMPLETED)
  if (application.status !== 'APPROVED' && application.status !== 'COMPLETED') return null;

  // Trạng thái các bước
  const step1_shipped = !!application.trackingCode;
  const step2_received = application.isProductReceived;
  const step3_submitted = !!application.submissionLink;
  const step4_completed = application.status === 'COMPLETED';

  // Helper render từng bước
  const TimelineStep = ({ 
    active, completed, icon: Icon, title, children, last = false 
  }: any) => (
    <div className="relative pl-8 pb-8">
      {!last && (
        <div className={cn(
          "absolute left-[11px] top-8 bottom-0 w-0.5 transition-colors duration-500",
          completed ? "bg-green-500" : "bg-gray-200"
        )} />
      )}
      <div className={cn(
        "absolute left-0 top-0 h-6 w-6 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-colors duration-300",
        completed ? "border-green-500 text-green-500" : active ? "border-indigo-600 text-indigo-600" : "border-gray-300 text-gray-300"
      )}>
        {completed ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-3 w-3" />}
      </div>
      <div>
        <h4 className={cn("font-bold text-sm mb-2", completed ? "text-green-700" : active ? "text-gray-900" : "text-gray-400")}>
          {title}
        </h4>
        <div className="text-sm text-gray-600">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50/50 p-6 rounded-xl border border-indigo-100 shadow-inner mt-4">
      <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center uppercase tracking-wider">
        <Gift className="mr-2 h-4 w-4 text-indigo-600" /> Quy trình hợp tác
      </h3>

      <div className="ml-2">
        {/* STEP 1: Gửi hàng (Brand Action) */}
        <TimelineStep 
          active={!step1_shipped} 
          completed={step1_shipped} 
          icon={Truck} 
          title="Gửi sản phẩm"
        >
          {step1_shipped ? (
            <div className="flex items-center text-gray-700 bg-white p-2 rounded border border-gray-200 w-fit">
              <Package className="mr-2 h-4 w-4 text-gray-400"/>
              Mã vận đơn: <span className="font-mono font-bold ml-1">{application.trackingCode}</span>
            </div>
          ) : (
            isBrand ? (
              <div className="flex gap-2 max-w-sm">
                <Input 
                  placeholder="Nhập mã vận đơn (VD: GHN-123)..." 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  className="h-9 bg-white"
                />
                <Button size="sm" disabled={loading || !inputValue} onClick={() => handleAction(`/campaigns/application/${application.id}/tracking`, { trackingCode: inputValue }, 'Đã cập nhật vận đơn')}>
                  Xác nhận gửi
                </Button>
              </div>
            ) : <p className="italic text-gray-400 flex items-center"><Clock className="w-3 h-3 mr-1"/> Chờ Brand gửi hàng...</p>
          )}
        </TimelineStep>

        {/* STEP 2: Nhận hàng (KOL Action) */}
        <TimelineStep 
          active={step1_shipped && !step2_received} 
          completed={step2_received} 
          icon={Package} 
          title="KOL Nhận hàng"
        >
          {step2_received ? (
            <p className="text-green-600 font-medium">Đã nhận hàng thành công.</p>
          ) : (
            !isBrand && step1_shipped ? (
              <Button size="sm" variant="outline" disabled={loading} onClick={() => { if(confirm('Bạn đã nhận được quà?')) handleAction(`/campaigns/application/${application.id}/receive`, {}, 'Đã nhận hàng') }}>
                <CheckCircle className="mr-2 h-3 w-3"/> Xác nhận đã nhận
              </Button>
            ) : <p className="italic text-gray-400">Chờ xác nhận nhận hàng...</p>
          )}
        </TimelineStep>

        {/* STEP 3: Nộp bài (KOL Action) */}
        <TimelineStep 
          active={step2_received && !step3_submitted} 
          completed={step3_submitted} 
          icon={LinkIcon} 
          title="Nộp bài đăng"
        >
          {step3_submitted ? (
            <div className="bg-white p-2 rounded border border-gray-200 w-fit">
              <a href={application.submissionLink} target="_blank" className="text-indigo-600 hover:underline font-medium flex items-center">
                <LinkIcon className="h-3 w-3 mr-2" /> Xem bài review
              </a>
            </div>
          ) : (
            !isBrand && step2_received ? (
              <div className="flex gap-2 max-w-sm">
                <Input 
                  placeholder="Link bài viết (Facebook/TikTok)..." 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  className="h-9 bg-white"
                />
                <Button size="sm" disabled={loading || !inputValue} onClick={() => handleAction(`/campaigns/application/${application.id}/submit`, { link: inputValue }, 'Đã nộp bài')}>Nộp bài</Button>
              </div>
            ) : <p className="italic text-gray-400">Chờ nộp bài review...</p>
          )}
        </TimelineStep>

        {/* STEP 4: Hoàn tất (Brand Action) */}
        <TimelineStep 
          active={step3_submitted && !step4_completed} 
          completed={step4_completed} 
          icon={Award} 
          title="Hoàn tất & Thanh toán" 
          last={true}
        >
          {step4_completed ? (
            <div className="text-green-600 font-bold bg-green-50 px-3 py-2 rounded-md inline-block border border-green-100">
              🎉 Đơn hàng đã hoàn tất!
            </div>
          ) : (
            isBrand && step3_submitted ? (
              <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={loading} onClick={() => { if(confirm('Xác nhận hoàn tất và thanh toán cho KOL?')) handleAction(`/campaigns/application/${application.id}/complete`, {}, 'Hoàn tất đơn hàng') }}>
                <CheckCircle className="mr-2 h-4 w-4"/> Duyệt bài & Thanh toán
              </Button>
            ) : <p className="italic text-gray-400">Chờ hoàn tất...</p>
          )}
        </TimelineStep>
      </div>
    </div>
  );
}