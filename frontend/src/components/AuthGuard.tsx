'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'BRAND' | 'KOL')[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Chỉ chạy logic redirect khi đã load xong state từ localStorage
    if (isHydrated) {
      if (!isAuthenticated) {
        // Chưa đăng nhập -> Đá về Login
        console.log('AuthGuard: Not authenticated, redirecting to login');
        router.replace('/login');
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Sai quyền -> Đá về Dashboard (nếu đang ở trang khác)
        // Tránh redirect loop nếu đang ở dashboard rồi mà vẫn sai quyền (trường hợp hiếm)
        if (pathname !== '/dashboard') {
             console.log('AuthGuard: Wrong role, redirecting to dashboard');
             router.replace('/dashboard');
        }
      }
    }
  }, [isHydrated, isAuthenticated, user, allowedRoles, router, pathname]);

  // 1. Nếu chưa load xong localStorage -> Hiện Loading
  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // 2. Nếu đã load xong nhưng chưa đăng nhập -> Return null (đợi useEffect redirect)
  if (!isAuthenticated) {
    return null;
  }

  // 3. Nếu sai quyền -> Return null (đợi useEffect redirect)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // 4. Mọi thứ ok -> Render Children
  return <>{children}</>;
}