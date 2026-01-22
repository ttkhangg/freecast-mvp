'use client';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '@/utils/api';
import { Send, User } from 'lucide-react';

interface ChatBoxProps {
  applicationId: string;
  currentUserId: string;
  partnerName: string;
  partnerAvatar?: string | null;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';

export default function ChatBox({ applicationId, currentUserId, partnerName, partnerAvatar }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/chat/${applicationId}`).then(res => setMessages(res.data)).catch(console.error);

    if (!SOCKET_URL) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const newSocket = io(SOCKET_URL, {
        path: '/socket.io',
        transports: ['websocket'],
        auth: { token: `Bearer ${token}` },
        reconnection: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
        newSocket.emit('joinRoom', { applicationId });
    });

    newSocket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => { newSocket.disconnect(); };
  }, [applicationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;
    
    // Optimistic UI
    const tempMsg = {
        id: Date.now().toString(),
        content: input,
        senderId: currentUserId,
        createdAt: new Date().toISOString(),
        sender: { id: currentUserId } 
    };
    setMessages(prev => [...prev, tempMsg]);
    
    socket.emit('sendMessage', {
      applicationId,
      content: input
    });
    
    setInput('');
  };

  // TECH DEBT #5: Fix Responsive Height
  // Thay vì fix cứng 500px, dùng h-[80vh] cho mobile và h-[500px] cho desktop
  // Thêm max-h để tránh tràn viewport trên màn hình nhỏ
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col h-[80vh] md:h-[500px] w-full animate-fade-in-up overflow-hidden max-h-[85vh]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-indigo-600 text-white flex items-center gap-3 shadow-sm shrink-0">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-400 shrink-0">
            {partnerAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={partnerAvatar} alt="Partner" className="w-full h-full object-cover" />
            ) : (
                <span className="font-bold text-indigo-600 text-lg">{partnerName.charAt(0).toUpperCase()}</span>
            )}
        </div>
        <div className="min-w-0">
            <p className="font-bold text-sm truncate">{partnerName}</p>
            <p className="text-[10px] opacity-90 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span> Đang hoạt động
            </p>
        </div>
      </div>

      {/* Messages Area - Sử dụng flex-1 để chiếm toàn bộ khoảng trống còn lại */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);

          return (
            <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
              {!isMe && (
                 <div className={`w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 mt-1 ${!showAvatar ? 'invisible' : ''}`}>
                    {partnerAvatar ? <img src={partnerAvatar} className="w-full h-full object-cover" alt=""/> : <User size={16} className="m-1 text-slate-400"/>}
                 </div>
              )}
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                 <div className={`p-3 rounded-2xl text-sm shadow-sm break-words ${
                    isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                 }`}>
                    {msg.content}
                 </div>
                 <span className="text-[10px] text-slate-300 mt-1 mx-1">
                    {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                 </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Footer Input - Shrink 0 để không bị co lại khi bàn phím ảo hiện lên (trên một số thiết bị) */}
      <div className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 transition-all focus:bg-white text-sm"
        />
        <button onClick={handleSend} disabled={!input.trim()} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 shrink-0">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}