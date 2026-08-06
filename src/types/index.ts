export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  tenantId: string;
  tenant?: Tenant;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  settings?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// Content types
export interface ContentItem {
  id: string;
  title: string;
  prompt: string;
  type: string;
  tone: string;
  length: string;
  body?: string;
  imageUrl?: string | null;
  status: 'DRAFT' | 'GENERATED' | 'PUBLISHED' | 'ARCHIVED';
  keywords?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Branding types
export interface BrandItem {
  id: string;
  name: string;
  slug?: string;
  tagline?: string;
  description?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  tone?: string;
  industry?: string;
  targetAudience?: string;
  values?: string[];
  guidelines?: string;
  style?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Image types
export interface ImageItem {
  id: string;
  prompt: string;
  aspectRatio?: string;
  style?: string;
  imageUrl?: string;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  createdAt?: string;
  updatedAt?: string;
}

// Planner types
export interface CalendarItem {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  events?: CalendarEventItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  description?: string;
  platform?: string;
  scheduledAt: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'CANCELLED';
  calendarId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Social types
export interface SocialAccountItem {
  id: string;
  platform: string;
  username: string;
  accountId: string;
  isActive: boolean;
  followers?: number;
  lastSync?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialPostItem {
  id: string;
  platform: string;
  topic?: string;
  title?: string;
  body?: string;
  tone?: string;
  hashtags?: string[];
  status: 'DRAFT' | 'GENERATED' | 'PUBLISHED' | 'ARCHIVED';
  scheduledAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Reels types
export type MediaType = 'photo' | 'video';
export type ReelTheme = 'lifestyle' | 'business' | 'product' | 'tutorial' | 'testimonial' | 'event' | 'announcement';
export type ReelTone = 'professional' | 'casual' | 'energetic' | 'emotional' | 'humorous' | 'inspirational';
export type ReelDuration = '15s' | '30s' | '60s' | '90s';
export type ReelPlatform = 'instagram' | 'tiktok' | 'youtube_shorts' | 'facebook_reels';
export type MusicMood = 'upbeat' | 'chill' | 'emotional' | 'trending' | 'cinematic' | 'corporate';
export type ReelStyle = 'modern' | 'minimalist' | 'bold' | 'elegant' | 'playful' | 'cinematic';

export interface ReelMediaInput {
  type: MediaType;
  url: string;
  description: string;
}

export interface ReelTextContent {
  title: string;
  body: string;
  cta: string;
  hashtags: string[];
}

export interface ReelCaptionOverlay {
  text: string;
  position: string;
  animation: string;
}

export interface ReelScene {
  scene_number: number;
  start_time: number;
  end_time: number;
  duration: number;
  media_index: number | null;
  shot_type: string;
  transition: string;
  voiceover: string;
  caption_overlay: ReelCaptionOverlay;
  music_cue: string;
}

export interface ReelScript {
  total_duration: number;
  scenes: ReelScene[];
}

export interface ReelTextOverlay {
  scene_number: number;
  text: string;
  position: string;
  font_size: string;
  color: string;
  animation: string;
  start_time: number;
  end_time: number;
}

export interface ReelCaption {
  text: string;
  start_time: number;
  end_time: number;
  style: string;
}

export interface ReelVoiceoverSegment {
  text: string;
  start_time: number;
  end_time: number;
  pace: string;
}

export interface ReelVoiceoverScript {
  full_text: string;
  segments: ReelVoiceoverSegment[];
}

export interface ReelSuggestedTrack {
  name: string;
  artist: string;
  mood: string;
  bpm: number;
}

export interface ReelMusicCuePoint {
  time: number;
  action: string;
}

export interface ReelMusic {
  mood: string;
  suggested_tracks: ReelSuggestedTrack[];
  cue_points: ReelMusicCuePoint[];
}

export interface ReelThumbnailSuggestion {
  scene_number: number;
  description: string;
  text_overlay: string;
}

export interface ReelProductionNotes {
  equipment_needed: string[];
  lighting_tips: string[];
  filming_tips: string[];
  editing_suggestions: string[];
}

export interface ReelMetadata {
  platform: string;
  duration_seconds: number;
  theme: string;
  tone: string;
  style: string;
  created_at: string;
}

export interface GenerateReelsResponse {
  reel_metadata: ReelMetadata;
  script: ReelScript;
  text_overlays: ReelTextOverlay[];
  captions: ReelCaption[];
  voiceover_script: ReelVoiceoverScript;
  music: ReelMusic;
  hashtags: string[];
  caption_final: string;
  cta_final: string;
  thumbnail_suggestion: ReelThumbnailSuggestion;
  production_notes: ReelProductionNotes;
}

export interface GenerateReelsRequest {
  media: ReelMediaInput[];
  text_content: ReelTextContent;
  theme?: ReelTheme;
  tone?: ReelTone;
  duration?: ReelDuration;
  platform?: ReelPlatform;
  music_mood?: MusicMood;
  style?: ReelStyle;
}
