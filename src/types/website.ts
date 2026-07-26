export interface WebsiteTheme {
  template: 'modern' | 'classic' | 'minimal' | 'bold';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  animations?: boolean;
  density?: 'compact' | 'normal' | 'spacious';
  buttonStyle?: 'pill' | 'rounded' | 'square';
  heroStyle?: 'gradient' | 'image' | 'minimal';
}

export interface WebsiteLogo {
  type: 'wordmark' | 'image';
  text?: string;
  imageUrl?: string;
}

export interface WebsiteSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'cta' | 'contact' | 'custom';
  visible: boolean;
  data: Record<string, any>;
}

export interface WebsiteContent {
  meta: { title: string; description: string; language: string };
  theme: WebsiteTheme;
  logo: WebsiteLogo;
  contact: { phone?: string; email?: string; address?: string };
  currency?: string;
  sections: WebsiteSection[];
}

export interface WebsiteResponse {
  id: string;
  subdomain: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  content: WebsiteContent;
  html: string;
  previewUrl: string;
  vercelUrl?: string;
  deploymentStatus?: string;
  publishedAt?: string;
}

export interface WebsiteSummary {
  id: string;
  subdomain: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  businessName: string;
  previewUrl: string;
  vercelUrl?: string;
  deploymentStatus?: string;
  updatedAt?: string;
}
