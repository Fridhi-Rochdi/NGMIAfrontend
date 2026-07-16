"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get as apiGet, post as apiPost, del as apiDel } from '@/lib/api';
import type { ContentItem } from '@/types';

export interface ContentForm {
  type: string;
  length: string;
  topic: string;
  targetAudience: string;
  tone: string;
  hashtags: string;
  callToAction: string;
}

interface ContentStore {
  content: ContentForm;
  contentTypes: string[];
  contentLengths: string[];
  generatedContents: ContentItem[];
  loading: boolean;
  isGenerating: boolean;
  updateContent: (updates: Partial<ContentForm>) => void;
  generateContent: () => Promise<void>;
  fetchContents: () => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  clearContent: () => void;
}

const defaultContent: ContentForm = {
  type: 'POST',
  length: 'MEDIUM',
  topic: '',
  targetAudience: 'Entrepreneurs, small business owners',
  tone: 'professional',
  hashtags: '',
  callToAction: '',
};

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      content: { ...defaultContent },
      contentTypes: ['POST', 'BLOG', 'AD', 'EMAIL', 'SLOGAN', 'DESCRIPTION'],
      contentLengths: ['SHORT', 'MEDIUM', 'LONG'],
      generatedContents: [],
      loading: false,
      isGenerating: false,

      updateContent: (updates) => {
        set((state) => ({
          content: { ...state.content, ...updates },
        }));
      },

      generateContent: async () => {
        set({ isGenerating: true });
        try {
          const { content } = get();

          // Build a rich prompt that includes all form fields
          const promptParts: string[] = [`Topic/Product: ${content.topic}`];
          if (content.targetAudience) {
            promptParts.push(`Target Audience: ${content.targetAudience}`);
          }
          if (content.hashtags) {
            promptParts.push(`Include these hashtags: ${content.hashtags}`);
          }
          if (content.callToAction) {
            promptParts.push(`Call to action: ${content.callToAction}`);
          }
          
          const fullPrompt = promptParts.join('\n\n');

          const response = await apiPost<ContentItem>('/content/generate', {
            title: content.topic.substring(0, 50) + (content.topic.length > 50 ? '...' : ''),
            prompt: fullPrompt,
            type: content.type,
            tone: content.tone,
            length: content.length,
            keywords: content.hashtags ? content.hashtags.split(',').map((k) => k.trim()) : [],
          });

          set((state) => ({
            generatedContents: response.data ? [response.data, ...state.generatedContents].slice(0, 50) : state.generatedContents,
            isGenerating: false,
          }));
        } catch (error) {
          set({ isGenerating: false });
          throw error;
        }
      },

      fetchContents: async () => {
        set({ loading: true });
        try {
          const response = await apiGet<ContentItem[]>('/content');
          // Ensure we always have an array even if API returns null
          const items = Array.isArray(response.data) ? response.data : [];
          set({ generatedContents: items, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      deleteContent: async (id: string) => {
        try {
          await apiDel(`/content/${id}`);
          set((state) => ({
            generatedContents: state.generatedContents.filter((c) => c.id !== id),
          }));
        } catch (error) {
          throw error;
        }
      },

      clearContent: () => {
        set({ content: { ...defaultContent } });
      },
    }),
    {
      name: 'content-storage',
      partialize: (state) => ({
        content: state.content,
        generatedContents: state.generatedContents,
      }),
    }
  )
);