'use client';

import Sidebar from '@/components/Sidebar';
// import Header from '@/components/Header'; // Nếu có Header thì uncomment

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Khu vực nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header />  */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}