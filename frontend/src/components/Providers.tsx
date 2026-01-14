'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Tạo QueryClient một lần duy nhất
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Tự động fetch lại khi cửa sổ focus
        refetchOnWindowFocus: false, 
        // Thử lại 1 lần nếu lỗi mạng
        retry: 1, 
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Cấu hình Toast: hiển thị ở góc trên bên phải, richColors cho đẹp */}
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}