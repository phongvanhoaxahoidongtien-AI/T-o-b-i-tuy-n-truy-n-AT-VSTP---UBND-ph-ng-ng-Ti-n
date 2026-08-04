import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PostGenerator } from './components/PostGenerator';
import { PostResult } from './components/PostResult';
import { PosterBuilder } from './components/PosterBuilder';
import { SloganGallery } from './components/SloganGallery';
import { SavedPosts } from './components/SavedPosts';
import { SAMPLE_SAVED_POSTS } from './data/templates';
import { PostRequest, GeneratedPost, SavedItem, PosterConfig, StylePreference, AgencyInfo } from './types';
import { HeartHandshake, ShieldCheck, Sparkles, BookOpen, Volume2, Image, CheckCircle2 } from 'lucide-react';

const DEFAULT_AGENCY_INFO: AgencyInfo = {
  wardName: 'UBND Phường Đông Tiến',
  departmentName: 'Ban Chỉ đạo ATVSTP & Trạm Y tế Phường',
  campaignName: 'Tháng hành động vì An toàn thực phẩm 2026',
  address: 'Số 123 Đường Lý Thái Tổ, Phường Đông Tiến',
  hotline: '0988.123.456 - 024.3825.1115'
};

const DEFAULT_LEARNED_RULES = [
  'Xưng hô gần gũi: Dùng "Bà con thân mến", "Gia đình", "Chị em đi chợ" thay vì từ ngữ hành chính khô cứng',
  'Cấu trúc rõ ràng: Ngắn gọn 3-5 câu, có gạch đầu dòng 3 mẹo dễ nhớ',
  'Luôn kèm lời nhắc nhở nhẹ nhàng về vệ sinh nguồn nước và chế biến thực phẩm chín kỹ'
];

export default function App() {
  const [agencyInfo, setAgencyInfo] = useState<AgencyInfo>(() => {
    const localInfo = localStorage.getItem('ubnd_atvstp_agency_info');
    if (localInfo) {
      try {
        return JSON.parse(localInfo);
      } catch (e) {
        console.error('Failed to parse agency info', e);
      }
    }
    return DEFAULT_AGENCY_INFO;
  });

  const [activeTab, setActiveTab] = useState<'generator' | 'poster' | 'slogans' | 'saved'>('generator');
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(SAMPLE_SAVED_POSTS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posterConfig, setPosterConfig] = useState<Partial<PosterConfig> | undefined>(undefined);

  // Saved Posts state with localStorage persistence
  const [savedPosts, setSavedPosts] = useState<SavedItem[]>(() => {
    const localData = localStorage.getItem('ubnd_atvstp_saved_posts');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        console.error('Failed to parse local saved posts', e);
      }
    }
    return SAMPLE_SAVED_POSTS;
  });

  // Learned AI Style Rules state with localStorage persistence
  const [learnedStyleRules, setLearnedStyleRules] = useState<string[]>(() => {
    const localRules = localStorage.getItem('ubnd_atvstp_learned_rules');
    if (localRules) {
      try {
        return JSON.parse(localRules);
      } catch (e) {
        console.error('Failed to parse learned rules', e);
      }
    }
    return DEFAULT_LEARNED_RULES;
  });

  // Edited Sample Posts state for AI few-shot learning
  const [sampleEdits, setSampleEdits] = useState<StylePreference[]>(() => {
    const localEdits = localStorage.getItem('ubnd_atvstp_sample_edits');
    if (localEdits) {
      try {
        return JSON.parse(localEdits);
      } catch (e) {
        console.error('Failed to parse sample edits', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ubnd_atvstp_agency_info', JSON.stringify(agencyInfo));
  }, [agencyInfo]);

  useEffect(() => {
    localStorage.setItem('ubnd_atvstp_saved_posts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  useEffect(() => {
    localStorage.setItem('ubnd_atvstp_learned_rules', JSON.stringify(learnedStyleRules));
  }, [learnedStyleRules]);

  useEffect(() => {
    localStorage.setItem('ubnd_atvstp_sample_edits', JSON.stringify(sampleEdits));
  }, [sampleEdits]);

  // Handle Post Generation via Gemini backend route
  const handleGeneratePost = async (request: PostRequest) => {
    setIsLoading(true);
    const fullRequest = {
      ...request,
      agencyInfo,
      wardName: agencyInfo.wardName
    };

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullRequest)
      });
      const result = await response.json();

      if (result.success && result.data) {
        setCurrentPost(result.data);
      } else {
        alert('Chưa thể tạo bài đăng: ' + (result.error || 'Lỗi kết nối server'));
      }
    } catch (err: any) {
      console.error(err);
      alert('Không thể kết nối dịch vụ Gemini AI');
    } finally {
      setIsLoading(false);
    }
  };

  // Callback when post is edited and AI style learning triggers
  const handlePostUpdated = (updatedPost: GeneratedPost, newStyleRules?: string[]) => {
    setCurrentPost(updatedPost);

    // Save style preference edit sample
    const newSampleEdit: StylePreference = {
      id: 'edit-' + Date.now(),
      originalTitle: currentPost?.title,
      editedTitle: updatedPost.title,
      originalSocialContent: currentPost?.socialContent,
      editedSocialContent: updatedPost.socialContent,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    setSampleEdits((prev) => [newSampleEdit, ...prev.slice(0, 4)]);

    if (newStyleRules && newStyleRules.length > 0) {
      setLearnedStyleRules((prev) => {
        const combined = [...newStyleRules, ...prev];
        // Deduplicate
        return Array.from(new Set(combined)).slice(0, 10);
      });
    }
  };

  // Toggle Save Post
  const handleSavePost = (postToSave: GeneratedPost) => {
    const exists = savedPosts.some((p) => p.id === postToSave.id);
    if (exists) {
      setSavedPosts(savedPosts.filter((p) => p.id !== postToSave.id));
    } else {
      setSavedPosts([postToSave as SavedItem, ...savedPosts]);
    }
  };

  // Delete Saved Post
  const handleDeletePost = (id: string) => {
    setSavedPosts(savedPosts.filter((p) => p.id !== id));
  };

  // Transfer Post content to Poster Builder
  const handleSendToPoster = (post: GeneratedPost) => {
    setPosterConfig({
      title: post.title.replace(/^[📌☀️📢\s]+/, '').toUpperCase(),
      subtitle: `Chủ đề: ${post.topic}`,
      slogan: post.shortSlogan || 'Thực phẩm an toàn - Cả nhà an tâm!',
      bulletPoints: post.keyPoints.map((pt, i) => `${i + 1}. ${pt}`),
      wardName: post.wardName || agencyInfo.wardName,
      departmentName: agencyInfo.departmentName,
      campaignName: agencyInfo.campaignName,
      address: agencyInfo.address,
      hotline: post.hotline || agencyInfo.hotline,
      imageUrl: post.imageUrl
    });
    setActiveTab('poster');
  };

  const isCurrentPostSaved = currentPost
    ? savedPosts.some((p) => p.id === currentPost.id)
    : false;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans flex flex-col antialiased">
      {/* Header */}
      <Header
        agencyInfo={agencyInfo}
        setAgencyInfo={setAgencyInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPosts.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: AI GENERATOR */}
        {activeTab === 'generator' && (
          <div className="space-y-8">
            {/* Generator Form */}
            <PostGenerator
              onGenerate={handleGeneratePost}
              isLoading={isLoading}
              wardName={agencyInfo.wardName}
              agencyInfo={agencyInfo}
              onUpdateAgencyInfo={setAgencyInfo}
              learnedStyleRules={learnedStyleRules}
              sampleEdits={sampleEdits}
              onUpdateStyleRules={setLearnedStyleRules}
            />

            {/* Generated Output Result */}
            {currentPost && (
              <div className="pt-2">
                <PostResult
                  post={currentPost}
                  onSave={handleSavePost}
                  isSaved={isCurrentPostSaved}
                  onSendToPoster={handleSendToPoster}
                  onPostUpdated={handlePostUpdated}
                  onRegenerate={() => {
                    if (currentPost) {
                      handleGeneratePost({
                        topic: currentPost.topic,
                        postType: 'social',
                        tone: 'friendly',
                        targetAudience: 'all_citizens',
                        length: 'short',
                        includeHashtags: true,
                        includeHotline: true,
                        wardName: agencyInfo.wardName,
                        agencyInfo,
                        learnedStyleRules,
                        sampleEdits
                      });
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: POSTER BUILDER */}
        {activeTab === 'poster' && (
          <PosterBuilder
            initialConfig={posterConfig}
            wardName={agencyInfo.wardName}
            agencyInfo={agencyInfo}
          />
        )}

        {/* TAB 3: SLOGANS & POEMS */}
        {activeTab === 'slogans' && <SloganGallery />}

        {/* TAB 4: SAVED POSTS ARCHIVE */}
        {activeTab === 'saved' && (
          <SavedPosts
            savedPosts={savedPosts}
            onDelete={handleDeletePost}
            onSendToPoster={handleSendToPoster}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span>{agencyInfo.wardName} ({agencyInfo.departmentName}) • Cổng Truyền Thông An Toàn Thực Phẩm Cộng Đồng</span>
          </div>
          <p>© 2026 Được phát triển dành cho Cán bộ Văn hóa & Ban Chỉ đạo ATVSTP cấp Phường/Xã.</p>
        </div>
      </footer>
    </div>
  );
}
