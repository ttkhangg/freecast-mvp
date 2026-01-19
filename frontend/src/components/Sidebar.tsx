'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  User, 
  LogOut, 
  Settings, 
  PlusCircle, 
  Hexagon,
  LogIn,
  Search,
  Users,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Logic phân quyền Menu
  let navItems = [
    { 
      name: user?.role === Role.KOL ? 'Sàn việc làm' : 'Tổng quan', 
      href: '/dashboard', 
      icon: user?.role === Role.KOL ? Search : LayoutDashboard 
    }
  ];

  if (user?.role === Role.BRAND) {
      navItems.push({ name: 'Quản lý Job', href: '/brand/campaigns', icon: Briefcase });
  } else if (user?.role === Role.KOL) {
      navItems.push({ name: 'Việc của tôi', href: '/my-jobs', icon: Briefcase });
  }

  // --- ADMIN SECTION ---
  if (user?.role === Role.ADMIN) {
      navItems = [
          { name: 'Command Center', href: '/admin', icon: LayoutDashboard },
          { name: 'Users', href: '/admin/users', icon: Users },
          { name: 'Campaigns', href: '/admin/campaigns', icon: Briefcase }, // NEW
          // { name: 'Reports', href: '/admin/reports', icon: ShieldAlert }, // Placeholder
      ];
  } else {
      // Common items for non-admin
      navItems.push(
        { name: 'Tin nhắn', href: '/messages', icon: MessageSquare },
        { name: 'Hồ sơ', href: '/profile', icon: User },
      );
  }

  return (
    <aside className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border min-h-screen transition-all duration-300 shadow-sm z-20 sticky top-0 h-screen">
      {/* Brand Logo */}
      <div className="flex items-center h-16 px-6 border-b border-sidebar-border shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
             <Hexagon className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground tracking-tight">FreeCast</span>
        </Link>
      </div>
      
      {/* User Quick Info */}
      {isAuthenticated && user ? (
        <div className="px-4 py-6 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
            <div className="flex-shrink-0">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover ring-2 ring-background"/>
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          
          {user.role === Role.BRAND && (
            <Link href="/brand/campaigns/new" className="mt-4 block">
              <Button variant="brand" className="w-full justify-start gap-2">
                <PlusCircle className="w-4 h-4" /> Đăng Job Mới
              </Button>
            </Link>
          )}
        </div>
      ) : (
          <div className="p-4 shrink-0">
              <Button onClick={() => router.push('/login')} className="w-full">
                  <LogIn className="w-4 h-4 mr-2"/> Đăng nhập
              </Button>
          </div>
      )}

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-1 px-3 py-2 overflow-y-auto no-scrollbar">
        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-2">Menu</p>
        {isAuthenticated && navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary font-bold shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      {isAuthenticated && (
        <div className="p-4 border-t border-sidebar-border shrink-0">
            <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
            >
            <LogOut className="w-5 h-5" />
            Đăng xuất
            </button>
        </div>
      )}
    </aside>
  );
}