'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { ArrowRight, Package, Clock, CheckCircle2, CircleDashed, Truck, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout'; // Import Layout

interface MyJob {
  id: string;
  status: string;
  campaign: {
    title: string;
    brand: { companyName: string; };
    productValue: string;
  }
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<MyJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/campaigns/my-jobs')
      .then(res => setJobs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100"><Clock size={12}/> Chờ duyệt</span>;
      case 'APPROVED': return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold border border-blue-100"><CheckCircle2 size={12}/> Đã duyệt</span>;
      case 'SHIPPING': return <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100"><Truck size={12}/> Đang giao</span>;
      case 'RECEIVED': return <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-xs font-bold border border-purple-100"><CircleDashed size={12}/> Đã nhận</span>;
      case 'SUBMITTED': return <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold border border-orange-100"><CheckCircle2 size={12}/> Đã nộp</span>;
      case 'COMPLETED': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-100"><CheckCircle2 size={12}/> Hoàn tất</span>;
      default: return <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Quản lý công việc</h1>
        <p className="text-slate-500 mb-8">Theo dõi trạng thái các chiến dịch bạn đã ứng tuyển.</p>
        
        {loading ? (
           <div className="flex items-center justify-center h-64">
             <Loader2 className="animate-spin text-indigo-600 h-8 w-8"/>
           </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Package size={40}/>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Chưa có công việc nào</h3>
            <p className="text-slate-400 mb-6">Bạn chưa ứng tuyển chiến dịch nào cả. Hãy tìm kiếm cơ hội ngay!</p>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 inline-block">
              Tìm việc ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link href={`/my-jobs/${job.id}`} key={job.id} className="group block bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-indigo-100">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       {getStatusBadge(job.status)}
                       <span className="text-xs text-slate-400 font-medium font-mono">#{job.id.slice(0,8)}</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{job.campaign.title}</h3>
                    <p className="text-sm text-slate-500">Brand: <span className="font-bold text-slate-700">{job.campaign.brand.companyName}</span> • Quyền lợi: <span className="font-bold text-emerald-600">{job.campaign.productValue}</span></p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}