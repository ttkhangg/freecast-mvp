'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types';
import { LayoutDashboard, Briefcase, MessageSquare, User, LogOut, Settings, PlusCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const getCampaignLink = () => {
    if (user?.role === Role.BRAND) return '/brand/campaigns';
    return '/campaigns';
  };

  const navItems = [
    { name: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
    { name: user?.role === Role.BRAND ? 'Quản lý Job' : 'Tìm việc', href: getCampaignLink(), icon: Briefcase },
    { name: 'Tin nhắn', href: '/messages', icon: MessageSquare },
    { name: 'Hồ sơ', href: '/profile', icon: User },
  ];

  if (user?.role === Role.ADMIN) {
      navItems.push({ name: 'Quản trị Users', href: '/admin/users', icon: Settings });
  }

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen transition-all duration-300">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-gray-50">
        <span className="text-xl font-bold text-indigo-600 tracking-wider">FreeCast</span>
      </div>
      
      {/* User Info Snippet */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"/>
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{user?.fullName || 'Người dùng'}</p>
            
            {/* HIỂN THỊ RATING */}
            <div className="flex items-center text-xs text-gray-500 mt-0.5">
               <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
               <span className="font-medium text-gray-700">{user?.rating ? user.rating : 'N/A'}</span>
               <span className="mx-1">•</span>
               <span className="capitalize">{user?.role?.toLowerCase()}</span>
            </div>
          </div>
        </div>
        
        {user?.role === Role.BRAND && (
          <Link href="/brand/campaigns/new" className="mt-4 block">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors">
              <PlusCircle className="mr-2 h-4 w-4" /> Đăng Job Mới
            </button>
          </Link>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pt-4 pb-4">
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:pl-4"
                )}
              >
                <item.icon className={cn("mr-3 flex-shrink-0 h-5 w-5 transition-colors", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500")} aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <button onClick={handleLogout} className="flex-shrink-0 w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors">
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" /> Đăng xuất
        </button>
      </div>
    </div>
  );
}