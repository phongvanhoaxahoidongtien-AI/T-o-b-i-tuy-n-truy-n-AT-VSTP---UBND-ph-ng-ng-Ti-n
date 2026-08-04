export type PostType = 'social' | 'broadcast' | 'rhyme' | 'official' | 'infographic_text';

export type ContentTone = 'friendly' | 'instructive' | 'warning' | 'poetry' | 'official';

export type TargetAudience = 'all_citizens' | 'food_vendors' | 'school_kitchens' | 'housewives' | 'elderly';

export type ContentLength = 'short' | 'medium' | 'detailed';

export interface AgencyInfo {
  wardName: string;         // Tên Phường/Xã/Thị trấn (VD: UBND Phường Đông Tiến)
  departmentName: string;   // Phòng/Ban/Tổ dân phố (VD: Ban Chỉ đạo ATVSTP & Trạm Y tế)
  campaignName: string;     // Tên chiến dịch (VD: Tháng hành động vì An toàn thực phẩm 2026)
  address: string;          // Địa chỉ trụ sở (VD: Số 123 Đường Lý Thái Tổ, Phường Đông Tiến)
  hotline: string;          // Số hotline liên hệ (VD: 0988.123.456 - 024.3825.1115)
}

export interface NewsReference {
  url: string;
  title: string;
  sourceName?: string;
  summary: string;
  keyFacts: string[];
  suggestedAction?: string;
}

export interface StylePreference {
  id: string;
  originalTitle?: string;
  editedTitle: string;
  originalSocialContent?: string;
  editedSocialContent: string;
  notes?: string;
  createdAt: string;
}

export interface LearnedStyleProfile {
  summaryRules: string[];
  sampleEdits: StylePreference[];
}

export interface PostRequest {
  topic: string;
  postType: PostType;
  tone: ContentTone;
  targetAudience: TargetAudience;
  length: ContentLength;
  includeHashtags: boolean;
  includeHotline: boolean;
  customNotes?: string;
  wardName: string;
  agencyInfo?: AgencyInfo;
  newsReference?: NewsReference;
  learnedStyleRules?: string[];
  sampleEdits?: StylePreference[];
}

export interface GeneratedPost {
  id: string;
  title: string;
  socialContent: string;
  broadcastScript: string;
  shortSlogan: string;
  rhyme?: string;
  imagePrompt: string;
  imageUrl?: string;
  keyPoints: string[];
  hotline: string;
  hashtags: string[];
  createdAt: string;
  topic: string;
  wardName: string;
  agencyInfo?: AgencyInfo;
}

export interface SavedItem extends GeneratedPost {
  isFavorite?: boolean;
}

export interface PosterConfig {
  title: string;
  subtitle: string;
  slogan: string;
  bulletPoints: string[];
  themeColor: 'red_gold' | 'green_fresh' | 'blue_trust' | 'orange_warning';
  wardName: string;
  departmentName?: string;
  campaignName?: string;
  address?: string;
  hotline: string;
  imageUrl?: string;
  badgeText: string;
}
