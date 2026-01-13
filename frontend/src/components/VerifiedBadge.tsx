import React from 'react';

export default function VerifiedBadge() {
  return (
    <div className="relative inline-flex items-center justify-center ml-1 align-middle group cursor-help">
      {/* 1. ICON TICK XANH (Facebook Style) */}
      {/* Sử dụng SVG trực tiếp để có màu xanh đặc trưng và dấu tích trắng chuẩn */}
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
      >
        <path 
          d="M22.5 12.0001C22.5 13.9168 21.8418 15.6599 20.7324 17.0396C20.4851 17.3503 20.3957 17.7554 20.4827 18.1432C20.8718 19.8787 20.2198 21.6841 18.7303 22.8222C17.2346 23.9654 15.1979 24.129 13.541 23.2388C13.1704 23.0396 12.7297 23.0396 12.3592 23.2388C10.7023 24.129 8.66556 23.9654 7.16987 22.8222C5.68041 21.6841 5.02844 19.8787 5.41753 18.1432C5.50449 17.7554 5.41508 17.3503 5.16782 17.0396C4.05836 15.6599 3.40015 13.9168 3.40015 12.0001C3.40015 10.0834 4.05836 8.34027 5.16782 6.96058C5.41508 6.64991 5.50449 6.24479 5.41753 5.85698C5.02844 4.1215 5.68041 2.31608 7.16987 1.17801C8.66556 0.0347872 10.7023 -0.128796 12.3592 0.761366C12.7297 0.960527 13.1704 0.960527 13.541 0.761366C15.1979 -0.128796 17.2346 0.0347872 18.7303 1.17801C20.2198 2.31608 20.8718 4.1215 20.4827 5.85698C20.3957 6.24479 20.4851 6.64991 20.7324 6.96058C21.8418 8.34027 22.5 10.0834 22.5 12.0001Z" 
          fill="#1877F2" 
        />
        <path 
          d="M10.4545 16.0909L6.81818 12.4545L8.09091 11.1818L10.4545 13.5454L17.8182 6.18182L19.0909 7.45454L10.4545 16.0909Z" 
          fill="white" 
        />
      </svg>

      {/* 2. TOOLTIP (Hiện khi Hover) */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="bg-slate-800 text-white text-[11px] rounded-lg py-2 px-3 shadow-xl border border-slate-700 leading-relaxed text-center relative">
          {/* Mũi tên nhỏ trỏ xuống */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
          
          {/* Nội dung text */}
          Các tài khoản có huy hiệu đã xác minh đều đã được xác thực và có thể là người đăng ký dịch vụ FreeCast đã xác minh hoặc cá nhân/thương hiệu nổi tiếng.
        </div>
      </div>
    </div>
  );
}