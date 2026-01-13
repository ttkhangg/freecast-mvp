'use client';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      // FIX #10: Đảm bảo parse Date chuẩn và xử lý lỗi
      const end = new Date(deadline).getTime(); 
      const distance = end - now;

      if (isNaN(end)) {
         setTimeLeft("N/A"); 
         return;
      }

      if (distance < 0) {
        setTimeLeft('Đã kết thúc');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setTimeLeft(`${days} ngày ${hours} giờ còn lại`);
    };

    calculateTime(); // Chạy ngay lập tức để không bị delay 1s
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  // Nếu không có thời gian hoặc lỗi, không hiển thị gì
  if (!timeLeft || timeLeft === "N/A") return null;

  return (
    <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-lg text-sm font-bold animate-pulse">
      <Clock size={16} /> {timeLeft}
    </div>
  );
}
