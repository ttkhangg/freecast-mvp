'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Save, MapPin, Phone, CreditCard, User, Loader2, Link as LinkIcon, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import VerifiedBadge from '@/components/VerifiedBadge';

interface KolProfileData {
  fullName: string;
  avatar: string;
  bio: string;
  phone: string;
  socialLink: string;
  address: string;
  bankName: string;
  bankAccount: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<KolProfileData>({
    fullName: '', avatar: '', bio: '', phone: '', socialLink: '', address: '', bankName: '', bankAccount: ''
  });
  const [role, setRole] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // State cho upload ảnh
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get('/auth/me').then(res => {
      setRole(res.data.role);
      setIsVerified(res.data.isVerified);
      
      const p = res.data.role === 'BRAND' ? res.data.brandProfile : res.data.kolProfile;
      if(p) {
        setProfile({
          fullName: p.fullName || p.companyName || '',
          avatar: p.avatar || p.logo || '', // Map cả logo của brand
          bio: p.bio || p.description || '',
          phone: p.phone || '',
          socialLink: p.socialLink || p.website || '',
          address: p.address || '',
          bankName: p.bankName || '',
          bankAccount: p.bankAccount || ''
        });
      }
      setFetching(false);
    }).catch(() => {
      setFetching(false);
    });
  }, []);

  // Hàm xử lý upload ảnh riêng cho Avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    // --- CẤU HÌNH CLOUDINARY (Giống ImageUpload) ---
    const UPLOAD_PRESET = 'freecast_preset'; 
    const CLOUD_NAME = 'dhf1fioml'; 
    formData.append('upload_preset', UPLOAD_PRESET);
    // ---------------------------------------------

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
          setProfile(prev => ({ ...prev, avatar: data.secure_url }));
      }
    } catch (err) {
      alert('Lỗi upload ảnh.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = role === 'BRAND' ? '/auth/profile/brand' : '/auth/profile/kol';
      
      // Map dữ liệu cho đúng với Backend
      const payload = role === 'BRAND' ? {
        companyName: profile.fullName,
        description: profile.bio,
        website: profile.socialLink,
        logo: profile.avatar, // Backend Brand dùng 'logo'
        phone: profile.phone,
        address: profile.address
      } : profile; // KOL dùng đúng key 'avatar'

      await api.put(endpoint, payload); 
      alert('Đã lưu hồ sơ thành công!'); 
    } catch (err) {
      alert('Lỗi khi lưu hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-600 h-8 w-8"/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900 flex items-center gap-2">
            Hồ sơ cá nhân {isVerified && <VerifiedBadge />}
        </h1>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header màu với Avatar */}
          <div className="bg-indigo-600 p-8 text-white flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 overflow-hidden flex items-center justify-center relative">
                    {uploading ? (
                        <Loader2 className="animate-spin text-white" />
                    ) : profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User size={40} className="text-white/50" />
                    )}
                </div>
                
                {/* Nút upload (Camera icon) */}
                <label className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-slate-100 transition-colors z-10">
                    <Camera size={16} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
            </div>
            
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{profile.fullName || 'Chưa đặt tên'}</h2>
                <p className="opacity-90 mt-1">{role === 'BRAND' ? 'Doanh nghiệp' : 'Creator'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-2">
                <User size={20} className="text-indigo-600" /> Thông tin cơ bản
              </h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên hiển thị / Công ty</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white placeholder:text-slate-400" 
                  value={profile.fullName} 
                  onChange={e => setProfile({...profile, fullName: e.target.value})} 
                  placeholder="Nhập tên..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Link kênh chính / Website</label>
                <div className="relative">
                    <LinkIcon size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input 
                        type="url" 
                        className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white placeholder:text-slate-400" 
                        value={profile.socialLink} 
                        onChange={e => setProfile({...profile, socialLink: e.target.value})} 
                        placeholder="https://..."
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Giới thiệu (Bio)</label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white placeholder:text-slate-400 resize-none" 
                  value={profile.bio} 
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  placeholder="Mô tả ngắn về bản thân..." 
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-2">
                <MapPin size={20} className="text-indigo-600" /> Liên hệ & Thanh toán
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Địa chỉ</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white placeholder:text-slate-400" 
                    value={profile.address} 
                    onChange={e => setProfile({...profile, address: e.target.value})} 
                    placeholder="Địa chỉ nhận hàng/trụ sở..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input 
                    type="tel" 
                    required 
                    pattern="(03|05|07|08|09)+([0-9]{8})\b"
                    title="Số điện thoại phải gồm 10 chữ số bắt đầu bằng 03, 05, 07, 08, 09"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white placeholder:text-slate-400" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})} 
                    placeholder="09xx..."
                  />
                </div>
              </div>

              {/* Chỉ hiện Bank cho KOL */}
              {role === 'KOL' && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Tên ngân hàng</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white placeholder:text-slate-400" 
                        value={profile.bankName} 
                        onChange={e => setProfile({...profile, bankName: e.target.value})} 
                        placeholder="VD: MB Bank"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Số tài khoản</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 bg-white placeholder:text-slate-400" 
                        value={profile.bankAccount} 
                        onChange={e => setProfile({...profile, bankAccount: e.target.value})} 
                        placeholder="xxxxxxxxx"
                      />
                    </div>
                  </div>
              )}
            </div>

            <div className="col-span-full pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={loading || uploading} 
                className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin"/> : <Save size={20} />} 
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}