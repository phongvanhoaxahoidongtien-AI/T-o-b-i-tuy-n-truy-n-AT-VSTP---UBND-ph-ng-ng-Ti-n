import React, { useState } from 'react';
import { GeneratedPost } from '../types';
import { Copy, Check, Volume2, Sparkles, Image as ImageIcon, Bookmark, BookmarkCheck, Share2, Music, RefreshCw, AlertCircle, FileText, Download, Edit2, Edit3, Save, X, Brain, CheckCircle2 } from 'lucide-react';

interface PostResultProps {
  post: GeneratedPost;
  onSave: (post: GeneratedPost) => void;
  isSaved: boolean;
  onSendToPoster: (post: GeneratedPost) => void;
  onRegenerate: () => void;
  onPostUpdated?: (updatedPost: GeneratedPost, newStyleRules?: string[]) => void;
}

export const PostResult: React.FC<PostResultProps> = ({
  post,
  onSave,
  isSaved,
  onSendToPoster,
  onRegenerate,
  onPostUpdated
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'social' | 'broadcast' | 'rhyme' | 'image'>('social');
  const [copied, setCopied] = useState(false);
  
  // Audio state for Gemini TTS
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Image state for Gemini Image Generation
  const [imageUrl, setImageUrl] = useState<string | null>(post.imageUrl || null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Editing & Learning State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editSocialContent, setEditSocialContent] = useState(post.socialContent);
  const [editBroadcastScript, setEditBroadcastScript] = useState(post.broadcastScript);
  const [editShortSlogan, setEditShortSlogan] = useState(post.shortSlogan || '');
  const [editRhyme, setEditRhyme] = useState(post.rhyme || '');
  const [editKeyPointsText, setEditKeyPointsText] = useState((post.keyPoints || []).join('\n'));
  const [userStyleNotes, setUserStyleNotes] = useState('');
  const [isSavingAndLearning, setIsSavingAndLearning] = useState(false);
  const [learnSuccessMessage, setLearnSuccessMessage] = useState<string | null>(null);

  const startEditMode = () => {
    setEditTitle(post.title);
    setEditSocialContent(post.socialContent);
    setEditBroadcastScript(post.broadcastScript);
    setEditShortSlogan(post.shortSlogan || '');
    setEditRhyme(post.rhyme || '');
    setEditKeyPointsText((post.keyPoints || []).join('\n'));
    setUserStyleNotes('');
    setIsEditing(true);
  };

  const handleSaveAndLearnStyle = async () => {
    setIsSavingAndLearning(true);
    setLearnSuccessMessage(null);

    const keyPointsArray = editKeyPointsText
      .split('\n')
      .map((line) => line.replace(/^[\s•*-]+/, '').trim())
      .filter((line) => line.length > 0);

    const updatedPost: GeneratedPost = {
      ...post,
      title: editTitle,
      socialContent: editSocialContent,
      broadcastScript: editBroadcastScript,
      shortSlogan: editShortSlogan,
      rhyme: editRhyme,
      keyPoints: keyPointsArray
    };

    try {
      // Send to server to analyze style differences
      const res = await fetch("/api/learn-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPost: post,
          editedPost: updatedPost,
          userNotes: userStyleNotes
        })
      });
      const data = await res.json();

      let newRules: string[] = [];
      if (data.success && data.newRules) {
        newRules = data.newRules;
      }

      if (onPostUpdated) {
        onPostUpdated(updatedPost, newRules);
      }

      setLearnSuccessMessage(
        newRules.length > 0
          ? `🎉 Bài viết đã cập nhật! AI đã học thêm ${newRules.length} phong cách viết mới của bạn.`
          : `🎉 Bài viết đã cập nhật hoàn chỉnh!`
      );
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      if (onPostUpdated) {
        onPostUpdated(updatedPost, []);
      }
      setIsEditing(false);
    } finally {
      setIsSavingAndLearning(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayTTS = async () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
      return;
    }

    try {
      setIsLoadingAudio(true);
      const res = await fetch("/api/generate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: post.broadcastScript }),
      });
      const data = await res.json();

      if (data.success && data.audioBase64) {
        // Construct PCM WAV or Data URL from base64 audio
        // Gemini TTS outputs audio
        const audioSrc = `data:audio/mp3;base64,${data.audioBase64}`;
        setAudioUrl(audioSrc);
        const audio = new Audio(audioSrc);
        audio.play();
        setIsPlayingAudio(true);
        audio.onended = () => setIsPlayingAudio(false);
      } else {
        alert("Chưa thể phát âm thanh: " + (data.error || "Lỗi hệ thống"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Không thể kết nối dịch vụ phát thanh âm thanh");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleGenerateImage = async () => {
    try {
      setIsGeneratingImage(true);
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: post.imagePrompt }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        alert("Chưa tạo được ảnh minh họa: " + (data.error || "Lỗi hệ thống"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Lỗi khi kết nối dịch vụ tạo ảnh Gemini");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-red-200 overflow-hidden transition-all">
      {/* Result Header */}
      <div className="bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-red-950 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {post.wardName}
            </span>
            <span className="text-amber-200 text-xs">
              • Tạo ngày: {post.createdAt}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold leading-snug">
            {post.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={startEditMode}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
            title="Chỉnh sửa bài viết để AI học phong cách của bạn"
          >
            <Edit3 className="w-4 h-4 text-purple-200" />
            <span>Sửa Bài & Học Phong Cách</span>
          </button>

          <button
            onClick={() => onSave(post)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
              isSaved
                ? 'bg-amber-400 text-red-900 shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-red-900" />
                <span>Đã lưu kho</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-amber-300" />
                <span>Lưu bài viết</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSendToPoster(post)}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-red-950 rounded-xl text-xs font-extrabold shadow-sm transition"
          >
            <Edit2 className="w-4 h-4" />
            <span>Tạo Poster In</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {learnSuccessMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 p-3.5 px-6 flex items-center justify-between gap-3 text-emerald-950 text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{learnSuccessMessage}</span>
          </div>
          <button
            onClick={() => setLearnSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50/80 px-4 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('social')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'social'
              ? 'border-red-600 text-red-700 bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          Bài Đăng Facebook/Zalo
        </button>

        <button
          onClick={() => setActiveSubTab('broadcast')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'broadcast'
              ? 'border-red-600 text-red-700 bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Volume2 className="w-4 h-4 text-amber-600" />
          Loa Phát Thanh Phường
        </button>

        <button
          onClick={() => setActiveSubTab('rhyme')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'rhyme'
              ? 'border-red-600 text-red-700 bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Music className="w-4 h-4 text-emerald-600" />
          Thơ & Khẩu Hiệu
        </button>

        <button
          onClick={() => setActiveSubTab('image')}
          className={`py-3 px-4 font-bold text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'image'
              ? 'border-red-600 text-red-700 bg-white'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-purple-600" />
          Ảnh Minh Họa AI
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* TAB 1: SOCIAL CONTENT */}
        {activeSubTab === 'social' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
              {post.socialContent}
            </div>

            {/* Key Takeaways */}
            {post.keyPoints && post.keyPoints.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  3 Tóm tắt chính người dân cần nhớ:
                </h4>
                <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                  {post.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5">
              {post.hashtags.map((tag, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100">
                  {tag}
                </span>
              ))}
            </div>

            {/* Copy Button */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => handleCopy(post.socialContent)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép bài viết!' : 'Sao chép văn bản bài đăng'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: BROADCAST SCRIPT */}
        {activeSubTab === 'broadcast' && (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-300/60 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500 text-white rounded-xl shadow-xs">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Bản tin đọc phát thanh phường (Thời lượng: ~1.5 phút)
                  </h4>
                  <p className="text-xs text-gray-600">
                    Ngôn ngữ nhịp nhàng, giọng đọc truyền cảm dành cho hệ thống loa truyền thanh.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlayTTS}
                disabled={isLoadingAudio}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isLoadingAudio ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-amber-200' : ''}`} />
                )}
                <span>{isPlayingAudio ? 'Đang phát...' : 'Phát Thử Giọng Đọc AI'}</span>
              </button>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
              {post.broadcastScript}
            </div>

            <button
              onClick={() => handleCopy(post.broadcastScript)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>Sao chép kịch bản phát thanh</span>
            </button>
          </div>
        )}

        {/* TAB 3: RHYME & SLOGAN */}
        {activeSubTab === 'rhyme' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-200/70 px-3 py-1 rounded-full">
                Khẩu hiệu tuyên truyền
              </span>
              <p className="text-lg font-black text-emerald-950 mt-3 leading-snug">
                "{post.shortSlogan}"
              </p>
            </div>

            {post.rhyme && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-200/70 px-3 py-1 rounded-full">
                  Thơ / Ca dao dễ nhớ cho người dân
                </span>
                <p className="text-base font-semibold text-amber-950 mt-4 leading-relaxed whitespace-pre-line italic">
                  {post.rhyme}
                </p>
              </div>
            )}

            <button
              onClick={() => handleCopy(`KHẨU HIỆU: ${post.shortSlogan}\n\nTHƠ TUYÊN TRUYỀN:\n${post.rhyme || ''}`)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>Sao chép Khẩu hiệu & Bài thơ</span>
            </button>
          </div>
        )}

        {/* TAB 4: IMAGE ILLUSTRATION */}
        {activeSubTab === 'image' && (
          <div className="space-y-4">
            {imageUrl ? (
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md max-w-md mx-auto">
                  <img src={imageUrl} alt="Ảnh minh họa tuyên truyền" className="w-full h-auto object-cover" />
                </div>
                <div className="text-center">
                  <a
                    href={imageUrl}
                    download="anh-tuyen-truyen-atvstp.png"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    Tải Ảnh Minh Họa Về Máy
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-purple-50 border border-purple-200 p-8 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    Tạo ảnh minh họa tuyên truyền bằng AI Gemini
                  </h4>
                  <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                    AI sẽ tự động sinh bức ảnh vẽ đồ họa tươi sáng, thân thiện với chợ quê, mâm cơm gia đình theo chủ đề bài viết.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {isGeneratingImage ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Gemini đang vẽ bức ảnh minh họa...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-purple-200" />
                        <span>Tạo Ảnh Minh Họa Ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EDIT POST & LEARN STYLE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-purple-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-purple-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-6 h-6 text-purple-200" />
                <div>
                  <h3 className="text-lg font-bold">Chỉnh Sửa Bài Đăng & Huấn Luyện AI Phong Cách</h3>
                  <p className="text-xs text-purple-200">
                    Sửa lại văn bản theo đúng ý cán bộ. AI sẽ phân tích sự thay đổi và học phong cách ở các bài sau.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Edit Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tiêu đề bài viết
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              {/* Edit Social Content */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Nội dung bài đăng Mạng xã hội (Facebook/Zalo)
                </label>
                <textarea
                  rows={6}
                  value={editSocialContent}
                  onChange={(e) => setEditSocialContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-xs font-mono leading-relaxed focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              {/* Edit Broadcast Script */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Kịch bản Loa phát thanh Phường
                </label>
                <textarea
                  rows={4}
                  value={editBroadcastScript}
                  onChange={(e) => setEditBroadcastScript(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              {/* Edit Short Slogan & Rhyme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Khẩu hiệu tuyên truyền
                  </label>
                  <input
                    type="text"
                    value={editShortSlogan}
                    onChange={(e) => setEditShortSlogan(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Thơ / Ca dao (Mỗi dòng 1 câu)
                  </label>
                  <textarea
                    rows={2}
                    value={editRhyme}
                    onChange={(e) => setEditRhyme(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Key points text */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  3 Điểm cốt lõi (Mỗi điểm 1 dòng)
                </label>
                <textarea
                  rows={3}
                  value={editKeyPointsText}
                  onChange={(e) => setEditKeyPointsText(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              {/* Style notes for AI */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-700" />
                  Ghi chú lưu ý cho AI học (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={userStyleNotes}
                  onChange={(e) => setUserStyleNotes(e.target.value)}
                  placeholder="VD: Hãy dùng 'Bà con thân mến', không viết quá dài, luôn thêm lời chúc cuối bài..."
                  className="w-full p-2.5 bg-white border border-purple-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleSaveAndLearnStyle}
                disabled={isSavingAndLearning}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingAndLearning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>AI đang phân tích & ghi nhớ phong cách...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 text-purple-200" />
                    <span>HOÀN THÀNH & CHO AI HỌC PHONG CÁCH NÀY</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
