'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { MessageSquare, User, Building2, Loader2, ArrowRight } from 'lucide-react';
import Cookies from 'js-cookie';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRole(Cookies.get('role') || '');
    api.get('/chat/conversations/all')
       .then(res => setConversations(res.data))
       .catch(console.error)
       .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
       <div className="flex items-center justify-center h-64">
         <Loader2 className="animate-spin text-indigo-600 h-8 w-8"/>
       </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-2">
            <MessageSquare className="text-indigo-600"/> Tin nhắn
        </h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-20"/>
                <p>Chưa có cuộc hội thoại nào.</p>
                <p className="text-xs mt-1">Chat sẽ xuất hiện khi đơn hàng được duyệt.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {conversations.map(conv => {
                // Xác định tên và avatar đối phương
                const isBrandView = role === 'BRAND';
                const partnerName = isBrandView ? conv.kol.fullName : conv.campaign.brand.companyName;
                const partnerAvatar = isBrandView ? conv.kol.avatar : conv.campaign.brand.logo;
                const lastMsg = conv.messages[0];
                
                return (
                  <Link 
                      href={isBrandView ? `/brand/campaigns/${conv.campaignId}?chatAppId=${conv.id}` : `/my-jobs/${conv.id}`} 
                      key={conv.id} 
                      className="block p-5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar hiển thị */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden bg-slate-100 border border-slate-200">
                         {partnerAvatar ? (
                             <img src={partnerAvatar} alt={partnerName} className="w-full h-full object-cover" />
                         ) : (
                             <span className={isBrandView ? 'text-pink-600' : 'text-indigo-600'}>
                                {isBrandView ? <User size={24}/> : <Building2 size={24}/>}
                             </span>
                         )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors text-lg">
                              {partnerName}
                            </h4>
                            <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                {new Date(conv.updatedAt).toLocaleDateString('vi-VN')}
                            </span>
                         </div>
                         
                         <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200 uppercase truncate max-w-[200px]">
                              {conv.campaign.title}
                           </span>
                         </div>
                         
                         <p className={`text-sm truncate ${lastMsg ? 'text-slate-600' : 'text-slate-400 italic'}`}>
                            {lastMsg 
                                ? (lastMsg.senderId !== 'ME' ? '' : 'Bạn: ') + lastMsg.content 
                                : 'Chưa có tin nhắn nào. Bắt đầu trò chuyện ngay!'}
                         </p>
                      </div>
                      
                      <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"/>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
