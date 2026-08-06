"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get as apiGet, post as apiPost, del as apiDel } from '@/lib/api';
import type { ContentItem } from '@/types';

export interface ContentForm {
  businessType: string;
  type: string;
  length: string;
  topic: string;
  targetAudience: string;
  tone: string;
  hashtags: string;
  callToAction: string;
  generateImage: boolean;
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
  businessType: 'RESTAURANT',
  type: 'POST',
  length: 'MEDIUM',
  topic: '',
  targetAudience: 'Entrepreneurs, small business owners',
  tone: 'professional',
  hashtags: '',
  callToAction: '',
  generateImage: false,
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
          const businessGuidance: Record<string, string> = {
            RESTAURANT: 'Focus on the culinary experience, signature dishes, reservations and local discovery.',
            CAFE: 'Focus on atmosphere, specialty drinks, moments of consumption and visits.',
            RETAIL: 'Focus on the product benefit, collection, availability and purchase.',
            EVENT: 'Make date, location, program and registration immediately clear.',
            REAL_ESTATE: 'Focus on location, property facts, buyer benefits and contact.',
            HEALTH: 'Use factual, reassuring language and never invent medical promises.',
            EDUCATION: 'Clarify audience, learning outcomes, duration and registration.',
            SERVICES: 'Focus on expertise, client problem, process, proof and requesting a quote.',
          };
          const promptParts: string[] = [
            `Business type: ${content.businessType || 'SERVICES'}`,
            `Business-specific direction: ${businessGuidance[content.businessType || 'SERVICES'] || 'Adapt the message precisely to this professional sector.'}`,
            `Topic/Product: ${content.topic}`,
          ];
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
            generateImage: content.generateImage,
          });

          // Extract the actual item from the nested response
          // @ts-ignore
          const newItem = response.data?.data || response.data;

          set((state) => ({
            generatedContents: newItem ? [newItem, ...state.generatedContents].slice(0, 50) : state.generatedContents,
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
          
          // Extract items array from the nested response
          // @ts-ignore
          let items = response.data?.data || response.data;
          if (!Array.isArray(items)) {
            items = [];
          }

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
