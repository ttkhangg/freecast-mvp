'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import api from '@/utils/api';
import Link from 'next/link';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch thông báo từ API
  const fetchNoti = () => {
    api.get('/auth/notifications')
       .then(res => setNotifications(res.data))
       .catch(() => {});
  };

  useEffect(() => {
    fetchNoti();
    // Polling: Tự động gọi API mỗi 15 giây để cập nhật tin mới (Realtime đơn giản)
    const interval = setInterval(fetchNoti, 15000); 
    
    // Xử lý click outside để đóng dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đếm số tin chưa đọc
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRead = async (noti: any) => {
    if (!noti.isRead) {
      // Gọi API đánh dấu đã đọc (không cần await để UX mượt hơn)
      api.patch(`/auth/notifications/${noti.id}/read`);
      
      // Cập nhật UI ngay lập tức (Optimistic UI)
      setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n));
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-slate-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up origin-top-right">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Thông báo</h3>
            <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-white rounded-lg border border-slate-200">
              {unreadCount} tin mới
            </span>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center">
                <Bell size={32} className="mb-2 opacity-20"/>
                Chưa có thông báo nào
              </div>
            ) : notifications.map(n => (
              <Link 
                href={n.link || '#'} 
                key={n.id}
                onClick={() => handleRead(n)}
                className={`block p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors relative ${!n.isRead ? 'bg-indigo-50/40' : ''}`}
              >
                {!n.isRead && (
                   <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                )}
                <div className="pl-2">
                    <p className={`text-sm mb-1 ${!n.isRead ? 'font-bold text-indigo-900' : 'font-medium text-slate-900'}`}>
                        {n.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-2 text-right">
                        {new Date(n.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
            <button className="text-xs text-indigo-600 font-bold hover:underline">Xem tất cả</button>
          </div>
        </div>
      )}
    </div>
  );
}
