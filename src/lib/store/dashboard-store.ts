'use client';

import { create } from 'zustand';
import { get } from '@/lib/api';

export interface DashboardData {
  workspace: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
  stats: {
    totalContent: number;
    activeAccounts: number;
    scheduledEvents: number;
    successRate: number;
    changes: {
      content: number;
      accounts: number;
      scheduled: number;
    };
  };
  resources: {
    brands: number;
    images: number;
    calendars: number;
    websites: number;
    menus: number;
    posters: number;
  };
  health: {
    completedImages: number;
    failedImages: number;
    publishedWebsites: number;
    publishedMenus: number;
    publishedPosters: number;
  };
  recentContent: Array<{
    id: string;
    title: string;
    platform: string | null;
    type: string;
    status: string;
    createdAt: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    platform: string | null;
    scheduledAt: string;
    calendar: { id: string; name: string };
  }>;
  activities: Array<{
    id: string;
    type: 'content' | 'image' | 'website' | 'menu' | 'poster';
    action: string;
    title: string;
    status: string;
    createdAt: string;
    href: string;
  }>;
  analytics: Array<{
    month: string;
    content: number;
    images: number;
  }>;
  generatedAt: string;
}

interface DashboardStore {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchDashboard: (force?: boolean) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set, state) => ({
  data: null,
  loading: false,
  error: null,
  lastFetched: null,

  fetchDashboard: async (force = false) => {
    const current = state();
    if (current.loading) return;
    if (
      !force &&
      current.lastFetched &&
      Date.now() - current.lastFetched < 30_000
    ) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await get<DashboardData>('/dashboard');
      set({
        data: response.data,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Impossible de charger le dashboard.',
      });
    }
  },
}));
