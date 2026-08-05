"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get as apiGet, post, put, del } from '@/lib/api';
import type { SocialAccountItem, SocialPostItem } from '@/types';

const parseHashtags = (val: any): string[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim() !== '') return val.split(',').map((v: string) => v.trim());
  return [];
};

export interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  connected: boolean;
  avatar?: string;
  followers?: number;
  lastSync?: string;
}

export interface SocialPost {
  id: string;
  content: string;
  platform: string;
  scheduledDate: string;
  status: string;
  mediaUrls: string[];
  hashtags: string[];
}

interface SocialStore {
  accounts: SocialAccount[];
  posts: SocialPost[];
  selectedPlatform: string;
  platforms: string[];
  loading: boolean;
  generatePost: (data: {
    platform: string;
    topic: string;
    tone?: string;
    hashtags?: string;
  }) => Promise<void>;
  fetchPosts: () => Promise<void>;
  addPost: (data: Omit<SocialPost, 'id'>) => Promise<void>;
  updatePost: (id: string, updates: Partial<SocialPost>) => Promise<void>;
  removePost: (id: string) => Promise<void>;
  connectAccount: (data: {
    platform: string;
    accountName: string;
    connected?: boolean;
  }) => Promise<void>;
  fetchAccounts: () => Promise<void>;
  disconnectAccount: (id: string) => Promise<void>;
  setSelectedPlatform: (platform: string) => void;
  getPostsByPlatform: (platform: string) => SocialPost[];
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      accounts: [],
      posts: [],
      selectedPlatform: 'all',
      platforms: ['FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'TIKTOK', 'YOUTUBE'],
      loading: false,

      generatePost: async (data) => {
        set({ loading: true });
        try {
          const response = await post<SocialPostItem>('/social/posts/generate', data);
          const mapped: SocialPost = {
            id: response.data.id,
            content: (response.data as any).content || '',
            platform: (response.data as any).platform || data.platform,
            scheduledDate: (response.data as any).scheduledAt || '',
            status: (response.data as any).status || 'draft',
            mediaUrls: (response.data as any).mediaUrls || [],
            hashtags: parseHashtags((response.data as any).hashtags),
          };
          set((state) => ({
            posts: [mapped, ...state.posts],
            loading: false,
          }));
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      fetchPosts: async () => {
        set({ loading: true });
        try {
          const response = await apiGet<SocialPostItem[]>('/social/posts');
          const mapped: SocialPost[] = (response.data as any[]).map((p) => ({
            id: p.id,
            content: p.content || '',
            platform: p.platform || '',
            scheduledDate: p.scheduledAt || '',
            status: p.status || 'draft',
            mediaUrls: p.mediaUrls || [],
            hashtags: parseHashtags(p.hashtags),
          }));
          set({ posts: mapped, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      updatePost: async (id, updates) => {
        try {
          const body: any = {};
          if (updates.content) body.content = updates.content;
          if (updates.platform) body.platform = updates.platform;
          if (updates.status) body.status = updates.status;
          if (updates.scheduledDate) body.scheduledAt = updates.scheduledDate;
          if (updates.hashtags) body.hashtags = updates.hashtags;
          await put<SocialPostItem>(`/social/posts/${id}`, body);
          set((state) => ({
            posts: state.posts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          }));
        } catch (error) {
          throw error;
        }
      },

      removePost: async (id) => {
        try {
          await del(`/social/posts/${id}`);
          set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
          }));
        } catch (error) {
          throw error;
        }
      },

      connectAccount: async (data) => {
        try {
          const response = await post<SocialAccountItem>('/social/accounts', {
            platform: data.platform,
            username: data.accountName,
          });
          const mapped: SocialAccount = {
            id: response.data.id,
            platform: response.data.platform || data.platform,
            accountName: response.data.username || data.accountName,
            connected: true,
            avatar: (response.data as any).avatar,
            followers: (response.data as any).followers,
            lastSync: new Date().toISOString(),
          };
          set((state) => ({
            accounts: [...state.accounts, mapped],
          }));
        } catch (error) {
          throw error;
        }
      },

      addPost: async (data) => {
        try {
          const response = await post<SocialPostItem>('/social/posts', {
            content: data.content,
            platform: data.platform,
            scheduledAt: data.scheduledDate,
            status: data.status,
            hashtags: data.hashtags,
            mediaUrls: data.mediaUrls,
          });
          const mapped: SocialPost = {
            id: response.data.id,
            content: response.data.body || data.content,
            platform: response.data.platform || data.platform,
            scheduledDate: response.data.scheduledAt || data.scheduledDate,
            status: response.data.status || data.status,
            mediaUrls: data.mediaUrls,
            hashtags: parseHashtags(response.data.hashtags || data.hashtags),
          };
          set((state) => ({
            posts: [mapped, ...state.posts],
          }));
        } catch (error) {
          throw error;
        }
      },

      fetchAccounts: async () => {
        set({ loading: true });
        try {
          const response = await apiGet<SocialAccountItem[]>('/social/accounts');
          const mapped: SocialAccount[] = (response.data as any[]).map((a) => ({
            id: a.id,
            platform: a.platform || '',
            accountName: a.username || '',
            connected: true,
            avatar: a.avatar,
            followers: a.followers,
            lastSync: a.lastSync,
          }));
          set({ accounts: mapped, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      disconnectAccount: async (id) => {
        try {
          await del(`/social/accounts/${id}`);
          set((state) => ({
            accounts: state.accounts.filter((a) => a.id !== id),
          }));
        } catch (error) {
          throw error;
        }
      },

      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

      getPostsByPlatform: (platform) => {
        if (platform === 'all') return get().posts;
        return get().posts.filter((p) => p.platform === platform);
      },
    }),
    {
      name: 'social-storage',
      partialize: (state) => ({
        selectedPlatform: state.selectedPlatform,
      }),
    }
  )
);
