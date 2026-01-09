'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe, Users, TrendingUp, ChevronDown, Menu, X, DollarSign, Package, BarChart, Search, AlertTriangle, Briefcase, Award, UserCheck, Star, Sparkles, Frown, Mail, MapPin, Phone, XCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'brand' | 'kol'>('brand');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Dữ liệu động (Content Marketing - High Conversion Style)
  const content = {
    brand: {
      painPoints: [
        { title: "Tốn thời gian booking lẻ tẻ", desc: "Mất trung bình 40 giờ/tháng để tìm kiếm, inbox và mặc cả với từng KOL. Quy trình thủ công rời rạc, kém hiệu quả." },
        { title: "Rủi ro tương tác ảo", desc: "Khó phân biệt KOL thật/giả. Ngân sách Marketing bị lãng phí vào các tài khoản hack follow, seeding comment, không ra đơn." },
        { title: "Khó đo lường hiệu quả", desc: "Không biết chính xác chiến dịch nào hiệu quả. Báo cáo file Excel thủ công, thiếu số liệu realtime để tối ưu ROI." }
      ],
      solutions: [
        { title: "Tự động hóa quy trình", desc: "Đăng campaign một lần, hệ thống tự động phân phối tới 50.000+ Creator phù hợp. Quản lý hàng trăm KOL trên một màn hình." },
        { title: "Dữ liệu minh bạch", desc: "Hệ thống AI chấm điểm uy tín (Trust Score) dựa trên dữ liệu thật. Loại bỏ nỗi lo booking phải nick ảo." },
        { title: "Báo cáo chuyên sâu", desc: "Dashboard trực quan hiển thị chi tiết Click, View, Conversion Rate theo thời gian thực. Ra quyết định dựa trên số liệu." }
      ],
      process: [
        { 
          step: "01", title: "Thiết lập Campaign", icon: Zap, 
          traditional: "Soạn JD file Word, đăng bài lên hàng chục Group Facebook, lọc comment spam thủ công.",
          freecast: "Form mẫu chuẩn hóa, đăng 1 lần tiếp cận 50.000+ Creator. Hệ thống tự động lọc hồ sơ rác."
        },
        { 
          step: "02", title: "AI Matching & Đề xuất", icon: Users, 
          traditional: "Inbox từng người xin Ratecard, chờ đợi phản hồi, check lịch trống thủ công rất mất thời gian.",
          freecast: "AI đề xuất Top 50 KOL phù hợp nhất. Gửi lời mời hợp tác & check lịch hàng loạt chỉ với 1 cú click."
        },
        { 
          step: "03", title: "Vận hành & Nghiệm thu", icon: BarChart, 
          traditional: "Nhắc lịch lên bài qua Zalo/Mess, tổng hợp link báo cáo vào Excel, đối soát thanh toán thủ công.",
          freecast: "Theo dõi trạng thái realtime trên Dashboard. Hệ thống tự động nhắc lịch, nghiệm thu link và thanh toán."
        }
      ],
      features: [
        { 
          title: "Phân tích Dữ liệu lớn", icon: Globe, 
          traditional: "Booking dựa trên cảm tính hoặc số lượng Follower ảo (dễ dàng mua được).",
          freecast: "Phân tích sâu nhân khẩu học (độ tuổi, vị trí) và hành vi mua sắm của fan để dự đoán tỷ lệ chuyển đổi."
        },
        { 
          title: "Hệ thống Chống Gian lận", icon: ShieldCheck, 
          traditional: "Không có công cụ kiểm chứng, dễ bị qua mặt bởi các tool buff like/comment.",
          freecast: "Lớp bảo mật 3 tầng tự động phát hiện dấu hiệu bất thường, cảnh báo ngay lập tức để bảo vệ ngân sách."
        },
        { 
          title: "Theo dõi Thời gian thực", icon: TrendingUp, 
          traditional: "Chỉ biết số like/share sau khi hết chiến dịch. Không biết doanh thu đến từ đâu.",
          freecast: "Công nghệ Tracking Link độc quyền đo lường chính xác hành trình khách hàng từ Click -> Đơn hàng."
        }
      ],
      seo: {
        tag: "Tối đa hóa hiển thị",
        title: <>Thương hiệu phủ sóng <br /><span className="text-gradient">Mọi nền tảng tìm kiếm</span></>,
        desc: "FreeCast không chỉ là nền tảng booking, mà còn là đòn bẩy SEO. Chúng tôi tối ưu hóa nội dung chiến dịch để thương hiệu của bạn dễ dàng được tìm thấy trên Google và nổi bật trên mạng xã hội.",
        benefits: [
          "Landing Page chiến dịch chuyên nghiệp, chuẩn SEO tự động",
          "Tăng khả năng tiếp cận Creator chất lượng thông qua tìm kiếm tự nhiên",
          "Hiển thị thông tin thu hút, chuyên nghiệp khi chia sẻ link trên Facebook/Zalo"
        ],
        mockup: {
          breadcrumb: "campaign › tet-2024",
          title: "Tuyển 50 KOC Review bộ quà Tết 2024 - Lương hấp dẫn",
          desc: "Đăng ký tham gia chiến dịch review bộ quà Tết Sum Vầy. Yêu cầu: kênh TikTok > 10k follow. Quyền lợi: Nhận sản phẩm trị giá 2tr + Cash 500k."
        }
      }
    },
    kol: {
      painPoints: [
        { title: "Thu nhập bấp bênh", desc: "Tháng có job, tháng không. Thường xuyên bị Brand chậm thanh toán hoặc 'bùng' tiền booking mà không có hợp đồng bảo vệ." },
        { title: "Bị động tìm kiếm Job", desc: "Chỉ biết ngồi chờ Brand liên hệ qua email/inbox. Không tiếp cận được các chiến dịch lớn phù hợp với kênh." },
        { title: "Profile thiếu chuyên nghiệp", desc: "Chỉ gửi link Facebook/TikTok rời rạc khi chào hàng. Khó thuyết phục Brand trả mức cát-xê xứng đáng." }
      ],
      solutions: [
        { title: "Thanh toán đảm bảo", desc: "Tiền booking được giữ an toàn trên hệ thống (Escrow) và giải ngân ngay khi hoàn thành job. Không lo rủi ro." },
        { title: "Kho việc làm khổng lồ", desc: "Truy cập hàng ngàn chiến dịch Free-cast và Paid Booking mới mỗi ngày. Chủ động ứng tuyển job ngon." },
        { title: "Nâng tầm thương hiệu", desc: "Sở hữu website cá nhân (Portfolio) chuyên nghiệp, tự động cập nhật chỉ số kênh để gửi cho Brand." }
      ],
      process: [
        { 
          step: "01", title: "Xây dựng Hồ sơ số", icon: UserCheck, 
          traditional: "Tự làm file PDF/Ảnh thủ công, số liệu cũ kỹ, gửi qua email thiếu chuyên nghiệp.",
          freecast: "Kết nối API MXH, hệ thống tự tạo Portfolio đẹp mắt, tự động cập nhật Follow/View mới nhất."
        },
        { 
          step: "02", title: "Tìm việc Chủ động", icon: Briefcase, 
          traditional: "Lướt các Group Facebook, comment 'quan tâm' và chờ đợi trong vô vọng.",
          freecast: "Hàng ngàn Job 'xịn' hiển thị sẵn. Hệ thống gợi ý job phù hợp, ứng tuyển chỉ với 1 nút bấm."
        },
        { 
          step: "03", title: "Sáng tạo & Nhận thù lao", icon: DollarSign, 
          traditional: "Lo lắng bị quỵt tiền, đòi nợ mệt mỏi, không có hợp đồng pháp lý rõ ràng.",
          freecast: "Tiền đã được Brand nạp trước (Escrow). Hoàn thành job là rút tiền về ngân hàng ngay lập tức."
        }
      ],
      features: [
        { 
          title: "Portfolio Tự động", icon: Award, 
          traditional: "CV tĩnh, nhàm chán, không chứng minh được năng lực tăng trưởng của kênh.",
          freecast: "Website cá nhân sống động, biểu đồ tăng trưởng trực quan, gây ấn tượng mạnh với Brand."
        },
        { 
          title: "Gợi ý Việc làm AI", icon: Zap, 
          traditional: "Bị spam tin nhắn rác, mời chào các job giá rẻ hoặc không đúng chủ đề kênh.",
          freecast: "Bộ lọc thông minh chỉ hiển thị các chiến dịch đúng gu, đúng giá, đúng sở trường của bạn."
        },
        { 
          title: "Thanh toán Đảm bảo", icon: ShieldCheck, 
          traditional: "Rủi ro cao, phụ thuộc vào uy tín miệng của người thuê.",
          freecast: "Bảo vệ 2 chiều. Hỗ trợ rút tiền nhanh 24/7 về mọi ngân hàng tại Việt Nam."
        }
      ],
      seo: {
        tag: "Xây dựng Thương hiệu Cá nhân",
        title: <>Định vị bản thân <br /><span className="text-gradient">Chuyên nghiệp & Uy tín</span></>,
        desc: "Bạn sẽ sở hữu một đường dẫn Portfolio định danh riêng biệt. Đây là vũ khí đắc lực để bạn gắn lên Bio TikTok/Instagram, giúp Brand dễ dàng xem hồ sơ năng lực và booking bạn ngay lập tức.",
        benefits: [
          "Sở hữu Bio Link định danh VIP: [freecast.com/p/ten-cua-ban](https://freecast.com/p/ten-cua-ban)",
          "Thay thế hoàn toàn CV giấy lỗi thời, cập nhật tự động",
          "Tăng 200% tỷ lệ chốt deal khi chào hàng với Brand nhờ sự chuyên nghiệp"
        ],
        mockup: {
          breadcrumb: "profile › ha-linh-official",
          title: "Hà Linh Official - Beauty Blogger | FreeCast Profile",
          desc: "Reviewer uy tín mảng Beauty & Lifestyle. 1.5M Followers. Chuyên review mỹ phẩm high-end và skincare khoa học. Liên hệ booking ngay."
        }
      }
    }
  };

  if (!isClient) return null;

  const currentContent = content[activeTab];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-lg shadow-indigo-500/20"></div>
            FreeCast.
          </div>
          
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/login" className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors px-4 py-2">
              Đăng nhập
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-white text-slate-950 rounded-full text-sm font-bold hover:bg-indigo-50 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
              Tham gia ngay
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-3">
                <Link href="/login" className="text-center w-full py-3 font-semibold text-white bg-white/5 rounded-xl border border-white/10">Đăng nhập</Link>
                <Link href="/register" className="text-center w-full py-3 font-bold text-slate-950 bg-white rounded-xl shadow-lg">Đăng ký tham gia</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] md:blur-[120px] pointer-events-none animate-pulse-slow" />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm font-medium mb-8 backdrop-blur-md text-indigo-300 hover:bg-white/10 transition-colors cursor-default animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Nền tảng Booking Free-cast #1 Việt Nam
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-[1.1]"
          >
            Kết nối Brand & KOL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
              Đơn giản hóa Review.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-xl text-slate-400 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Nền tảng "All-in-one" giúp Nhãn hàng tìm kiếm gương mặt đại diện và Creator kiếm thêm thu nhập từ đam mê.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
          >
            <motion.button 
              onClick={() => scrollToSection('role-selection')} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-14 w-full sm:w-auto px-10 bg-indigo-600 rounded-full font-bold text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/30"
            >
              Khám phá ngay <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* --- MAIN ROLE SWITCHER --- */}
      <section id="role-selection" className="py-16 bg-slate-900/50 border-y border-white/5 scroll-mt-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-slate-400 mb-8 font-medium uppercase tracking-widest text-sm">Bắt đầu hành trình của bạn</p>
            
            <div className="inline-flex bg-slate-950 p-2 rounded-full border border-white/10 relative shadow-2xl">
              <div className={`absolute top-2 bottom-2 w-[calc(50%-8px)] bg-indigo-600 rounded-full transition-all duration-300 ease-out shadow-md ${activeTab === 'kol' ? 'translate-x-[100%] ml-2' : 'translate-x-0'}`}></div>
              <button 
                onClick={() => setActiveTab('brand')}
                className={`relative z-10 px-8 md:px-16 py-4 rounded-full text-sm md:text-lg font-bold transition-colors duration-300 ${activeTab === 'brand' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Nhãn Hàng (Brand)
              </button>
              <button 
                onClick={() => setActiveTab('kol')}
                className={`relative z-10 px-8 md:px-16 py-4 rounded-full text-sm md:text-lg font-bold transition-colors duration-300 ${activeTab === 'kol' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Creator (KOL/KOC)
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Section: Pain Points vs Solutions */}
      <AnimatePresence mode='wait'>
        <motion.section 
          key={`pain-${activeTab}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="py-24 px-4 md:px-6 bg-slate-950"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Tại sao <span className={activeTab === 'brand' ? 'text-indigo-400' : 'text-pink-400'}>
                  {activeTab === 'brand' ? 'Doanh Nghiệp' : 'Creator'}
                </span> chọn FreeCast?
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Chúng tôi thấu hiểu nỗi đau và mang đến giải pháp đột phá giúp bạn tăng trưởng.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              {/* Problem Column */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-3 uppercase tracking-wider bg-red-900/10 p-3 rounded-lg w-fit"><XCircle size={20} /> Vấn đề hiện tại</h3>
                {currentContent.painPoints.map((point, i) => (
                  <div key={i} className="bg-red-950/10 border border-red-500/10 p-6 rounded-2xl flex gap-4 hover:border-red-500/30 transition-all hover:translate-x-1">
                    <div className="min-w-10 min-h-10 w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 mt-1 shrink-0">
                      <Frown size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-200 mb-2 text-lg">{point.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Solution Column */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-3 uppercase tracking-wider bg-emerald-900/10 p-3 rounded-lg w-fit"><CheckCircle size={20} /> Giải pháp Mới</h3>
                {currentContent.solutions.map((sol, i) => (
                  <div key={i} className="bg-emerald-950/10 border border-emerald-500/10 p-6 rounded-2xl flex gap-4 hover:border-emerald-500/30 transition-all hover:translate-x-1 shadow-lg shadow-emerald-500/5">
                    <div className="min-w-10 min-h-10 w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mt-1 shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-200 mb-2 text-lg">{sol.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{sol.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Dynamic Section: Process with Comparison */}
      <section id="process" className="py-24 md:py-32 px-4 md:px-6 bg-slate-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Quy trình làm việc tối ưu</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">So sánh sự khác biệt vượt trội giữa cách làm cũ và công nghệ FreeCast.</p>
          </div>

          <AnimatePresence mode='wait'>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-1/2 z-0"></div>

              {currentContent.process.map((item, i) => (
                <motion.div 
                  key={`process-${activeTab}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="glass-card p-8 rounded-3xl relative hover:-translate-y-2 transition-transform duration-300 bg-slate-950 z-10 border border-white/10 group"
                >
                  <div className="text-6xl font-black text-white/5 absolute top-4 right-6 select-none group-hover:text-indigo-500/10 transition-colors">{item.step}</div>
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 relative z-10 shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform">
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 relative z-10">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed relative z-10 mb-4">{item.desc}</p>
                  
                  {/* Comparison Block */}
                  {item.traditional && (
                    <div className="space-y-4 relative z-10 pt-4 border-t border-white/5">
                      <div className="flex gap-3 items-start opacity-60 group-hover:opacity-100 transition-opacity">
                        <XCircle size={16} className="text-red-500 mt-1 shrink-0" />
                        <p className="text-xs text-slate-400 line-through decoration-slate-600">{item.traditional}</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <CheckCircle size={16} className="text-emerald-500 mt-1 shrink-0" />
                        <p className="text-sm text-white font-medium shadow-black drop-shadow-md">{item.freecast}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </section>

      {/* Dynamic Section: Tech & Features with Comparison */}
      <section id="features" className="py-24 md:py-32 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Công nghệ hỗ trợ</h2>
            <p className="text-slate-400">Nâng tầm hiệu quả nhờ sức mạnh của AI và Big Data.</p>
          </div>

          <AnimatePresence mode='wait'>
            <motion.div 
              key={`features-${activeTab}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {currentContent?.features?.map((feature, i) => (
                <div key={i} className={`glass-card p-8 rounded-3xl flex flex-col justify-start border border-white/5 hover:border-indigo-500/30 transition-all group ${i === 0 ? 'md:col-span-2 bg-gradient-to-br from-indigo-900/20 to-slate-900/50' : ''}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${i === 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    <feature.icon />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{feature.desc}</p>
                  
                  {/* Comparison Block */}
                  {feature.traditional && (
                    <div className="space-y-4 mt-auto pt-4 border-t border-white/5">
                      <div className="flex gap-3 items-start opacity-60">
                        <XCircle size={16} className="text-red-500 mt-1 shrink-0" />
                        <p className="text-xs text-slate-400">{feature.traditional}</p>
                      </div>
                      <div className="flex gap-3 items-start">
                        <CheckCircle size={16} className="text-emerald-500 mt-1 shrink-0" />
                        <p className="text-sm text-white font-medium">{feature.freecast}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Dynamic Feature Spotlight: SEO Native */}
      <section id="seo" className="py-24 px-4 md:px-6 bg-slate-900/20 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-900/10 blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto">
          <AnimatePresence mode='wait'>
            <motion.div 
              key={`seo-${activeTab}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-6 uppercase tracking-wider">
                  <Search size={14} /> {currentContent.seo.tag}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{currentContent.seo.title}</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  {currentContent.seo.desc}
                </p>
                <ul className="space-y-4 mb-8">
                  {currentContent.seo.benefits.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="text-indigo-500" size={20} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex-1 w-full">
                {/* Mockup Google Search Result */}
                <div className="bg-white rounded-xl p-6 shadow-2xl max-w-md mx-auto border border-slate-200 relative transform rotate-1 hover:rotate-0 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs">F</div>
                    <div className="text-xs text-slate-800">FreeCast <span className="text-slate-400">› {currentContent.seo.mockup.breadcrumb}</span></div>
                  </div>
                  <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1">{currentContent.seo.mockup.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentContent.seo.mockup.desc}
                  </p>
                  {/* Decoration */}
                  <div className="absolute -top-4 -right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Google Index</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Bottom - Updated Text */}
      <section className="py-24 px-6 text-center relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-[3rem] border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-slate-900/50"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {activeTab === 'brand' ? 'Sẵn sàng bùng nổ doanh số?' : 'Bắt đầu hành trình Creator?'}
            </h2>
            <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto">
              {activeTab === 'brand' 
                ? 'Tham gia ngay hôm nay để nhận ưu đãi trải nghiệm miễn phí cho chiến dịch đầu tiên.' 
                : 'Kết nối với hàng trăm nhãn hàng và nhận sản phẩm review miễn phí ngay hôm nay.'}
            </p>
            <Link href="/register" className="inline-block px-10 py-4 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95">
              Tạo tài khoản {activeTab === 'brand' ? 'Brand' : 'Creator'}
            </Link>
            <p className="mt-6 text-sm text-slate-500">Miễn phí đăng ký • Hủy bất kỳ lúc nào</p>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="border-t border-white/10 py-16 bg-black/40 backdrop-blur-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
                <span className="font-bold text-xl tracking-tight">FreeCast</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Nền tảng kết nối Brand & KOL hàng đầu Việt Nam. Giải pháp tối ưu cho Influencer Marketing thời đại mới.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">f</div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">in</div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">yt</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Dành cho Brand</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Tìm kiếm KOL</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Đăng Campaign</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Báo giá dịch vụ</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Case Study thành công</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Dành cho Creator</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Tìm việc làm</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Tạo Portfolio</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Cộng đồng KOL</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog chia sẻ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Hỗ trợ & Liên hệ</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2"><Mail size={14}/> support@freecast.vn</li>
                <li className="flex items-center gap-2"><Phone size={14}/> 1900 1234</li>
                <li className="flex items-center gap-2"><MapPin size={14}/> Tầng 12, Keangnam, Hà Nội</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; 2024 FreeCast Vietnam. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}