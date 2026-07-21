export const APP_NAME = 'NextGen MarketingAI';
export const APP_DESCRIPTION = 'AI-powered marketing platform for SMEs';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'marketingai.dev';

export const NAVIGATION = [
  { name: 'Dashboard', href: '/dashboard', icon: 'Home' },
  { name: 'Content', href: '/content', icon: 'FileText' },
  { name: 'Social', href: '/social', icon: 'Share2' },
  { name: 'Images', href: '/images', icon: 'Image' },
  { name: 'Branding', href: '/branding', icon: 'Palette' },
  { name: 'Menu', href: '/menu', icon: 'Menu' },
  { name: 'Planner', href: '/planner', icon: 'Calendar' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
] as const;

export const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', color: '#E4405F' },
  { value: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { value: 'twitter', label: 'Twitter', color: '#1DA1F2' },
  { value: 'facebook', label: 'Facebook', color: '#1877F2' },
] as const;

export const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'inspirational', label: 'Inspirational' },
] as const;

export const CONTENT_LENGTHS = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
] as const;
