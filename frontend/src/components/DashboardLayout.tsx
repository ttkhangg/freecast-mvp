'use client';

import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isHydrated } = useAuthStore();

  if (!isHydrated) {
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b h-16 flex items-center justify-between px-6 lg:px-8">
            {/* Breadcrumb Placeholder (Có thể thêm sau) */}
            <div className="flex items-center gap-2">
                 {/* <span className="text-sm font-medium text-muted-foreground">Dashboard</span> */}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <NotificationBell />
            </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}