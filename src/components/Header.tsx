import React, { useState } from 'react';
import { Sparkles, Image, BookOpen, BookmarkCheck, Edit3, HeartHandshake, Building2, Phone, MapPin, X, Save, ShieldCheck, Flag } from 'lucide-react';
import { AgencyInfo } from '../types';

interface HeaderProps {
  agencyInfo: AgencyInfo;
  setAgencyInfo: (info: AgencyInfo) => void;
  activeTab: 'generator' | 'poster' | 'slogans' | 'saved';
  setActiveTab: (tab: 'generator' | 'poster' | 'slogans' | 'saved') => void;
  savedCount: number;
}

// Vietnam Red Flag with Gold Star Component (Cờ Đỏ Sao Vàng)
export const VietnamFlag: React.FC<{ className?: string }> = ({ className = "w-11 h-8" }) => (
  <svg viewBox="0 0 300 200" className={`${className} shadow-md rounded border border-amber-300/40 shrink-0`} xmlns="http://www.w3.org/2000/svg">
    {/* Red Background */}
    <rect width="300" height="200" fill="#DA251D" rx="4" />
    {/* Five-Pointed Yellow Star */}
    <polygon points="150,35 164.7,80.2 212.3,80.2 173.8,108.2 188.5,153.4 150,125.4 111.5,153.4 126.2,108.2 87.7,80.2 135.3,80.2" fill="#FFD700" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  agencyInfo,
  setAgencyInfo,
  activeTab,
  setActiveTab,
  savedCount
}) => {
  const [isEditingAgency, setIsEditingAgency] = useState(false);
  const [tempInfo, setTempInfo] = useState<AgencyInfo>(agencyInfo);

  const handleOpenEdit = () => {
    setTempInfo(agencyInfo);
    setIsEditingAgency(true);
  };

  const handleSaveAgency = (e: React.FormEvent) => {
    e.preventDefault();
    setAgencyInfo(tempInfo);
    setIsEditingAgency(false);
  };

  const handlePresetSelect = (departmentPreset: string) => {
    setTempInfo(prev => ({
      ...prev,
      departmentName: departmentPreset
    }));
  };

  return (
    <header className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white shadow-lg sticky top-0 z-50">
      {/* Top emblem bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 border-b border-red-500/40 gap-3">
          <div className="flex items-center space-x-3">
            {/* Vietnam Flag Logo */}
            <div className="p-1 rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 shadow-xl border-2 border-amber-200 shrink-0 flex items-center justify-center">
              <VietnamFlag className="w-12 h-8" />
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  {agencyInfo.wardName}
                </h1>
                <span className="bg-amber-400 text-red-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                  {agencyInfo.departmentName}
                </span>

                <button
                  onClick={handleOpenEdit}
                  className="bg-white/15 hover:bg-white/25 text-amber-200 hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-white/20 shadow-xs"
                  title="Chỉnh sửa thông tin cơ quan quản lý"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sửa CQ Quản Lý</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-amber-100 font-medium flex items-center gap-1.5 mt-1 flex-wrap">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Trình Tạo Bài Đăng & Poster ATVSTP</span>
                <span className="text-amber-300 hidden sm:inline">•</span>
                <span className="text-amber-200 font-semibold">{agencyInfo.address}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-red-900/70 backdrop-blur px-3.5 py-2 rounded-2xl border border-red-400/40 shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-amber-200">Chiến dịch:</span>
              <span className="text-white font-bold">{agencyInfo.campaignName}</span>
            </div>
            <div className="h-3 w-px bg-red-400/50"></div>
            <div className="flex items-center gap-1 text-amber-300 font-bold">
              <Phone className="w-3.5 h-3.5" />
              <span>HL: {agencyInfo.hotline}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar space-x-2 sm:space-x-4 py-2 mt-1">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'generator'
                ? 'bg-white text-red-700 shadow-md transform scale-[1.02]'
                : 'text-amber-100 hover:bg-red-800/50 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Tạo Nội Dung AI
          </button>

          <button
            onClick={() => setActiveTab('poster')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'poster'
                ? 'bg-white text-red-700 shadow-md transform scale-[1.02]'
                : 'text-amber-100 hover:bg-red-800/50 hover:text-white'
            }`}
          >
            <Image className="w-4 h-4 text-amber-500" />
            Thiết Kế Poster / Banner
          </button>

          <button
            onClick={() => setActiveTab('slogans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'slogans'
                ? 'bg-white text-red-700 shadow-md transform scale-[1.02]'
                : 'text-amber-100 hover:bg-red-800/50 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            Thơ & Khẩu Hiệu Mẫu
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap relative ${
              activeTab === 'saved'
                ? 'bg-white text-red-700 shadow-md transform scale-[1.02]'
                : 'text-amber-100 hover:bg-red-800/50 hover:text-white'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-amber-500" />
            Kho Bài Đăng ({savedCount})
          </button>
        </div>
      </div>

      {/* EDIT AGENCY MANAGEMENT MODAL */}
      {isEditingAgency && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto text-gray-900 font-sans">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-red-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <VietnamFlag className="w-10 h-7" />
                <div>
                  <h3 className="text-lg font-extrabold flex items-center gap-1.5">
                    <Building2 className="w-5 h-5 text-amber-300" />
                    Chỉnh Sửa Cơ Quan Quản Lý & Đơn Vị Sử Dụng
                  </h3>
                  <p className="text-xs text-amber-100">
                    Cập nhật đầy đủ thông tin địa phương để tự động hiển thị lên bài đăng & poster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingAgency(false)}
                className="p-1 text-amber-200 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgency} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Field 1: Phòng/Ban/Tổ dân phố */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-red-600" />
                  Phòng / Ban / Tổ Dân Phố Sử Dụng
                </label>
                <input
                  type="text"
                  value={tempInfo.departmentName}
                  onChange={(e) => setTempInfo({ ...tempInfo, departmentName: e.target.value })}
                  placeholder="VD: Ban Chỉ đạo ATVSTP & Trạm Y tế Phường..."
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[11px] font-semibold text-gray-500">Mẫu chọn nhanh:</span>
                  {[
                    'Ban Chỉ đạo ATVSTP',
                    'Trạm Y tế Phường',
                    'Tổ Dân Phố 5',
                    'Phòng Văn hóa & Thông tin',
                    'Hội Liên hiệp Phụ nữ'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className="text-[11px] font-medium bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-md transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Tên Phường / Xã */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  Tên Phường / Xã / Đơn Vị Chủ Quản
                </label>
                <input
                  type="text"
                  value={tempInfo.wardName}
                  onChange={(e) => setTempInfo({ ...tempInfo, wardName: e.target.value })}
                  placeholder="VD: UBND Phường Đông Tiến"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
              </div>

              {/* Field 3: Tên chiến dịch */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-amber-600" />
                  Tên Chiến Dịch Truyền Thông
                </label>
                <input
                  type="text"
                  value={tempInfo.campaignName}
                  onChange={(e) => setTempInfo({ ...tempInfo, campaignName: e.target.value })}
                  placeholder="VD: Tháng hành động vì An toàn thực phẩm 2026..."
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
              </div>

              {/* Field 4: Địa chỉ */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-600" />
                  Địa Chỉ Trụ Sở / Địa Bàn Phường
                </label>
                <input
                  type="text"
                  value={tempInfo.address}
                  onChange={(e) => setTempInfo({ ...tempInfo, address: e.target.value })}
                  placeholder="VD: Số 123 Đường Lý Thái Tổ, Phường Đông Tiến..."
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              {/* Field 5: Số điện thoại Hotline */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-red-600" />
                  Số Điện Thoại Hotline Liên Hệ (Hiển Thị Trên Bài Đăng & Poster)
                </label>
                <input
                  type="text"
                  value={tempInfo.hotline}
                  onChange={(e) => setTempInfo({ ...tempInfo, hotline: e.target.value })}
                  placeholder="VD: 0988.123.456 - 024.3825.1115"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-bold text-red-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  required
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  💡 Số điện thoại này sẽ tự động gắn vào cuối bài đăng Mạng xã hội, Kịch bản loa phát thanh, và khung Hotline của Poster.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">📌 Lưu ý kiểm tra:</span>
                <p>Mọi thông tin trên sẽ được dùng làm ngữ cảnh chuẩn xác nhất để AI tạo bài viết và trình tạo Poster thiết kế ấn phẩm.</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditingAgency(false)}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>LƯU THÔNG TIN CƠ QUAN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

