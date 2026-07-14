"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { post } from '@/lib/api';
import type {
  GenerateReelsRequest,
  GenerateReelsResponse,
  ReelMediaInput,
  ReelTextContent,
  ReelTheme,
  ReelTone,
  ReelDuration,
  ReelPlatform,
  MusicMood,
  ReelStyle,
} from '@/types';

export interface ReelsForm {
  media: ReelMediaInput[];
  textContent: ReelTextContent;
  theme: ReelTheme;
  tone: ReelTone;
  duration: ReelDuration;
  platform: ReelPlatform;
  musicMood: MusicMood;
  style: ReelStyle;
}

interface ReelsStore {
  form: ReelsForm;
  result: GenerateReelsResponse | null;
  loading: boolean;
  error: string;
  themes: ReelTheme[];
  tones: ReelTone[];
  durations: ReelDuration[];
  platforms: ReelPlatform[];
  musicMoods: MusicMood[];
  styles: ReelStyle[];
  updateForm: (updates: Partial<ReelsForm>) => void;
  addMedia: (media: ReelMediaInput) => void;
  removeMedia: (index: number) => void;
  updateMedia: (index: number, updates: Partial<ReelMediaInput>) => void;
  generateReels: () => Promise<void>;
  clearResult: () => void;
  resetForm: () => void;
}

const defaultForm: ReelsForm = {
  media: [],
  textContent: {
    title: '',
    body: '',
    cta: '',
    hashtags: [],
  },
  theme: 'lifestyle',
  tone: 'professional',
  duration: '30s',
  platform: 'instagram',
  musicMood: 'upbeat',
  style: 'modern',
};

export const useReelsStore = create<ReelsStore>()(
  persist(
    (set, get) => ({
      form: { ...defaultForm },
      result: null,
      loading: false,
      error: '',
      themes: ['lifestyle', 'business', 'product', 'tutorial', 'testimonial', 'event', 'announcement'],
      tones: ['professional', 'casual', 'energetic', 'emotional', 'humorous', 'inspirational'],
      durations: ['15s', '30s', '60s', '90s'],
      platforms: ['instagram', 'tiktok', 'youtube_shorts', 'facebook_reels'],
      musicMoods: ['upbeat', 'chill', 'emotional', 'trending', 'cinematic', 'corporate'],
      styles: ['modern', 'minimalist', 'bold', 'elegant', 'playful', 'cinematic'],

      updateForm: (updates) => {
        set((state) => ({
          form: { ...state.form, ...updates },
        }));
      },

      addMedia: (media) => {
        set((state) => ({
          form: { ...state.form, media: [...state.form.media, media] },
        }));
      },

      removeMedia: (index) => {
        set((state) => ({
          form: {
            ...state.form,
            media: state.form.media.filter((_, i) => i !== index),
          },
        }));
      },

      updateMedia: (index, updates) => {
        set((state) => ({
          form: {
            ...state.form,
            media: state.form.media.map((m, i) => (i === index ? { ...m, ...updates } : m)),
          },
        }));
      },

      generateReels: async () => {
        set({ loading: true, error: '' });
        try {
          const { form } = get();
          const payload: GenerateReelsRequest = {
            media: form.media,
            text_content: {
              title: form.textContent.title,
              body: form.textContent.body,
              cta: form.textContent.cta,
              hashtags: form.textContent.hashtags,
            },
            theme: form.theme,
            tone: form.tone,
            duration: form.duration,
            platform: form.platform,
            music_mood: form.musicMood,
            style: form.style,
          };

          const response = await post<GenerateReelsResponse>('/ai-engine/generate-reels', payload);
          set({ result: response.data, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to generate reels',
          });
          throw error;
        }
      },

      clearResult: () => set({ result: null, error: '' }),

      resetForm: () => set({ form: { ...defaultForm }, result: null, error: '' }),
    }),
    {
      name: 'reels-store',
    },
  ),
);
