import React, { useState } from 'react';
import { Sparkles, UtensilsCrossed, Sun, GraduationCap, ShoppingBag, Ambulance, Flag, MessageSquare, HeartHandshake, HelpCircle, CheckCircle2, Link, Newspaper, Brain, X, Plus, AlertCircle, RefreshCw, Building2, Phone, MapPin, Edit3 } from 'lucide-react';
import { TOPIC_PRESETS, TopicPreset } from '../data/templates';
import { PostRequest, PostType, ContentTone, TargetAudience, ContentLength, NewsReference, StylePreference, AgencyInfo } from '../types';

interface PostGeneratorProps {
  onGenerate: (request: PostRequest) => void;
  isLoading: boolean;
  wardName: string;
  agencyInfo?: AgencyInfo;
  onUpdateAgencyInfo?: (info: AgencyInfo) => void;
  learnedStyleRules: string[];
  sampleEdits: StylePreference[];
  onUpdateStyleRules: (rules: string[]) => void;
}

const PRESET_NEWS_LINKS = [
  {
    label: "VnExpress: Đột xuất kiểm tra ATTP",
    url: "https://vnexpress.net/thoi-su/tang-cuong-kiem-tra-ve-sinh-an-toan-thuc-pham.html"
  },
  {
    label: "Tuổi Trẻ: Cảnh báo ngộ độc thực phẩm mùa hè",
    url: "https://tuoitre.vn/canh-bao-ngo-doc-thuc-pham-trong-mua-nang-nong.htm"
  },
  {
    label: "Báo Sức Khỏe: Mẹo chọn hải sản tươi sạch",
    url: "https://suckhoedoisong.vn/huong-dan-chon-thuc-pham-tuoi-song-an-toan-cho-gia-dinh.htm"
  }
];

export const PostGenerator: React.FC<PostGeneratorProps> = ({
  onGenerate,
  isLoading,
  wardName,
  agencyInfo,
  onUpdateAgencyInfo,
  learnedStyleRules,
  sampleEdits,
  onUpdateStyleRules,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPIC_PRESETS[0].title);
  const [customPrompt, setCustomPrompt] = useState<string>(TOPIC_PRESETS[0].defaultPrompt);
  const [postType, setPostType] = useState<PostType>('social');
  const [tone, setTone] = useState<ContentTone>('friendly');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('all_citizens');
  const [length, setLength] = useState<ContentLength>('short');
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);
  const [includeHotline, setIncludeHotline] = useState<boolean>(true);
  const [customNotes, setCustomNotes] = useState<string>('');

  // News URL parsing state
  const [newsUrl, setNewsUrl] = useState<string>('');
  const [isParsingNews, setIsParsingNews] = useState<boolean>(false);
  const [newsReference, setNewsReference] = useState<NewsReference | null>(null);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Style modal state
  const [useLearnedStyle, setUseLearnedStyle] = useState<boolean>(true);
  const [showStyleModal, setShowStyleModal] = useState<boolean>(false);
  const [newCustomRule, setNewCustomRule] = useState<string>('');

  // Agency Edit Inline Modal
  const [showAgencyModal, setShowAgencyModal] = useState<boolean>(false);
  const [tempAgency, setTempAgency] = useState<AgencyInfo>(
    agencyInfo || {
      wardName: wardName || 'UBND Phường Đông Tiến',
      departmentName: 'Ban Chỉ đạo ATVSTP & Trạm Y tế Phường',
      campaignName: 'Tháng hành động vì An toàn thực phẩm 2026',
      address: 'Số 123 Đường Lý Thái Tổ, Phường Đông Tiến',
      hotline: '0988.123.456 - 024.3825.1115'
    }
  );

  const handleSelectPreset = (preset: TopicPreset) => {
    setSelectedTopic(preset.title);
    setCustomPrompt(preset.defaultPrompt);
  };

  const handleParseNewsUrl = async (urlToParse?: string) => {
    const targetUrl = urlToParse || newsUrl;
    if (!targetUrl.trim()) {
      setNewsError("Vui lòng nhập hoặc chọn một link báo chí");
      return;
    }

    setNewsError(null);
    setIsParsingNews(true);
    try {
      const res = await fetch("/api/parse-article-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setNewsReference(data.data);
        setCustomPrompt(`Truyền thông theo tin báo chí: "${data.data.title}"`);
        setSelectedTopic('Tin tức báo chí');
        if (data.data.suggestedAction) {
          setCustomNotes(`Vận dụng từ báo chí: ${data.data.suggestedAction}`);
        }
      } else {
        setNewsError(data.error || "Không thể lấy thông tin từ link báo chí này.");
      }
    } catch (err: any) {
      console.error(err);
      setNewsError("Lỗi kết nối khi trích xuất tin báo chí.");
    } finally {
      setIsParsingNews(false);
    }
  };

  const handleAddCustomRule = () => {
    if (newCustomRule.trim()) {
      onUpdateStyleRules([...learnedStyleRules, newCustomRule.trim()]);
      setNewCustomRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    const updated = learnedStyleRules.filter((_, i) => i !== index);
    onUpdateStyleRules(updated);
  };

  const handleSaveAgencyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateAgencyInfo) {
      onUpdateAgencyInfo(tempAgency);
    }
    setShowAgencyModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      topic: customPrompt || selectedTopic,
      postType,
      tone,
      targetAudience,
      length,
      includeHashtags,
      includeHotline,
      customNotes,
      wardName: agencyInfo?.wardName || wardName,
      agencyInfo,
      newsReference: newsReference || undefined,
      learnedStyleRules: useLearnedStyle ? learnedStyleRules : undefined,
      sampleEdits: useLearnedStyle ? sampleEdits : undefined,
    });
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-amber-600" />;
      case 'Sun': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case 'Ambulance': return <Ambulance className="w-5 h-5 text-red-600" />;
      case 'Flag': return <Flag className="w-5 h-5 text-red-600" />;
      default: return <UtensilsCrossed className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 p-6 border-b border-red-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 text-white rounded-xl shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Soạn Bài Đăng Tuyên Truyền An Toàn Thực Phẩm AI
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Tạo bài viết ngắn gọn, kịch bản loa phát thanh, ảnh minh họa & học phong cách cán bộ {agencyInfo?.wardName || wardName}.
              </p>
            </div>
          </div>

          {/* AI Style badge */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowStyleModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Brain className="w-4 h-4 text-purple-200" />
              <span>AI Phong cách học ({learnedStyleRules.length})</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">

        {/* FEATURE 2: Learned Style Preference Bar */}
        {learnedStyleRules.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5">
              <Brain className="w-5 h-5 text-purple-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                  Đã áp dụng {learnedStyleRules.length} quy tắc phong cách AI đã học từ Cán bộ Phường
                </h4>
                <p className="text-xs text-purple-800 mt-0.5 line-clamp-1">
                  Ví dụ: "{learnedStyleRules[0]}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <label className="flex items-center gap-1.5 text-xs font-bold text-purple-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLearnedStyle}
                  onChange={(e) => setUseLearnedStyle(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                />
                <span>Áp dụng phong cách học</span>
              </label>

              <button
                type="button"
                onClick={() => setShowStyleModal(true)}
                className="text-xs font-bold text-purple-700 underline hover:text-purple-900"
              >
                Quản lý quy tắc
              </button>
            </div>
          </div>
        )}

        {/* Topic Presets */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center justify-between">
            <span>1. Chọn chủ đề tuyên truyền phổ biến:</span>
            <span className="text-xs font-normal text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Khuyên dùng cho UBND Phường
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TOPIC_PRESETS.map((preset) => {
              const isSelected = selectedTopic === preset.title;
              return (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 relative ${
                    isSelected
                      ? 'border-red-500 bg-red-50/60 ring-2 ring-red-400/30 shadow-sm'
                      : 'border-gray-200 hover:border-red-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-xs border border-gray-100 shrink-0 mt-0.5">
                    {getPresetIcon(preset.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate flex items-center gap-1.5">
                      {preset.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                      {preset.description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 absolute top-2 right-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed prompt / custom topic */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1.5">
            2. Nội dung hoặc yêu cầu chi tiết của bài đăng:
          </label>
          <textarea
            rows={3}
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              setSelectedTopic('Chủ đề tùy chỉnh');
            }}
            placeholder="Ví dụ: Tuyên truyền cho các quán ăn vỉa hè khu vực Chợ Phường giữ gìn vệ sinh, che đậy thức ăn, dùng găng tay..."
            className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
          />
        </div>

        {/* FEATURE 1: Paste News Article Link */}
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-5 rounded-2xl border border-blue-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <span>Dán Link Bài Báo Chí (1-Click AI Tự Động Trích Xuất Reference):</span>
            </label>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
              Tham khảo tin tức
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Link className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={newsUrl}
                onChange={(e) => {
                  setNewsUrl(e.target.value);
                  setNewsError(null);
                }}
                placeholder="Dán đường dẫn bài báo (VD: https://vnexpress.net/... hoặc tuoitre.vn/...)"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
            </div>
            <button
              type="button"
              onClick={() => handleParseNewsUrl()}
              disabled={isParsingNews}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
            >
              {isParsingNews ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang bóc tách tin báo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>1-Click Trích Xuất Báo Chí</span>
                </>
              )}
            </button>
          </div>

          {/* Quick preset news links */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-semibold text-gray-500">Mẫu báo có sẵn:</span>
            {PRESET_NEWS_LINKS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setNewsUrl(item.url);
                  handleParseNewsUrl(item.url);
                }}
                className="text-xs font-medium bg-white text-blue-700 border border-blue-200 hover:bg-blue-100/70 px-2.5 py-1 rounded-lg transition"
              >
                {item.label}
              </button>
            ))}
          </div>

          {newsError && (
            <div className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{newsError}</span>
            </div>
          )}

          {/* Extracted News Card */}
          {newsReference && (
            <div className="bg-white p-4 rounded-xl border border-blue-300 shadow-sm space-y-2 relative">
              <button
                type="button"
                onClick={() => setNewsReference(null)}
                className="absolute top-2.5 right-2.5 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Hủy tham chiếu báo này"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {newsReference.sourceName || 'Báo chí'}
                </span>
                <span className="text-xs text-blue-900 font-bold truncate pr-6">
                  {newsReference.title}
                </span>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                <span className="font-bold text-blue-950">Tóm tắt tin: </span>
                {newsReference.summary}
              </p>

              {newsReference.keyFacts && newsReference.keyFacts.length > 0 && (
                <div className="text-xs text-gray-800 space-y-1">
                  <span className="font-bold text-gray-900">Chi tiết nổi bật:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-700 pl-1">
                    {newsReference.keyFacts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}

              {newsReference.suggestedAction && (
                <div className="text-xs text-emerald-900 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-medium">
                  💡 <span className="font-bold">Gợi ý vận dụng cho Phường:</span> {newsReference.suggestedAction}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Configurations grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          {/* Post Format */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Dạng nội dung
            </label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as PostType)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="social">📱 Mạng xã hội (Facebook/Zalo)</option>
              <option value="broadcast">📢 Bản tin loa phát thanh Phường</option>
              <option value="rhyme">📜 Thơ / Đồng dao dễ nhớ</option>
              <option value="official">📜 Thông báo chính thức từ UBND</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Giọng văn truyền thông
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ContentTone)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="friendly">💚 Thân thiện, gần gũi, ấm áp</option>
              <option value="instructive">📋 Hướng dẫn từng bước dễ hiểu</option>
              <option value="warning">🚨 Cảnh báo nhắc nhở nhẹ nhàng</option>
              <option value="poetry">🎶 Vui tươi, vần điệu dễ thuộc</option>
              <option value="official">🏢 Trang trọng, rõ ràng</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Đối tượng tiếp nhận
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="all_citizens">👨‍👩‍👧‍👦 Toàn thể bà con nhân dân</option>
              <option value="food_vendors">🍲 Hộ kinh doanh & Quán vỉa hè</option>
              <option value="housewives">🛒 Các bà, các mẹ đi chợ</option>
              <option value="school_kitchens">🏫 Bếp ăn trường học & Công ty</option>
              <option value="elderly">👵 Người cao tuổi & Trẻ em</option>
            </select>
          </div>
        </div>

        {/* Additional Toggles & Custom Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Độ dài bài viết
            </label>
            <div className="flex space-x-2">
              {[
                { id: 'short', label: 'Ngắn gọn (3-5 câu)' },
                { id: 'medium', label: 'Vừa phải' },
                { id: 'detailed', label: 'Chi tiết đầy đủ' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setLength(item.id as ContentLength)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition border ${
                    length === item.id
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6 pt-3 md:pt-0">
            <label className="flex items-center space-x-2 text-sm text-gray-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeHotline}
                onChange={(e) => setIncludeHotline(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span>Gắn Hotline Y tế Phường ({agencyInfo?.hotline || 'Hiển thị cuối bài'})</span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span>Tự động tạo Hashtags</span>
            </label>
          </div>
        </div>

        {/* Extra Note input */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Ghi chú thêm từ Cán bộ Phường (Thời gian kiểm tra, địa điểm cụ thể... nếu có):
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Ví dụ: Đợt ra quân kiểm tra từ ngày 10/8 đến 20/8/2026 tại Tổ 5, 6, 7"
            className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI đang biên soạn nội dung & thơ tuyên truyền...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>TẠO BÀI ĐĂNG & BẢN TIN TRUYỀN THÔNG AI</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* MODAL: Inline Agency Edit */}
      {showAgencyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-red-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="text-lg font-bold">Chỉnh Sửa Cơ Quan Quản Lý & Sử Dụng</h3>
                  <p className="text-xs text-amber-100">
                    Cập nhật Phòng/Ban/Tổ dân phố, Địa chỉ và Hotline liên hệ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAgencyModal(false)}
                className="p-1 text-amber-200 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgencyInfo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Phòng / Ban / Tổ Dân Phố Sử Dụng:
                </label>
                <input
                  type="text"
                  value={tempAgency.departmentName}
                  onChange={(e) => setTempAgency({ ...tempAgency, departmentName: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Tên Phường / Xã / Đơn Vị Chủ Quản:
                </label>
                <input
                  type="text"
                  value={tempAgency.wardName}
                  onChange={(e) => setTempAgency({ ...tempAgency, wardName: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Tên Chiến Dịch Truyền Thông:
                </label>
                <input
                  type="text"
                  value={tempAgency.campaignName}
                  onChange={(e) => setTempAgency({ ...tempAgency, campaignName: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Địa Chỉ Trụ Sở:
                </label>
                <input
                  type="text"
                  value={tempAgency.address}
                  onChange={(e) => setTempAgency({ ...tempAgency, address: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Số Hotline Liên Hệ (Hiển Thị Trên Bài Đăng & Poster):
                </label>
                <input
                  type="text"
                  value={tempAgency.hotline}
                  onChange={(e) => setTempAgency({ ...tempAgency, hotline: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-bold text-red-700 focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAgencyModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Manage AI Learned Style Rules */}
      {showStyleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-purple-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Brain className="w-6 h-6 text-purple-200" />
                <div>
                  <h3 className="text-lg font-bold">Hồ Sơ Phong Cách AI Đã Học</h3>
                  <p className="text-xs text-purple-200">
                    Tự động tích lũy từ các chỉnh sửa thực tế của Cán bộ Phường
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStyleModal(false)}
                className="p-1 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Add custom rule */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Thêm quy tắc văn phong mới cho AI:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCustomRule}
                    onChange={(e) => setNewCustomRule(e.target.value)}
                    placeholder="VD: Luôn xưng 'Bà con thân mến', thêm câu chúc sức khỏe cuối bài..."
                    className="flex-1 p-2.5 border border-gray-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomRule}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm
                  </button>
                </div>
              </div>

              {/* Rules list */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Danh sách quy tắc phong cách đang hoạt động ({learnedStyleRules.length}):
                </h4>
                {learnedStyleRules.length === 0 ? (
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                    Chưa có quy tắc nào. Hãy bấm "Chỉnh sửa bài đăng" sau khi AI tạo để AI tự học phong cách của bạn!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {learnedStyleRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between gap-2 text-xs font-medium text-purple-950"
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-purple-600 shrink-0">#{idx + 1}</span>
                          <span>{rule}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(idx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 shrink-0"
                          title="Xóa quy tắc này"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sample Edits History */}
              {sampleEdits.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                    Lịch sử bài viết đã chỉnh sửa ({sampleEdits.length} bài):
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {sampleEdits.map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-gray-900">{item.editedTitle}</div>
                        <p className="text-gray-600 line-clamp-2 italic">{item.editedSocialContent}</p>
                        <div className="text-[10px] text-gray-400 text-right">{item.createdAt}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowStyleModal(false)}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

