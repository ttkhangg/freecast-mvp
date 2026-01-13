'use client';
import { useState } from 'react';
import { Star, X } from 'lucide-react';
import api from '@/utils/api';

interface ReviewModalProps {
  applicationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ applicationId, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!review.trim()) return alert("Vui lòng viết nhận xét");
    setLoading(true);
    try {
      await api.patch(`/campaigns/application/${applicationId}/review`, { rating, review });
      alert("Đánh giá thành công!");
      onSuccess();
    } catch (err) {
      alert("Lỗi khi gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-fade-in-up shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900">Đánh giá Hiệu quả</h3>
          <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110 focus:outline-none">
              <Star size={32} className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
            </button>
          ))}
        </div>

        <textarea
          className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 mb-4 h-32 resize-none"
          placeholder="Viết nhận xét về chất lượng công việc của KOL..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : "Hoàn tất & Gửi đánh giá"}
        </button>
      </div>
    </div>
  );
}
