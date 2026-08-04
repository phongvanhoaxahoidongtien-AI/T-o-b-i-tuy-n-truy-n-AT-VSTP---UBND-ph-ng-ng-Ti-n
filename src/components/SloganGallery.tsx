import React, { useState } from 'react';
import { BookOpen, Copy, Check, Sparkles, Heart, Quote } from 'lucide-react';
import { PROPAGANDA_SLOGANS } from '../data/templates';

export const SloganGallery: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const samplePoems = [
    {
      title: 'Bài thơ: ĐI CHỢ AN TOÀN',
      poem: `Đi chợ chọn mua thực phẩm tươi,
Bà con niềm nở rạng nụ cười.
Thịt hồng, rau sạch, cá còn bơi,
Bữa cơm sum họp ấm tình tôi!`
    },
    {
      title: 'Bài thơ: BẾP ĂN SẠCH SẼ',
      poem: `Dao thớt rửa sạch, lau khô ngay,
Rửa tay xà phòng trước khi làm.
Nấu chín, ăn nóng, đun đun lại,
An toàn thực phẩm cả nhà vui!`
    },
    {
      title: 'Bài thơ: QUÁN VỈA HÈ CHUẨN SẠCH',
      poem: `Hàng quán vỉa hè gọn gàng che,
Thực phẩm sạch sẽ đón khách về.
Dùng găng tay chuẩn, nước vòi sạch,
Khách ăn yên tâm, kinh doanh mê!`
    }
  ];

  const goldenRules = [
    '1. Chọn thực phẩm tươi an toàn.',
    '2. Nấu chín kỹ thức ăn.',
    '3. Ăn ngay sau khi nấu xong.',
    '4. Bảo quản cẩn thận thức ăn đã nấu chín.',
    '5. Đun kỹ lại thức ăn trước khi ăn.',
    '6. Tránh lây nhiễm chéo giữa thực phẩm sống và chín.',
    '7. Rửa tay sạch trước khi chế biến thực phẩm.',
    '8. Giữ bề mặt bếp luôn sạch sẽ.',
    '9. Che đậy thực phẩm khỏi côn trùng, động vật.',
    '10. Sử dụng nguồn nước sạch an toàn.'
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-amber-700 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
            <BookOpen className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Thư Viện Thơ, Khẩu Hiệu & Quy Tắc Vàng</h2>
            <p className="text-sm text-amber-100 mt-0.5">
              Tổng hợp các câu khẩu hiệu ngắn gọn, bài thơ đồng dao dễ nhớ để tuyên truyền cho bà con nhân dân.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slogans List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Khẩu Hiệu Tuyên Truyền Ngắn Gọn
          </h3>

          <div className="space-y-3">
            {PROPAGANDA_SLOGANS.map((slogan, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-gray-50 hover:bg-amber-50/60 rounded-xl border border-gray-200/80 transition flex items-center justify-between gap-3 group"
              >
                <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                  "{slogan}"
                </p>
                <button
                  onClick={() => handleCopy(slogan, idx)}
                  className="p-2 text-gray-400 hover:text-red-600 bg-white rounded-lg border border-gray-200 shadow-xs transition shrink-0"
                  title="Sao chép câu này"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Poems & Rhymes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Quote className="w-5 h-5 text-red-600" />
            Thơ Dễ Thuộc Cho Người Dân
          </h3>

          <div className="space-y-4">
            {samplePoems.map((p, idx) => (
              <div key={idx} className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    {p.title}
                  </h4>
                  <button
                    onClick={() => handleCopy(p.poem, idx + 100)}
                    className="p-1.5 text-amber-800 hover:text-red-700 bg-white rounded-md border border-amber-200 transition text-xs flex items-center gap-1 font-bold"
                  >
                    {copiedIndex === idx + 100 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy bài thơ</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 italic whitespace-pre-line leading-relaxed font-serif">
                  {p.poem}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10 Golden Rules */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Heart className="w-5 h-5 text-emerald-600" />
          10 Nguyên Tắc Vàng Chế Biến Thực Phẩm An Toàn
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {goldenRules.map((rule, idx) => (
            <div key={idx} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs font-semibold text-emerald-950">
              {rule}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
