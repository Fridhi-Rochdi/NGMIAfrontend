"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get, post, put, del } from '@/lib/api';
import type { ContentItem } from '@/types';

export interface ContentForm {
  type: string;
  length: string;
  topic: string;
  tone: string;
  hashtags: string;
  callToAction: string;
  aiModel: string;
  additionalInstructions: string;
}

interface ContentStore {
  content: ContentForm;
  contentTypes: string[];
  contentLengths: string[];
  aiModels: string[];
  generatedContents: ContentItem[];
  loading: boolean;
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
  tone: 'professional',
  hashtags: '',
  callToAction: '',
  aiModel: 'gpt-4',
  additionalInstructions: '',
};

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      content: { ...defaultContent },
      contentTypes: ['POST', 'BLOG', 'AD', 'EMAIL', 'SLOGAN', 'DESCRIPTION'],
      contentLengths: ['SHORT', 'MEDIUM', 'LONG'],
      aiModels: ['gpt-4', 'gpt-3.5-turbo', 'claude-3'],
      generatedContents: [],
      loading: false,

      updateContent: (updates) => {
        set((state) => ({
          content: { ...state.content, ...updates },
        }));
      },

      generateContent: async () => {
        set({ loading: true });
        try {
          const { content } = get();
          const response = await post<ContentItem>('/content/generate', {
            title: content.topic,
            prompt: content.topic,
            type: content.type,
            tone: content.tone,
            length: content.length,
            keywords: content.hashtags ? content.hashtags.split(',').map((k) => k.trim()) : [],
          });

          set((state) => ({
            generatedContents: response.data ? [response.data, ...state.generatedContents].slice(0, 50) : state.generatedContents,
            loading: false,
          }));
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      fetchContents: async () => {
        set({ loading: true });
        try {
          const response = await get<ContentItem[]>('/content');
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
          await del(`/content/${id}`);
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