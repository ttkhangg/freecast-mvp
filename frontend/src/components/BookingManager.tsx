'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Truck, CheckCircle, Link as LinkIcon, Gift } from 'lucide-react';

interface Props {
  application: any; 
  isBrand: boolean;
  onRefresh: () => void;
}

export default function BookingManager({ application, isBrand, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 1. Brand cập nhật vận đơn
  const handleUpdateTracking = async () => {
    if (!inputValue) return toast.error('Vui lòng nhập mã vận đơn');
    setLoading(true);
    try {
      await api.patch(`/campaigns/application/${application.id}/tracking`, { trackingCode: inputValue });
      toast.success('Đã cập nhật vận đơn');
      onRefresh();
    } catch (e) { toast.error('Lỗi khi cập nhật'); }
    setLoading(false);
  };

  // 2. KOL xác nhận nhận hàng
  const handleConfirmReceived = async () => {
    if (!confirm('Bạn đã nhận được sản phẩm?')) return;
    setLoading(true);
    try {
      await api.patch(`/campaigns/application/${application.id}/receive`);
      toast.success('Đã xác nhận nhận hàng');
      onRefresh();
    } catch (e) { toast.error('Lỗi xử lý'); }
    setLoading(false);
  };

  // 3. KOL nộp bài
  const handleSubmitLink = async () => {
    if (!inputValue) return toast.error('Vui lòng nhập link bài đăng');
    setLoading(true);
    try {
      await api.patch(`/campaigns/application/${application.id}/submit`, { link: inputValue });
      toast.success('Đã nộp bài!');
      onRefresh();
    } catch (e) { toast.error('Lỗi nộp bài'); }
    setLoading(false);
  };

  // 4. Brand hoàn tất
  const handleComplete = async () => {
    if (!confirm('Xác nhận hoàn tất hợp tác?')) return;
    setLoading(true);
    try {
      await api.patch(`/campaigns/application/${application.id}/complete`);
      toast.success('Hợp tác thành công!');
      onRefresh();
    } catch (e) { toast.error('Lỗi hoàn tất'); }
    setLoading(false);
  };

  // Chỉ hiện khi Approved hoặc Completed
  if (application.status !== 'APPROVED' && application.status !== 'COMPLETED') return null;

  return (
    <div className="bg-white p-6 rounded-lg border border-indigo-100 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Gift className="mr-2 h-5 w-5 text-indigo-600" /> Tiến độ hợp tác
      </h3>

      {/* STEP 1: SHIPPING */}
      <div className="mb-6 relative pl-6 border-l-2 border-indigo-100">
        <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full ${application.trackingCode ? 'bg-green-500' : 'bg-gray-300'}`} />
        <h4 className="font-medium text-gray-900">Gửi sản phẩm</h4>
        
        {isBrand && !application.trackingCode && (
          <div className="flex gap-2 mt-2">
            <Input 
              placeholder="Nhập mã vận đơn..." 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              className="h-9 text-sm"
            />
            <Button onClick={handleUpdateTracking} disabled={loading} size="sm"><Truck className="mr-2 h-3 w-3"/> Gửi</Button>
          </div>
        )}
        
        {application.trackingCode && (
          <p className="text-sm text-gray-600 mt-1">Mã vận đơn: <span className="font-mono font-bold">{application.trackingCode}</span></p>
        )}
      </div>

      {/* STEP 2: RECEIVE */}
      {application.trackingCode && (
        <div className="mb-6 relative pl-6 border-l-2 border-indigo-100">
          <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full ${application.isProductReceived ? 'bg-green-500' : 'bg-gray-300'}`} />
          <h4 className="font-medium text-gray-900">Nhận hàng</h4>
          
          {!isBrand && !application.isProductReceived && (
            <Button onClick={handleConfirmReceived} disabled={loading} variant="outline" size="sm" className="mt-2">
              <CheckCircle className="mr-2 h-3 w-3"/> Xác nhận đã nhận hàng
            </Button>
          )}
          {application.isProductReceived && <p className="text-sm text-green-600 mt-1">KOL đã nhận được hàng</p>}
        </div>
      )}

      {/* STEP 3: SUBMIT */}
      {application.isProductReceived && (
        <div className="mb-6 relative pl-6 border-l-2 border-indigo-100">
          <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full ${application.submissionLink ? 'bg-green-500' : 'bg-gray-300'}`} />
          <h4 className="font-medium text-gray-900">Nộp bài đăng</h4>

          {!isBrand && !application.submissionLink && (
            <div className="flex gap-2 mt-2">
              <Input 
                placeholder="Link bài viết (Facebook/TikTok)..." 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                className="h-9 text-sm"
              />
              <Button onClick={handleSubmitLink} disabled={loading} size="sm"><LinkIcon className="mr-2 h-3 w-3"/> Nộp</Button>
            </div>
          )}
          
          {application.submissionLink && (
            <a href={application.submissionLink} target="_blank" className="text-sm text-indigo-600 hover:underline mt-1 block font-medium">
              Xem bài đăng của KOL
            </a>
          )}
        </div>
      )}

      {/* STEP 4: COMPLETE */}
      {application.submissionLink && application.status !== 'COMPLETED' && isBrand && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button onClick={handleComplete} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            Hoàn tất đơn hàng & Đánh giá
          </Button>
        </div>
      )}
      
      {application.status === 'COMPLETED' && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 text-center rounded-md font-bold text-sm">
          Đơn hàng đã hoàn tất!
        </div>
      )}
    </div>
  );
}