import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, DollarSign } from 'lucide-react';

// Giả lập dữ liệu (Sau này sẽ lấy từ API)
const mockCampaign = {
  title: "Tuyển 50 KOC Review bộ quà Tết 2024",
  brand: "VinFast",
  description: "Chúng tôi đang tìm kiếm các bạn KOC năng động để trải nghiệm và review dòng xe máy điện mới nhất...",
  budget: "5.000.000đ",
  deadline: "20/01/2024",
  requirements: ["TikTok > 10k Follow", "Nữ, 18-25 tuổi", "Sống tại HN/HCM"]
};

// Hàm tạo Metadata động cho SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Thực tế: const campaign = await fetchCampaign(params.slug);
  return {
    title: `${mockCampaign.title} | FreeCast`,
    description: mockCampaign.description,
    openGraph: {
      title: mockCampaign.title,
      description: mockCampaign.description,
      type: 'website',
    },
  };
}

export default function CampaignPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 flex justify-center items-center">
      <div className="max-w-2xl w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Quay lại trang chủ
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Campaign</span>
          <span className="text-slate-500 text-sm">ID: {params.slug}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{mockCampaign.title}</h1>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold">V</div>
          <span className="font-semibold text-lg">{mockCampaign.brand}</span>
          <CheckCircle2 size={18} className="text-blue-400" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1"><DollarSign size={16}/> Ngân sách</div>
            <div className="font-bold text-xl text-emerald-400">{mockCampaign.budget}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1"><Clock size={16}/> Hạn nộp</div>
            <div className="font-bold text-xl text-white">{mockCampaign.deadline}</div>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div>
            <h3 className="font-bold text-lg mb-2 text-indigo-300">Mô tả công việc</h3>
            <p className="text-slate-300 leading-relaxed">{mockCampaign.description}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-indigo-300">Yêu cầu</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              {mockCampaign.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <Link href="/register" className="block w-full py-4 bg-white text-slate-950 text-center font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-indigo-500/20">
          Ứng tuyển ngay
        </Link>
      </div>
    </div>
  );
}