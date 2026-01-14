import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';

// Types
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: { fullName: string; avatar: string | null };
}

export interface Conversation {
  id: string; // applicationId
  status: string;
  campaign: { id: string; title: string; brandId: string };
  kol: { id: string; fullName: string; avatar: string | null };
  messages: { content: string; createdAt: string }[];
}

// 1. Get Conversations
export const useConversations = () => {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => await api.get('/chat/conversations'),
  });
};

// 2. Get Messages
export const useChatMessages = (applicationId: string | null) => {
  return useQuery<ChatMessage[]>({
    queryKey: ['messages', applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      return await api.get(`/chat/${applicationId}`);
    },
    enabled: !!applicationId,
  });
};

// 3. Socket Logic
export const useChatSocket = (applicationId: string | null) => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !applicationId) return;

    // Connect Socket
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001', {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'], // Force websocket
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Chat Connected to Room:', applicationId);
      socket.emit('joinRoom', { applicationId });
    });

    socket.on('newMessage', (message: ChatMessage) => {
      // Realtime Update Cache
      queryClient.setQueryData(['messages', applicationId], (old: ChatMessage[] = []) => {
        return [...old, message];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, applicationId, queryClient]);

  const sendMessage = (content: string) => {
    if (socketRef.current && applicationId) {
      socketRef.current.emit('sendMessage', { applicationId, content });
    }
  };

  return { sendMessage };
};