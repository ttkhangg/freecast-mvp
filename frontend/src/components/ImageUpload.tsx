'use client';
import { useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    // --- CẤU HÌNH CLOUDINARY (Hãy điền đúng thông tin của bạn) ---
    const UPLOAD_PRESET = 'freecast_preset'; 
    const CLOUD_NAME = 'dhf1fioml'; // Dựa theo log lỗi của bạn, đây là cloud name
    // -----------------------------------------------------------
    
    // FIX QUAN TRỌNG: Thêm preset vào form data
    formData.append('upload_preset', UPLOAD_PRESET);

    // Tạo URL upload sạch sẽ, không dính ký tự lạ
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    try {
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Cloudinary Error Detail:", data);
        // Hiển thị lỗi cụ thể từ Cloudinary (VD: Preset not found...)
        throw new Error(data.error?.message || 'Upload failed');
      }
      
      onChange(data.secure_url); // Trả về link ảnh thật
    } catch (err: any) {
      console.error("Upload Error:", err);
      alert(`Lỗi upload ảnh: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src={value} alt="Product" className="w-full h-full object-contain" />
           <button 
             type="button" // QUAN TRỌNG: Ngăn chặn submit form cha
             onClick={() => onChange('')} 
             className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
             title="Xóa ảnh"
            >
             <X size={16}/>
           </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all relative">
           {loading ? <Loader2 className="animate-spin text-indigo-600 w-8 h-8"/> : (
             <>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3">
                    <ImagePlus size={24}/>
                </div>
                <span className="text-sm text-slate-700 font-bold">Tải ảnh sản phẩm</span>
                <span className="text-xs text-slate-400 mt-1">PNG, JPG (Max 5MB)</span>
             </>
           )}
           <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={loading} />
        </label>
      )}
    </div>
  );
}
