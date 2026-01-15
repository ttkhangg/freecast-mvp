'use client';

import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header đơn giản có chuông thông báo */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-8">
          <NotificationBell />
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}