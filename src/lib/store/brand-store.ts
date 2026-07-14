"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get as apiGet, post, put, del } from '@/lib/api';
import type { BrandItem } from '@/types';

interface BrandForm {
  name: string;
  slug: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  tagline: string;
  description: string;
  tone: string;
  industry: string;
  targetAudience: string;
  values: string;
  guidelines: string;
}

interface BrandStore {
  brand: BrandForm;
  savedBrands: BrandItem[];
  updateBrand: (updates: Partial<BrandForm>) => void;
  generateBranding: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  loading: boolean;
}

export const useBrandStore = create<BrandStore>()(
  persist(
    (set, get) => ({
      brand: {
        name: '',
        slug: '',
        logo: '',
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        accentColor: '#ec4899',
        fontFamily: 'Inter, sans-serif',
        tagline: '',
        description: '',
        tone: 'professional',
        industry: '',
        targetAudience: '',
        values: '',
        guidelines: '',
      },
      savedBrands: [],
      loading: false,
      
      updateBrand: (updates) => {
        set((state) => ({
          brand: { ...state.brand, ...updates },
        }));
      },
      
      generateBranding: async () => {
        set({ loading: true });
        try {
          const brand = get().brand;
          const response = await post<BrandItem>('/branding/generate', {
            brandName: brand.name,
            industry: brand.industry,
            description: brand.description,
            style: 'modern' as const,
            values: brand.values,
          });

          const data = response.data;
          set((state) => ({
            brand: {
              ...state.brand,
              name: data.name || state.brand.name,
              tagline: data.tagline || state.brand.tagline,
              description: data.description || state.brand.description,
              primaryColor: data.primaryColor || state.brand.primaryColor,
              secondaryColor: data.secondaryColor || state.brand.secondaryColor,
              accentColor: data.accentColor || state.brand.accentColor,
              fontFamily: data.fontFamily || state.brand.fontFamily,
              tone: data.tone || state.brand.tone,
              industry: data.industry || state.brand.industry,
              values: typeof data.values === 'string' ? data.values : state.brand.values,
              guidelines: data.guidelines || state.brand.guidelines,
            },
            savedBrands: [data, ...state.savedBrands].slice(0, 50),
            loading: false,
          }));
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      fetchBrands: async () => {
        set({ loading: true });
        try {
          const response = await apiGet<BrandItem[]>('/branding');
          set({ savedBrands: response.data, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      deleteBrand: async (id: string) => {
        try {
          await del(`/branding/${id}`);
          set((state) => ({
            savedBrands: state.savedBrands.filter((b) => b.id !== id),
          }));
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'brand-storage',
      partialize: (state) => ({
        brand: state.brand,
        savedBrands: state.savedBrands,
      }),
    }
  )
);