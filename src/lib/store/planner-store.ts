"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get as apiGet, post, put, del } from '@/lib/api';
import type { CalendarItem, CalendarEventItem } from '@/types';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  platform: string;
  status: string;
  contentId?: string;
}

interface PlannerStore {
  calendars: CalendarItem[];
  events: CalendarEvent[];
  selectedDate: string;
  selectedPlatform: string;
  platforms: string[];
  eventStatuses: string[];
  loading: boolean;
  generateCalendar: (data: {
    name: string;
    description?: string;
    topic: string;
    duration: 'WEEKLY' | 'MONTHLY';
    platforms: string[];
    startDate?: string;
    tone?: string;
  }) => Promise<void>;
  fetchCalendars: () => Promise<void>;
  fetchCalendarEvents: (calendarId: string) => Promise<void>;
  addEvent: (calendarId: string, event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  addEventToDefault: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
  setSelectedPlatform: (platform: string) => void;
  getEventsByDate: (date: string) => CalendarEvent[];
  getEventsByPlatform: (platform: string) => CalendarEvent[];
}

export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set, get) => ({
      calendars: [],
      events: [],
      selectedDate: new Date().toISOString().split('T')[0],
      selectedPlatform: 'all',
      platforms: ['FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN', 'TIKTOK', 'YOUTUBE'],
      eventStatuses: ['draft', 'scheduled', 'published', 'failed'],
      loading: false,

      generateCalendar: async (data) => {
        set({ loading: true });
        try {
          const response = await post<CalendarItem>('/planner/generate', data);
          set((state) => ({
            calendars: [response.data, ...state.calendars],
            loading: false,
          }));
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      fetchCalendars: async () => {
        set({ loading: true });
        try {
          const response = await apiGet<CalendarItem[]>('/planner');
          set({ calendars: response.data, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      fetchCalendarEvents: async (calendarId: string) => {
        set({ loading: true });
        try {
          const response = await apiGet<CalendarEventItem[]>(`/planner/${calendarId}/events`);
          const mapped: CalendarEvent[] = (response.data as any[]).map((e) => ({
            id: e.id,
            title: e.title,
            description: e.description || '',
            date: e.scheduledAt ? e.scheduledAt.split('T')[0] : '',
            time: e.scheduledAt ? e.scheduledAt.split('T')[1]?.substring(0, 5) || '' : '',
            platform: e.platform || '',
            status: e.status || 'draft',
            contentId: e.contentId,
          }));
          set({ events: mapped, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      addEvent: async (calendarId, event) => {
        try {
          const scheduledAt = event.time
            ? `${event.date}T${event.time}:00.000Z`
            : `${event.date}T09:00:00.000Z`;
          await post<CalendarEventItem>(`/planner/${calendarId}/events`, {
            title: event.title,
            description: event.description,
            platform: event.platform,
            scheduledAt,
            status: event.status,
          });
          // Refresh events after adding
          await get().fetchCalendarEvents(calendarId);
        } catch (error) {
          throw error;
        }
      },

      addEventToDefault: async (event) => {
        try {
          const calendars = get().calendars;
          const calendarId = calendars.length > 0 ? calendars[0].id : 'default';
          const scheduledAt = event.time
            ? `${event.date}T${event.time}:00.000Z`
            : `${event.date}T09:00:00.000Z`;
          await post<CalendarEventItem>(`/planner/${calendarId}/events`, {
            title: event.title,
            description: event.description,
            platform: event.platform,
            scheduledAt,
            status: event.status,
          });
          // Refresh events after adding
          await get().fetchCalendarEvents(calendarId);
        } catch (error) {
          throw error;
        }
      },

      updateEvent: async (id, updates) => {
        try {
          const body: any = {};
          if (updates.title) body.title = updates.title;
          if (updates.description) body.description = updates.description;
          if (updates.platform) body.platform = updates.platform;
          if (updates.status) body.status = updates.status;
          if (updates.date || updates.time) {
            const date = updates.date || get().events.find((e) => e.id === id)?.date || '';
            const time = updates.time || get().events.find((e) => e.id === id)?.time || '09:00';
            body.scheduledAt = `${date}T${time}:00.000Z`;
          }
          await put<CalendarEventItem>(`/planner/events/${id}`, body);
          set((state) => ({
            events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
          }));
        } catch (error) {
          throw error;
        }
      },

      removeEvent: async (id) => {
        try {
          await del(`/planner/events/${id}`);
          set((state) => ({
            events: state.events.filter((e) => e.id !== id),
          }));
        } catch (error) {
          throw error;
        }
      },

      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

      getEventsByDate: (date) => {
        return get().events.filter((e) => e.date === date);
      },

      getEventsByPlatform: (platform) => {
        if (platform === 'all') return get().events;
        return get().events.filter((e) => e.platform === platform);
      },
    }),
    {
      name: 'planner-storage',
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        selectedPlatform: state.selectedPlatform,
      }),
    }
  )
);
