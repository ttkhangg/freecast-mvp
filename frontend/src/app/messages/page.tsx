'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { useConversations, useChatMessages, useChatSocket } from '@/hooks/useChat';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@/types';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { data: conversations, isLoading: loadingConv } = useConversations();
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  
  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedConvId) {
      setSelectedConvId(conversations[0].id);
    }
  }, [conversations, selectedConvId]);

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          
          {/* List Conversations */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-bold text-gray-700">Tin nhắn</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingConv ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-indigo-600"/></div>
              ) : conversations?.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">Chưa có cuộc trò chuyện nào.</div>
              ) : (
                conversations?.map((conv) => {
                  const isMeBrand = user?.role === Role.BRAND;
                  const partnerName = isMeBrand ? conv.kol.fullName : "Brand";
                  const partnerAvatar = isMeBrand ? conv.kol.avatar : null;
                  const lastMsg = conv.messages?.[0]?.content || "Bắt đầu cuộc trò chuyện";

                  return (
                    <div 
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={cn(
                        "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                        selectedConvId === conv.id ? "bg-indigo-50 border-l-4 border-l-indigo-600" : ""
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                           {partnerAvatar ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={partnerAvatar} alt="" className="h-full w-full object-cover"/>
                           ) : (
                             <div className="h-full w-full flex items-center justify-center font-bold text-gray-500">
                               {partnerName.charAt(0)}
                             </div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{partnerName}</p>
                          <p className="text-xs text-gray-500 truncate font-semibold">{conv.campaign.title}</p>
                          <p className="text-xs text-gray-400 truncate mt-1">{lastMsg}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Chat Box */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedConvId ? (
              <ChatWindow applicationId={selectedConvId} currentUserId={user?.id || ''} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
                <p>Chọn một cuộc hội thoại để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}

function ChatWindow({ applicationId, currentUserId }: { applicationId: string, currentUserId: string }) {
  const { data: messages, isLoading } = useChatMessages(applicationId);
  const { sendMessage } = useChatSocket(applicationId);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
        {messages?.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm", isMe ? "bg-indigo-600 text-white" : "bg-white text-gray-800 border border-gray-200")}>
                <p>{msg.content}</p>
                <p className={cn("text-[10px] mt-1 text-right", isMe ? "text-indigo-200" : "text-gray-400")}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1" />
          <Button type="submit" size="icon" disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </>
  )
}