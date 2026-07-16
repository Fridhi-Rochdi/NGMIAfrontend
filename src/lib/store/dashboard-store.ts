"use client";

import { create } from 'zustand';
import { get as apiGet } from '@/lib/api';

export interface DashboardStats {
  totalPosts: number;
  activeAccounts: number;
  scheduledPosts: number;
  aiSuccessRate: number;
  totalBrands: number;
  totalImages: number;
  totalCalendars: number;
  tenantName: string;
  tenantPlan: string;
}

export interface RecentPost {
  id: string;
  title: string;
  platform: string;
  status: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  content: string;
  user: string;
  time: string;
}

interface DashboardStore {
  stats: DashboardStats | null;
  recentPosts: RecentPost[];
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchDashboardData: () => Promise<void>;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  stats: null,
  recentPosts: [],
  activities: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchDashboardData: async () => {
    // Debounce: skip if fetched less than 30s ago
    const { lastFetched } = get();
    if (lastFetched && Date.now() - lastFetched < 30000) return;

    set({ loading: true, error: null });
    try {
      // Use the dedicated tenant stats endpoint
      const [statsRes, postsRes, accountsRes] = await Promise.all([
        apiGet<any>('/tenant/stats'),
        apiGet<any>('/content'),
        apiGet<any>('/social/accounts'),
      ]);

      // Backend wraps responses in { data: { data: ... } } via TransformInterceptor
      // The api.ts handleResponse returns { data: rawJson }
      // rawJson = { data: actualPayload, statusCode, timestamp }
      const tenantStats = statsRes.data?.data ?? statsRes.data ?? {};
      const posts: any[] = Array.isArray(postsRes.data?.data)
        ? postsRes.data.data
        : Array.isArray(postsRes.data)
        ? postsRes.data
        : [];
      const accounts: any[] = Array.isArray(accountsRes.data?.data)
        ? accountsRes.data.data
        : Array.isArray(accountsRes.data)
        ? accountsRes.data
        : [];

      // Scheduled posts: posts where scheduledAt is in the future
      const now = new Date();
      const scheduledCount = posts.filter((p: any) => p.scheduledAt && new Date(p.scheduledAt) > now).length;

      // AI success rate: ratio of published vs total (if any)
      const publishedPosts = posts.filter((p: any) => p.status === 'PUBLISHED').length;
      const aiRate = posts.length > 0 ? Math.round((publishedPosts / posts.length) * 100) : 0;

      const stats: DashboardStats = {
        totalPosts: tenantStats.usage?.contents ?? posts.length,
        activeAccounts: tenantStats.usage?.socialAccounts ?? accounts.length,
        scheduledPosts: scheduledCount,
        aiSuccessRate: aiRate,
        totalBrands: tenantStats.usage?.brands ?? 0,
        totalImages: tenantStats.usage?.images ?? 0,
        totalCalendars: tenantStats.usage?.calendars ?? 0,
        tenantName: tenantStats.name ?? '',
        tenantPlan: tenantStats.plan ?? 'FREE',
      };

      // Recent posts (latest 5)
      const recentPosts: RecentPost[] = posts.slice(0, 5).map((p: any) => ({
        id: p.id,
        title: p.title || p.prompt || 'Untitled',
        platform: p.platform || 'General',
        status: p.status || 'GENERATED',
        createdAt: p.createdAt || new Date().toISOString(),
      }));

      // Activity feed from posts
      const activities: ActivityItem[] = posts.slice(0, 6).map((p: any) => ({
        id: p.id,
        action: p.status === 'PUBLISHED' ? 'Published' : 'Generated',
        content: `${p.type || 'Content'} for ${p.platform || 'General'}`,
        user: 'AI Engine',
        time: formatTimeAgo(p.createdAt || new Date().toISOString()),
      }));

      set({ stats, recentPosts, activities, loading: false, error: null, lastFetched: Date.now() });
    } catch (error: any) {
      console.error('[Dashboard] Failed to fetch data:', error);
      set({
        loading: false,
        error: error?.message || 'Failed to fetch dashboard data',
        stats: {
          totalPosts: 0,
          activeAccounts: 0,
          scheduledPosts: 0,
          aiSuccessRate: 0,
          totalBrands: 0,
          totalImages: 0,
          totalCalendars: 0,
          tenantName: '',
          tenantPlan: 'FREE',
        },
        recentPosts: [],
        activities: [],
      });
    }
  },
}));