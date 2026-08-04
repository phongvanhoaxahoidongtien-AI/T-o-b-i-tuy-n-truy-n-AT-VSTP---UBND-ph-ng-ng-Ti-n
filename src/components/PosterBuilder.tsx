import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Shield, Sparkles, Phone, CheckCircle2, AlertTriangle, Layers, Palette, RefreshCw, Building2, MapPin } from 'lucide-react';
import { PosterConfig, AgencyInfo } from '../types';
import { VietnamFlag } from './Header';

interface PosterBuilderProps {
  initialConfig?: Partial<PosterConfig>;
  wardName: string;
  agencyInfo?: AgencyInfo;
}

export const PosterBuilder: React.FC<PosterBuilderProps> = ({
  initialConfig,
  wardName,
  agencyInfo
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [config, setConfig] = useState<PosterConfig>({
    title: initialConfig?.title || '5 NGUYÊN TẮC VÀNG AN TOÀN THỰC PHẨM',
    subtitle: initialConfig?.subtitle || 'Chung tay vì sức khỏe & sự an tâm của từng bữa ăn gia đình',
    slogan: initialConfig?.slogan || 'Thực phẩm sạch - Bữa ăn ngon - Cả nhà an khang!',
    bulletPoints: initialConfig?.bulletPoints && initialConfig.bulletPoints.length > 0
      ? initialConfig.bulletPoints
      : [
          '1. Chọn thực phẩm tươi sống, có nguồn gốc kiểm định rõ ràng.',
          '2. Thực hiện nghiêm túc ĂN CHÍNH, UỐNG SÔI.',
          '3. Giữ vệ sinh dụng cụ chế biến & rửa tay bằng xà phòng.',
          '4. Bảo quản thức ăn trong tủ lạnh, đun kỹ trước khi ăn lại.',
          '5. Không sử dụng thực phẩm ôi thiu, biến màu, có mùi lạ.'
        ],
    themeColor: initialConfig?.themeColor || 'red_gold',
    wardName: agencyInfo?.departmentName 
      ? `${agencyInfo.departmentName} - ${agencyInfo.wardName}` 
      : (initialConfig?.wardName || wardName),
    hotline: agencyInfo?.hotline || initialConfig?.hotline || '0988.123.456 - 024.3825.1115',
    badgeText: initialConfig?.badgeText || agencyInfo?.campaignName || 'TRUYỀN THÔNG CÔNG CỘNG',
    imageUrl: initialConfig?.imageUrl
  });

  const [newBulletText, setNewBulletText] = useState('');

  const handleDownloadPng = async () => {
    if (!posterRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(posterRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `poster-tuyen-truyen-atvstp-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
      alert('Không thể tạo file ảnh. Vui lòng thử lại.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddBullet = () => {
    if (newBulletText.trim()) {
      setConfig({
        ...config,
        bulletPoints: [...config.bulletPoints, newBulletText.trim()]
      });
      setNewBulletText('');
    }
  };

  const handleRemoveBullet = (index: number) => {
    setConfig({
      ...config,
      bulletPoints: config.bulletPoints.filter((_, idx) => idx !== index)
    });
  };

  const getThemeStyles = () => {
    switch (config.themeColor) {
      case 'red_gold':
        return {
          bg: 'bg-gradient-to-b from-red-700 via-red-800 to-red-900',
          headerBg: 'bg-amber-400 text-red-950',
          accentBorder: 'border-amber-400',
          titleColor: 'text-amber-300',
          boxBg: 'bg-red-950/60 border-amber-400/40 text-amber-50',
          sloganBg: 'bg-amber-400 text-red-950',
          badgeBg: 'bg-amber-400 text-red-950'
        };
      case 'green_fresh':
        return {
          bg: 'bg-gradient-to-b from-emerald-800 via-emerald-900 to-teal-950',
          headerBg: 'bg-emerald-300 text-emerald-950',
          accentBorder: 'border-emerald-400',
          titleColor: 'text-emerald-200',
          boxBg: 'bg-emerald-950/60 border-emerald-400/40 text-emerald-50',
          sloganBg: 'bg-emerald-300 text-emerald-950',
          badgeBg: 'bg-emerald-300 text-emerald-950'
        };
      case 'orange_warning':
        return {
          bg: 'bg-gradient-to-b from-orange-600 via-amber-700 to-red-900',
          headerBg: 'bg-amber-300 text-orange-950',
          accentBorder: 'border-amber-300',
          titleColor: 'text-amber-200',
          boxBg: 'bg-orange-950/60 border-amber-300/40 text-amber-50',
          sloganBg: 'bg-amber-300 text-orange-950',
          badgeBg: 'bg-amber-300 text-orange-950'
        };
      case 'blue_trust':
        return {
          bg: 'bg-gradient-to-b from-blue-800 via-indigo-900 to-slate-950',
          headerBg: 'bg-cyan-300 text-slate-950',
          accentBorder: 'border-cyan-300',
          titleColor: 'text-cyan-200',
          boxBg: 'bg-slate-900/70 border-cyan-300/40 text-cyan-50',
          sloganBg: 'bg-cyan-300 text-slate-950',
          badgeBg: 'bg-cyan-300 text-slate-950'
        };
      default:
        return {
          bg: 'bg-gradient-to-b from-red-700 via-red-800 to-red-900',
          headerBg: 'bg-amber-400 text-red-950',
          accentBorder: 'border-amber-400',
          titleColor: 'text-amber-300',
          boxBg: 'bg-red-950/60 border-amber-400/40 text-amber-50',
          sloganBg: 'bg-amber-400 text-red-950',
          badgeBg: 'bg-amber-400 text-red-950'
        };
    }
  };

  const themeStyle = getThemeStyles();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Controls & Editor */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-red-600" />
            Tùy Chỉnh Poster Tuyên Truyền
          </h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            Xuất file PNG
          </span>
        </div>

        {/* Theme Picker */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Màu chủ đạo Banner
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'red_gold', label: '🇻🇳 Đỏ - Vàng (UBND)', color: 'bg-red-700' },
              { id: 'green_fresh', label: '🥬 Xanh Lá (Sạch)', color: 'bg-emerald-700' },
              { id: 'orange_warning', label: '🍊 Cam (Cảnh báo)', color: 'bg-orange-600' },
              { id: 'blue_trust', label: '🌊 Xanh Dương (Y tế)', color: 'bg-blue-700' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setConfig({ ...config, themeColor: t.id as any })}
                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  config.themeColor === t.id
                    ? 'border-red-600 bg-red-50 text-red-900 shadow-xs ring-2 ring-red-400/30'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${t.color} shrink-0`}></span>
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Tên Đơn vị / Phường:</label>
            <input
              type="text"
              value={config.wardName}
              onChange={(e) => setConfig({ ...config, wardName: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Tiêu đề Poster:</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Phụ đề / Thông điệp phụ:</label>
            <input
              type="text"
              value={config.subtitle}
              onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Khẩu hiệu chính:</label>
            <input
              type="text"
              value={config.slogan}
              onChange={(e) => setConfig({ ...config, slogan: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Hotline Trạm Y tế Phường:</label>
            <input
              type="text"
              value={config.hotline}
              onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Bullet Points List Manager */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Nội dung tuyên truyền trọng tâm:</label>
            <div className="space-y-1.5 mb-2">
              {config.bulletPoints.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-700 flex-1">{pt}</span>
                  <button
                    onClick={() => handleRemoveBullet(idx)}
                    className="text-red-500 hover:text-red-700 font-bold px-1.5"
                    title="Xóa dòng này"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newBulletText}
                onChange={(e) => setNewBulletText(e.target.value)}
                placeholder="Thêm dòng quy tắc mới..."
                className="flex-1 p-2 border border-gray-300 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={handleAddBullet}
                className="px-3 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
              >
                + Thêm
              </button>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-2">
          <button
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>{isDownloading ? 'Đang tạo ảnh...' : 'TẢI POSTER PNG VỀ MÁY'}</span>
          </button>
        </div>
      </div>

      {/* RIGHT: LIVE CANVAS PREVIEW */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full mb-3 flex items-center justify-between text-xs text-gray-500 px-1">
          <span className="font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1">
            <Shield className="w-4 h-4 text-red-600" />
            Xem Trước Poster Tuyên Truyền Phường
          </span>
          <span>Kích thước tiêu chuẩn poster A4 / Ảnh Mạng Xã Hội</span>
        </div>

        {/* Renderable Canvas Element */}
        <div
          ref={posterRef}
          className={`w-full max-w-lg aspect-[3/4] p-8 rounded-3xl shadow-2xl text-white flex flex-col justify-between relative overflow-hidden border-4 border-white ${themeStyle.bg}`}
        >
          {/* Subtle background graphics */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none"></div>

          {/* Top Header Seal */}
          <div className="text-center space-y-2 relative z-10 border-b border-white/20 pb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-md bg-amber-400 text-red-950 border border-amber-300">
              <VietnamFlag className="w-5 h-3.5 shrink-0 shadow-xs rounded-2xs" />
              <span>{config.wardName}</span>
            </div>

            <h1 className={`text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight mt-2 ${themeStyle.titleColor}`}>
              {config.title}
            </h1>

            <p className="text-xs text-white/90 font-medium max-w-xs mx-auto italic">
              {config.subtitle}
            </p>
          </div>

          {/* Optional Illustration Banner */}
          {config.imageUrl && (
            <div className="my-2 rounded-xl overflow-hidden border-2 border-white/30 max-h-36 shadow-lg">
              <img src={config.imageUrl} alt="Ảnh minh họa" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Core Content Box */}
          <div className={`p-5 rounded-2xl border backdrop-blur-md space-y-3 relative z-10 my-auto shadow-inner ${themeStyle.boxBg}`}>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              QUY TẮC AN TOÀN TRỌNG TÂM
            </h3>

            <ul className="space-y-2 text-xs sm:text-sm font-medium leading-relaxed">
              {config.bulletPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-amber-300 shrink-0">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Slogan Banner */}
          <div className={`p-3.5 rounded-xl text-center shadow-lg relative z-10 my-2 ${themeStyle.sloganBg}`}>
            <p className="text-xs sm:text-sm font-black tracking-tight leading-snug">
              "{config.slogan}"
            </p>
          </div>

          {/* Bottom Footer Hotline */}
          <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[11px] relative z-10">
            <div className="flex items-center gap-1.5 font-bold text-amber-200">
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>Hotline Y Tế Phường: {config.hotline}</span>
            </div>

            <div className="text-white/80 font-semibold">
              UBND Phường Vì Dân
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
