'use client';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '@/utils/api';
import { Send, User } from 'lucide-react';

interface ChatBoxProps {
  applicationId: string;
  currentUserId: string;
  partnerName: string;
  partnerAvatar?: string; // NEW: Thêm prop Avatar
}

export default function ChatBox({ applicationId, currentUserId, partnerName, partnerAvatar }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/chat/${applicationId}`).then(res => setMessages(res.data));

    // LƯU Ý: Đổi thành process.env.NEXT_PUBLIC_API_URL khi deploy
    const newSocket = io('http://localhost:4000'); 
    setSocket(newSocket);

    newSocket.emit('joinRoom', applicationId);

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
    socket.emit('sendMessage', {
      applicationId,
      senderId: currentUserId,
      content: input
    });
    setInput('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col h-[500px] animate-fade-in-up overflow-hidden">
      {/* Header Chat - CÓ AVATAR */}
      <div className="p-4 border-b border-slate-100 bg-indigo-600 text-white flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-400 shrink-0">
            {partnerAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={partnerAvatar} alt="Partner" className="w-full h-full object-cover" />
            ) : (
                <span className="font-bold text-indigo-600 text-lg">{partnerName.charAt(0).toUpperCase()}</span>
            )}
        </div>
        <div>
            <p className="font-bold text-sm truncate max-w-[200px]">{partnerName}</p>
            <p className="text-[10px] opacity-90 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span> Đang hoạt động
            </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          const senderName = msg.sender?.brandProfile?.companyName || msg.sender?.kolProfile?.fullName || 'User';
          const senderAvatar = msg.sender?.brandProfile?.logo || msg.sender?.kolProfile?.avatar;

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
              {!isMe && (
                 <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0 mt-1">
                    {senderAvatar ? <img src={senderAvatar} className="w-full h-full object-cover"/> : <User size={16} className="m-1 text-slate-400"/>}
                 </div>
              )}
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                 <div className={`p-3 rounded-2xl text-sm shadow-sm ${
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

      <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 transition-all focus:bg-white"
        />
        <button onClick={handleSend} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}


