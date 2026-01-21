'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, Menu } from 'lucide-react'; // Thêm icon Menu
import { Button } from './ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isHydrated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isHydrated) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar có thể đóng mở */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b h-16 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-2">
                 {/* Nút Menu chỉ hiện trên Mobile (md:hidden) */}
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="md:hidden mr-2"
                   onClick={() => setIsSidebarOpen(true)}
                 >
                   <Menu className="h-6 w-6" />
                 </Button>
                 
                 {/* Logo nhỏ cho mobile khi sidebar ẩn (Optional) */}
                 <span className="md:hidden font-bold text-lg text-primary">FreeCast</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <NotificationBell />
            </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}