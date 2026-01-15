'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
  id: string;
  content: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export default function NotificationBell() {
  const { token, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // 1. Fetch Notifications ban đầu
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => await api.get('/notifications'),
    enabled: !!token,
  });

  // 2. Realtime Socket
  useEffect(() => {
    if (!token || !user) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001', {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('joinNotificationChannel');
    });

    socket.on('newNotification', (newNotif: Notification) => {
      // Toast nhỏ góc màn hình
      toast.info(newNotif.content);
      
      // Update Cache ngay lập tức
      queryClient.setQueryData(['notifications'], (old: Notification[] = []) => {
        return [newNotif, ...old];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user, queryClient]);

  // 3. Mark Read Logic
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">View notifications</span>
        <Bell className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Thông báo</span>
            {unreadCount > 0 && (
              <button 
                className="text-xs text-indigo-600 hover:underline"
                onClick={async () => {
                  await api.patch('/notifications/read-all');
                  queryClient.invalidateQueries({ queryKey: ['notifications'] });
                }}
              >
                Đọc tất cả
              </button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Không có thông báo nào.
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                className={cn(
                  "px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors",
                  !notif.isRead ? "bg-indigo-50/50" : ""
                )}
              >
                <p className={cn("text-sm", !notif.isRead ? "text-gray-900 font-medium" : "text-gray-600")}>
                  {notif.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notif.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}