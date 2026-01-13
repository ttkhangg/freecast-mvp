'use client';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get('token');
    const userRole = Cookies.get('role');
    
    if (!token || !userRole) {
      router.push('/login');
      return;
    }

    // SECURITY FIX: Chặn User thường truy cập route /admin
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        alert("Bạn không có quyền truy cập trang này!");
        router.push('/dashboard');
        return;
    }

    setRole(userRole);
  }, [pathname, router]);

  if (!role) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar userRole={role} />
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}