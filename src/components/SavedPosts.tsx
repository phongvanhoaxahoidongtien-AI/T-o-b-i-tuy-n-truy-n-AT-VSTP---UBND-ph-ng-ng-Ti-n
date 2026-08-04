import React, { useState } from 'react';
import { SavedItem } from '../types';
import { Bookmark, Search, Trash2, Copy, Check, Edit2, Share2, Calendar, FileText } from 'lucide-react';

interface SavedPostsProps {
  savedPosts: SavedItem[];
  onDelete: (id: string) => void;
  onSendToPoster: (post: SavedItem) => void;
}

export const SavedPosts: React.FC<SavedPostsProps> = ({
  savedPosts,
  onDelete,
  onSendToPoster
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPosts = savedPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.socialContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-red-600" />
            Kho Lưu Trữ Bài Đăng Phường ({savedPosts.length})
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Danh sách bài đăng, kịch bản phát thanh và câu khẩu hiệu đã được lưu.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề hoặc từ khóa..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-3">
          <p className="text-gray-500 text-sm">Chưa có bài viết nào được tìm thấy.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
                  <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                    {post.topic}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.createdAt}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {post.socialContent}
                </p>

                {post.shortSlogan && (
                  <div className="text-xs font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    💬 Khẩu hiệu: "{post.shortSlogan}"
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(post.socialContent, post.id)}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-lg border border-gray-200 transition flex items-center gap-1.5"
                >
                  {copiedId === post.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-600" />
                  )}
                  <span>{copiedId === post.id ? 'Đã chép' : 'Sao chép'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSendToPoster(post)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-red-950 text-xs font-extrabold rounded-lg shadow-xs transition flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Tạo Poster</span>
                  </button>

                  <button
                    onClick={() => onDelete(post.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                    title="Xóa khỏi kho"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
