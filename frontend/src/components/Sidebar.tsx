'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Briefcase, User, LogOut, ShieldCheck, MessageSquare } from 'lucide-react';
import Cookies from 'js-cookie';

const menuItems = [
  { icon: LayoutGrid, label: 'Tổng quan', href: '/dashboard', roles: ['BRAND', 'KOL', 'ADMIN'] },
  { icon: Briefcase, label: 'Việc của tôi', href: '/my-jobs', roles: ['KOL'] },
  { icon: Briefcase, label: 'Quản lý Campaign', href: '/brand/campaigns', roles: ['BRAND'] },
  { icon: MessageSquare, label: 'Tin nhắn', href: '/messages', roles: ['BRAND', 'KOL'] }, // MỚI THÊM
  { icon: User, label: 'Hồ sơ', href: '/profile', roles: ['BRAND', 'KOL'] },
  { icon: ShieldCheck, label: 'Admin Portal', href: '/admin', roles: ['ADMIN'] },
];

export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 border-r border-white/5">
      {/* Logo trỏ về Dashboard */}
      <div 
        className="p-6 border-b border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors" 
        onClick={() => router.push('/dashboard')}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-lg flex items-center justify-center font-bold text-sm">F</div>
        <span className="font-bold text-xl tracking-tight">FreeCast</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          if (!item.roles.includes(userRole)) return null;
          // Logic active: match chính xác hoặc match folder con (trừ dashboard để tránh active nhầm khi ở root)
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-all"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}