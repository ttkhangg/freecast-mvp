'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AuthGuard from '@/components/AuthGuard';
import { useConversations, useChatMessages, useChatSocket } from '@/hooks/useChat';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, MessageSquare, Search, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@/types';
import { Card } from '@/components/ui/card';

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
        <div className="h-[calc(100vh-8rem)] min-h-[500px] flex overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          
          {/* SIDEBAR: List Conversations */}
          <div className="w-80 md:w-1/3 border-r border-border flex flex-col bg-muted/10">
            {/* Search Header */}
            <div className="p-4 border-b border-border bg-card">
              <h2 className="font-bold text-lg mb-4">Tin nhắn</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm..." className="pl-9 bg-muted/20 border-none focus-visible:ring-1" />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {loadingConv ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary"/></div>
              ) : conversations?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                    <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50"/>
                    Chưa có cuộc trò chuyện nào.
                </div>
              ) : (
                conversations?.map((conv) => {
                  const isMeBrand = user?.role === Role.BRAND;
                  const partnerName = isMeBrand ? conv.kol.fullName : "Brand";
                  const partnerAvatar = isMeBrand ? conv.kol.avatar : null;
                  const lastMsg = conv.messages?.[0]?.content || "Bắt đầu cuộc trò chuyện";
                  const isActive = selectedConvId === conv.id;

                  return (
                    <div 
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={cn(
                        "p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3",
                        isActive ? "bg-primary/10" : "hover:bg-muted"
                      )}
                    >
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden border border-border flex items-center justify-center shrink-0">
                           {partnerAvatar ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={partnerAvatar} alt="" className="h-full w-full object-cover"/>
                           ) : (
                             <span className="font-bold text-muted-foreground">{partnerName.charAt(0)}</span>
                           )}
                        </div>
                        {isActive && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <p className={cn("text-sm font-semibold truncate", isActive ? "text-primary" : "text-foreground")}>{partnerName}</p>
                            <span className="text-[10px] text-muted-foreground">12:30</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate font-medium">{conv.campaign.title}</p>
                        <p className="text-xs text-muted-foreground/80 truncate mt-0.5 line-clamp-1">{lastMsg}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* MAIN CHAT WINDOW */}
          <div className="flex-1 flex flex-col bg-card relative">
            {selectedConvId ? (
              <ChatWindow applicationId={selectedConvId} currentUserId={user?.id || ''} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 opacity-50" />
                </div>
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

  if (isLoading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-primary"/></div>;

  return (
    <>
      {/* Chat Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="font-semibold text-sm">Cuộc trò chuyện trực tiếp</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4"/></Button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/5 scroll-smooth" ref={scrollRef}>
        {messages?.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300", isMe ? "justify-end" : "justify-start")}>
              <div className={cn(
                  "max-w-[75%] rounded-2xl px-5 py-3 text-sm shadow-sm relative", 
                  isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-secondary-foreground rounded-bl-sm"
              )}>
                <p className="leading-relaxed">{msg.content}</p>
                <p className={cn("text-[10px] mt-1 text-right opacity-70", isMe ? "text-primary-foreground" : "text-muted-foreground")}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <form onSubmit={handleSend} className="flex gap-3 relative">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Nhập tin nhắn..." 
            className="flex-1 pr-12 py-6 rounded-xl bg-muted/30 border-muted focus-visible:ring-primary/20" 
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim()} 
            className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 transition-all"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  )
}