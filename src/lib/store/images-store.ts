"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get, post, del } from '@/lib/api';
import type { ImageItem } from '@/types';

export interface ImageForm {
  prompt: string;
  style: string;
  size: string;
  aiModel: string;
  negativePrompt: string;
}

interface ImagesStore {
  image: ImageForm;
  styles: string[];
  sizes: string[];
  aiModels: string[];
  generatedImages: ImageItem[];
  loading: boolean;
  updateImage: (updates: Partial<ImageForm>) => void;
  generateImage: () => Promise<void>;
  fetchImages: () => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  clearImage: () => void;
}

const defaultImage: ImageForm = {
  prompt: '',
  style: 'realistic',
  size: '1024x1024',
  aiModel: 'dall-e-3',
  negativePrompt: '',
};

const sizeToAspectRatio = (size: string): 'SQUARE' | 'LANDSCAPE' | 'PORTRAIT' => {
  if (size === '1792x1024') return 'LANDSCAPE';
  if (size === '1024x1792') return 'PORTRAIT';
  return 'SQUARE';
};

export const useImagesStore = create<ImagesStore>()(
  persist(
    (set, get) => ({
      image: { ...defaultImage },
      styles: ['realistic', 'artistic', 'minimalist', 'vintage', 'bold'],
      sizes: ['1024x1024', '1792x1024', '1024x1792'],
      aiModels: ['dall-e-3', 'dall-e-2', 'stable-diffusion-xl'],
      generatedImages: [],
      loading: false,

      updateImage: (updates) => {
        set((state) => ({
          image: { ...state.image, ...updates },
        }));
      },

      generateImage: async () => {
        set({ loading: true });
        try {
          const { image } = get();
          const response = await post<ImageItem>('/images/generate', {
            prompt: image.prompt,
            aspectRatio: sizeToAspectRatio(image.size),
            style: image.style,
          });

          set((state) => ({
            generatedImages: [response.data, ...state.generatedImages].slice(0, 50),
            loading: false,
          }));
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      fetchImages: async () => {
        set({ loading: true });
        try {
          const response = await get<ImageItem[]>('/images');
          set({ generatedImages: response.data, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      deleteImage: async (id: string) => {
        try {
          await del(`/images/${id}`);
          set((state) => ({
            generatedImages: state.generatedImages.filter((img) => img.id !== id),
          }));
        } catch (error) {
          throw error;
        }
      },

      clearImage: () => {
        set({ image: { ...defaultImage } });
      },
    }),
    {
      name: 'images-storage',
      partialize: (state) => ({
        image: state.image,
        generatedImages: state.generatedImages,
      }),
    }
  )
);