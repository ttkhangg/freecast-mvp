import { Metadata } from 'next';
import Link from 'next/link';
import { Instagram, Youtube, Facebook, Star, MapPin } from 'lucide-react';

const mockKOL = {
  name: "Hà Linh Official",
  role: "Beauty Blogger",
  bio: "Chuyên review mỹ phẩm high-end và skincare khoa học. Nói không với kem trộn.",
  location: "Hà Nội, VN",
  followers: "1.5M",
  rating: "4.9/5",
  tags: ["Beauty", "Lifestyle", "Vlog"]
};

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${mockKOL.name} - ${mockKOL.role} | FreeCast Profile`,
    description: mockKOL.bio,
  };
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 flex justify-center items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-900/50 to-transparent pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
        <div className="w-32 h-32 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-full mx-auto p-1 mb-4">
          <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-4xl font-bold">
            {mockKOL.name[0]}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2 mb-1">
          {mockKOL.name} 
          <span className="bg-blue-500 text-white text-[10px] p-1 rounded-full"><Star size={10} fill="white" /></span>
        </h1>
        <p className="text-indigo-400 font-medium mb-4">{mockKOL.role}</p>
        
        <div className="flex justify-center gap-4 text-sm text-slate-400 mb-6">
          <span className="flex items-center gap-1"><MapPin size={14}/> {mockKOL.location}</span>
          <span>•</span>
          <span className="text-white font-bold">{mockKOL.followers} Followers</span>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-8">"{mockKOL.bio}"</p>

        <div className="flex justify-center gap-4 mb-8">
          <div className="p-3 bg-white/5 rounded-full hover:bg-pink-600 transition-colors cursor-pointer"><Instagram size={20}/></div>
          <div className="p-3 bg-white/5 rounded-full hover:bg-red-600 transition-colors cursor-pointer"><Youtube size={20}/></div>
          <div className="p-3 bg-white/5 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"><Facebook size={20}/></div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {mockKOL.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-white/5">#{tag}</span>
          ))}
        </div>

        <Link href="/register" className="block w-full py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-indigo-50 transition-all">
          Mời hợp tác
        </Link>
      </div>
    </div>
  );
}
