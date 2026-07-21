"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import { SparklesIcon, DownloadIcon, ImageIcon, TrashIcon, CopyIcon, CheckIcon } from '@/components/icons';
import { post, get, del, api } from '@/lib/api';

// ============================================================================
// TYPES
// ============================================================================

type MenuBusinessType = 
  | 'RESTAURANT'
  | 'CAFE'
  | 'BAR'
  | 'BAKERY'
  | 'PIZZERIA'
  | 'SUSHI'
  | 'BURGER'
  | 'SALAD'
  | 'SEAFOOD'
  | 'STEAKHOUSE';

type PosterBusinessType = 
  | 'RESTAURANT'
  | 'CAFE'
  | 'RETAIL'
  | 'EVENT'
  | 'PROMOTION'
  | 'REAL_ESTATE'
  | 'HEALTH'
  | 'EDUCATION';

type MenuTemplate = 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'ELEGANT' | 'RUSTIC';
type PosterTemplate = 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'BOLD' | 'ELEGANT';
type PosterSize = 'SQUARE' | 'PORTRAIT' | 'LANDSCAPE' | 'STORY';
type QrCodeType = 'menu' | 'poster' | 'vcard' | 'wifi' | 'custom';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  image?: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface PosterSection {
  title?: string;
  items: string[];
}

interface Menu {
  id: string;
  name: string;
  businessName: string;
  businessType: MenuBusinessType;
  description?: string;
  categories: MenuCategory[];
  template: MenuTemplate;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  html?: string;
  css?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  slug?: string;
  publishedAt?: string;
  vercelUrl?: string;
  qrCodeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Poster {
  id: string;
  name: string;
  businessName: string;
  businessType: PosterBusinessType;
  title?: string;
  description?: string;
  sections: PosterSection[];
  template: PosterTemplate;
  size: PosterSize;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  content?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  slug?: string;
  publishedAt?: string;
  vercelUrl?: string;
  qrCodeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MENU_BUSINESS_TYPES: { value: MenuBusinessType; label: string }[] = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'CAFE', label: 'Café' },
  { value: 'BAR', label: 'Bar' },
  { value: 'BAKERY', label: 'Bakery' },
  { value: 'PIZZERIA', label: 'Pizzeria' },
  { value: 'SUSHI', label: 'Sushi Bar' },
  { value: 'BURGER', label: 'Burger Joint' },
  { value: 'SALAD', label: 'Salad Bar' },
  { value: 'SEAFOOD', label: 'Seafood' },
  { value: 'STEAKHOUSE', label: 'Steakhouse' },
];

const POSTER_BUSINESS_TYPES: { value: PosterBusinessType; label: string }[] = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'CAFE', label: 'Café' },
  { value: 'RETAIL', label: 'Retail Store' },
  { value: 'EVENT', label: 'Event' },
  { value: 'PROMOTION', label: 'Promotion / Sale' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'HEALTH', label: 'Health & Wellness' },
  { value: 'EDUCATION', label: 'Education' },
];

const MENU_TEMPLATES: { value: MenuTemplate; label: string }[] = [
  { value: 'MODERN', label: 'Modern' },
  { value: 'CLASSIC', label: 'Classic' },
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'ELEGANT', label: 'Elegant' },
  { value: 'RUSTIC', label: 'Rustic' },
];

const POSTER_TEMPLATES: { value: PosterTemplate; label: string }[] = [
  { value: 'MODERN', label: 'Modern' },
  { value: 'CLASSIC', label: 'Classic' },
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'BOLD', label: 'Bold' },
  { value: 'ELEGANT', label: 'Elegant' },
];

const POSTER_SIZES: { value: PosterSize; label: string; dimensions: string }[] = [
  { value: 'SQUARE', label: 'Square', dimensions: '1080 x 1080' },
  { value: 'PORTRAIT', label: 'Portrait', dimensions: '1080 x 1350' },
  { value: 'LANDSCAPE', label: 'Landscape', dimensions: '1200 x 628' },
  { value: 'STORY', label: 'Story', dimensions: '1080 x 1920' },
];

const FONT_OPTIONS = [
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Oswald, sans-serif", label: "Oswald" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Lora, serif", label: "Lora" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Bebas Neue, sans-serif", label: "Bebas Neue" },
  { value: "Dancing Script, cursive", label: "Dancing Script" },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CreatePage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'menu' | 'poster' | 'qrcode'>('menu');

  // ============================================================================
  // MENU STATE
  // ============================================================================
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [isLoadingMenus, setIsLoadingMenus] = useState(true);
  const [menuError, setMenuError] = useState('');
  const [copiedMenuId, setCopiedMenuId] = useState<string | null>(null);

  const [menuFormData, setMenuFormData] = useState({
    name: '',
    businessName: '',
    businessType: 'RESTAURANT' as MenuBusinessType,
    description: '',
    template: 'MODERN' as MenuTemplate,
    primaryColor: '#1a1a2e',
    secondaryColor: '#16213e',
    accentColor: '#e94560',
    fontFamily: 'Playfair Display, serif',
  });

  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([
    { name: 'Starters', items: [{ id: '1', name: '', price: '' }] },
  ]);

  // ============================================================================
  // POSTER STATE
  // ============================================================================
  const [posters, setPosters] = useState<Poster[]>([]);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [isLoadingPosters, setIsLoadingPosters] = useState(true);
  const [posterError, setPosterError] = useState('');
  const [copiedPosterId, setCopiedPosterId] = useState<string | null>(null);

  const [posterFormData, setPosterFormData] = useState({
    name: '',
    businessName: '',
    businessType: 'RESTAURANT' as PosterBusinessType,
    title: '',
    description: '',
    template: 'MODERN' as PosterTemplate,
    size: 'SQUARE' as PosterSize,
    primaryColor: '#1a1a2e',
    secondaryColor: '#16213e',
    accentColor: '#e94560',
    fontFamily: 'Montserrat, sans-serif',
  });

  const [posterSections, setPosterSections] = useState<PosterSection[]>([
    { title: 'Special Offer', items: ['50% OFF', 'Today Only'] },
  ]);

  // ============================================================================
  // QR CODE STATE
  // ============================================================================
  const [qrActiveTab, setQrActiveTab] = useState<QrCodeType>('menu');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  // Menu QR
  const [restaurantName, setRestaurantName] = useState('');
  const [menuUrl, setMenuUrl] = useState('');

  // Poster QR
  const [campaignName, setCampaignName] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  // VCard QR
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  // WiFi QR
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Custom QR
  const [customContent, setCustomContent] = useState('');

  // ============================================================================
  // EFFECTS
  // ============================================================================
  useEffect(() => {
    fetchMenus();
    fetchPosters();
  }, []);

  // ============================================================================
  // MENU FUNCTIONS
  // ============================================================================
  const fetchMenus = async () => {
    try {
      setIsLoadingMenus(true);
      const response = await get<Menu[]>('/menus');
      setMenus(response.data);
    } catch (err) {
      console.error('Failed to fetch menus:', err);
    } finally {
      setIsLoadingMenus(false);
    }
  };

  const handleMenuInputChange = (field: string, value: string) => {
    setMenuFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addMenuCategory = () => {
    setMenuCategories((prev) => [
      ...prev,
      { name: '', items: [{ id: Date.now().toString(), name: '', price: '' }] },
    ]);
  };

  const removeMenuCategory = (index: number) => {
    setMenuCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMenuCategoryName = (index: number, name: string) => {
    setMenuCategories((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, name } : cat))
    );
  };

  const addMenuItem = (categoryIndex: number) => {
    setMenuCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, items: [...cat.items, { id: Date.now().toString(), name: '', price: '' }] }
          : cat
      )
    );
  };

  const removeMenuItem = (categoryIndex: number, itemIndex: number) => {
    setMenuCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, items: cat.items.filter((_, idx) => idx !== itemIndex) }
          : cat
      )
    );
  };

  const updateMenuItem = (categoryIndex: number, itemIndex: number, field: 'name' | 'price' | 'image', value: string) => {
    setMenuCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              items: cat.items.map((item, idx) =>
                idx === itemIndex ? { ...item, [field]: value } : item
              ),
            }
          : cat
      )
    );
  };

  const handleGenerateMenu = async () => {
    setMenuError('');
    setIsGeneratingMenu(true);

    try {
      const validCategories = menuCategories.filter(
        (cat) => cat.name && cat.items.some((item) => item.name && item.price)
      );

      const response = await post<Menu>('/menus/generate', {
        name: menuFormData.name,
        businessName: menuFormData.businessName,
        businessType: menuFormData.businessType,
        description: menuFormData.description,
        categories: validCategories,
        template: menuFormData.template,
        primaryColor: menuFormData.primaryColor,
        secondaryColor: menuFormData.secondaryColor,
        accentColor: menuFormData.accentColor,
        fontFamily: menuFormData.fontFamily,
      });

      setMenus((prev) => [response.data, ...prev]);
      setSelectedMenu(response.data);
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : 'Failed to generate menu');
    } finally {
      setIsGeneratingMenu(false);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    try {
      await del(`/menus/${id}`);
      setMenus((prev) => prev.filter((m) => m.id !== id));
      if (selectedMenu?.id === id) {
        setSelectedMenu(null);
      }
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : 'Failed to delete menu');
    }
  };

  const handlePublishMenu = async (menu: Menu) => {
    try {
      const response = await post<Menu>(`/menus/${menu.id}/publish`, {});
      setMenus((prev) =>
        prev.map((m) => (m.id === menu.id ? response.data : m))
      );
      setSelectedMenu(response.data);
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : 'Failed to publish menu');
    }
  };

  const copyMenuToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedMenuId(id);
    setTimeout(() => setCopiedMenuId(null), 2000);
  };

  // ============================================================================
  // POSTER FUNCTIONS
  // ============================================================================
  const fetchPosters = async () => {
    try {
      setIsLoadingPosters(true);
      const response = await get<Poster[]>('/posters');
      setPosters(response.data);
    } catch (err) {
      console.error('Failed to fetch posters:', err);
    } finally {
      setIsLoadingPosters(false);
    }
  };

  const handlePosterInputChange = (field: string, value: string) => {
    setPosterFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPosterSection = () => {
    setPosterSections((prev) => [
      ...prev,
      { title: '', items: [''] },
    ]);
  };

  const removePosterSection = (index: number) => {
    setPosterSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePosterSectionTitle = (index: number, title: string) => {
    setPosterSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, title } : sec))
    );
  };

  const addPosterItem = (sectionIndex: number) => {
    setPosterSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? { ...sec, items: [...sec.items, ''] }
          : sec
      )
    );
  };

  const removePosterItem = (sectionIndex: number, itemIndex: number) => {
    setPosterSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? { ...sec, items: sec.items.filter((_, idx) => idx !== itemIndex) }
          : sec
      )
    );
  };

  const updatePosterItem = (sectionIndex: number, itemIndex: number, value: string) => {
    setPosterSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              items: sec.items.map((item, idx) =>
                idx === itemIndex ? value : item
              ),
            }
          : sec
      )
    );
  };

  const handleGeneratePoster = async () => {
    setPosterError('');
    setIsGeneratingPoster(true);

    try {
      const validSections = posterSections.filter(
        (sec) => sec.items.some((item) => item.trim())
      );

      const response = await post<Poster>('/posters/generate', {
        name: posterFormData.name,
        businessName: posterFormData.businessName,
        businessType: posterFormData.businessType,
        title: posterFormData.title,
        description: posterFormData.description,
        sections: validSections,
        template: posterFormData.template,
        size: posterFormData.size,
        primaryColor: posterFormData.primaryColor,
        secondaryColor: posterFormData.secondaryColor,
        accentColor: posterFormData.accentColor,
        fontFamily: posterFormData.fontFamily,
      });

      setPosters((prev) => [response.data, ...prev]);
      setSelectedPoster(response.data);
    } catch (err) {
      setPosterError(err instanceof Error ? err.message : 'Failed to generate poster');
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  const handleDeletePoster = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poster?')) return;

    try {
      await del(`/posters/${id}`);
      setPosters((prev) => prev.filter((p) => p.id !== id));
      if (selectedPoster?.id === id) {
        setSelectedPoster(null);
      }
    } catch (err) {
      setPosterError(err instanceof Error ? err.message : 'Failed to delete poster');
    }
  };

  const handlePublishPoster = async (poster: Poster) => {
    try {
      const response = await post<Poster>(`/posters/${poster.id}/publish`, {});
      setPosters((prev) =>
        prev.map((p) => (p.id === poster.id ? response.data : p))
      );
      setSelectedPoster(response.data);
    } catch (err) {
      setPosterError(err instanceof Error ? err.message : 'Failed to publish poster');
    }
  };

  const copyPosterToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedPosterId(id);
    setTimeout(() => setCopiedPosterId(null), 2000);
  };

  // ============================================================================
  // QR CODE FUNCTIONS
  // ============================================================================
  const handleGenerateQrCode = async () => {
    setIsGeneratingQr(true);
    setQrError(null);
    setQrCodeImage(null);

    try {
      let endpoint = '/qr-code/';
      let payload: Record<string, unknown> = {};

      switch (qrActiveTab) {
        case 'menu':
          endpoint += 'menu';
          payload = { restaurantName, menuUrl, size: 300 };
          break;
        case 'poster':
          endpoint += 'poster';
          payload = { campaignName, posterUrl, size: 300 };
          break;
        case 'vcard':
          endpoint += 'vcard';
          payload = { fullName, jobTitle, company, phone, email, website, size: 300 };
          break;
        case 'wifi':
          endpoint += 'wifi';
          payload = { ssid: wifiSsid, password: wifiPassword, type: wifiType, size: 300 };
          break;
        case 'custom':
          endpoint += 'generate';
          payload = { content: customContent, size: 300 };
          break;
      }

      const response = await api.post(endpoint, payload);
      if (response.data.success && response.data.data) {
        setQrCodeImage(response.data.data.base64);
      } else {
        throw new Error(response.data.error || 'Error generating QR code');
      }
    } catch (err) {
      setQrError('Error generating QR code');
      console.error(err);
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleDownloadQrCode = () => {
    if (!qrCodeImage) return;
    
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = `qrcode-${qrActiveTab}.png`;
    link.click();
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Content</h1>
          <p className="text-gray-600">Generate menus, posters, and QR codes for your business</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="poster">Poster</TabsTrigger>
          <TabsTrigger value="qrcode">QR Code</TabsTrigger>
        </TabsList>

        {/* ============================================================================ */}
        {/* MENU TAB */}
        {/* ============================================================================ */}
        <TabsContent value="menu" className="space-y-6">
          {menuError && (
            <Alert variant="destructive">
              <AlertDescription>{menuError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Menu Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Menu Details</CardTitle>
                  <CardDescription>Enter your menu information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="menu-name">Menu Name</Label>
                    <Input
                      id="menu-name"
                      value={menuFormData.name}
                      onChange={(e) => handleMenuInputChange('name', e.target.value)}
                      placeholder="e.g., Lunch Menu, Dinner Menu"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="menu-businessName">Business Name</Label>
                    <Input
                      id="menu-businessName"
                      value={menuFormData.businessName}
                      onChange={(e) => handleMenuInputChange('businessName', e.target.value)}
                      placeholder="Your restaurant name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="menu-businessType">Business Type</Label>
                    <Select
                      id="menu-businessType"
                      value={menuFormData.businessType}
                      onChange={(e) => handleMenuInputChange('businessType', e.target.value)}
                    >
                      {MENU_BUSINESS_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="menu-description">Description (Optional)</Label>
                    <textarea
                      id="menu-description"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      value={menuFormData.description}
                      onChange={(e) => handleMenuInputChange('description', e.target.value)}
                      placeholder="A brief description of your restaurant"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="menu-template">Template</Label>
                      <Select
                        id="menu-template"
                        value={menuFormData.template}
                        onChange={(e) => handleMenuInputChange('template', e.target.value)}
                      >
                        {MENU_TEMPLATES.map((tmpl) => (
                          <option key={tmpl.value} value={tmpl.value}>
                            {tmpl.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="menu-font">Font Family</Label>
                      <Select
                        id="menu-font"
                        value={menuFormData.fontFamily}
                        onChange={(e) => handleMenuInputChange('fontFamily', e.target.value)}
                      >
                        {FONT_OPTIONS.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="menu-primary">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="menu-primary"
                          type="color"
                          value={menuFormData.primaryColor}
                          onChange={(e) => handleMenuInputChange('primaryColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={menuFormData.primaryColor}
                          onChange={(e) => handleMenuInputChange('primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="menu-secondary">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="menu-secondary"
                          type="color"
                          value={menuFormData.secondaryColor}
                          onChange={(e) => handleMenuInputChange('secondaryColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={menuFormData.secondaryColor}
                          onChange={(e) => handleMenuInputChange('secondaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="menu-accent">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="menu-accent"
                          type="color"
                          value={menuFormData.accentColor}
                          onChange={(e) => handleMenuInputChange('accentColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={menuFormData.accentColor}
                          onChange={(e) => handleMenuInputChange('accentColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Menu Categories</CardTitle>
                      <CardDescription>Add categories and items</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={addMenuCategory}>
                      Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {menuCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border rounded-lg p-4 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Category name (e.g., Starters)"
                          value={category.name}
                          onChange={(e) => updateMenuCategoryName(categoryIndex, e.target.value)}
                          className="flex-1"
                        />
                        {menuCategories.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMenuCategory(categoryIndex)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2 pl-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={item.id} className="flex gap-2 items-center flex-wrap">
                            <Input
                              placeholder="Item name"
                              value={item.name}
                              onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'name', e.target.value)}
                              className="flex-1 min-w-[150px]"
                            />
                            <Input
                              placeholder="Price"
                              value={item.price}
                              onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'price', e.target.value)}
                              className="w-28"
                            />
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const response = await api.upload<{ url: string }>('/images/upload', file);
                                      updateMenuItem(categoryIndex, itemIndex, 'image', response.data.url);
                                    } catch (err) {
                                      console.error('Failed to upload image:', err);
                                    }
                                  }
                                }}
                              />
                              <div className="flex items-center justify-center w-10 h-10 border rounded-md hover:bg-gray-50">
                                {item.image ? (
                                  <img src={item.image} alt="" className="w-8 h-8 object-cover rounded" />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </label>
                            {category.items.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeMenuItem(categoryIndex, itemIndex)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addMenuItem(categoryIndex)}
                        >
                          + Add Item
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleGenerateMenu}
                    disabled={isGeneratingMenu}
                  >
                    {isGeneratingMenu ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Generate Menu
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Menu History */}
            <Card>
              <CardHeader>
                <CardTitle>Your Menus</CardTitle>
                <CardDescription>View and manage your generated menus</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingMenus ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : menus.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No menus yet. Create your first menu!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {menus.map((menu) => (
                      <div
                        key={menu.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedMenu?.id === menu.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedMenu(menu)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{menu.name}</h3>
                            <p className="text-sm text-gray-500">{menu.businessName}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                {menu.businessType}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                {menu.template}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                menu.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                              }`}>
                                {menu.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {menu.vercelUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyMenuToClipboard(menu.vercelUrl!, menu.id);
                                }}
                              >
                                {copiedMenuId === menu.id ? (
                                  <CheckIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                  <CopyIcon className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            {menu.status !== 'PUBLISHED' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePublishMenu(menu);
                                }}
                              >
                                Publish
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMenu(menu.id);
                              }}
                            >
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================================ */}
        {/* POSTER TAB */}
        {/* ============================================================================ */}
        <TabsContent value="poster" className="space-y-6">
          {posterError && (
            <Alert variant="destructive">
              <AlertDescription>{posterError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Poster Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Poster Details</CardTitle>
                  <CardDescription>Enter your poster information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="poster-name">Poster Name</Label>
                    <Input
                      id="poster-name"
                      value={posterFormData.name}
                      onChange={(e) => handlePosterInputChange('name', e.target.value)}
                      placeholder="e.g., Summer Sale, Grand Opening"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poster-businessName">Business Name</Label>
                    <Input
                      id="poster-businessName"
                      value={posterFormData.businessName}
                      onChange={(e) => handlePosterInputChange('businessName', e.target.value)}
                      placeholder="Your business name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poster-businessType">Business Type</Label>
                    <Select
                      id="poster-businessType"
                      value={posterFormData.businessType}
                      onChange={(e) => handlePosterInputChange('businessType', e.target.value)}
                    >
                      {POSTER_BUSINESS_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poster-title">Main Title</Label>
                    <Input
                      id="poster-title"
                      value={posterFormData.title}
                      onChange={(e) => handlePosterInputChange('title', e.target.value)}
                      placeholder="e.g., 50% OFF, Grand Opening"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poster-description">Description</Label>
                    <textarea
                      id="poster-description"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      value={posterFormData.description}
                      onChange={(e) => handlePosterInputChange('description', e.target.value)}
                      placeholder="Additional details about your promotion"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="poster-template">Template</Label>
                      <Select
                        id="poster-template"
                        value={posterFormData.template}
                        onChange={(e) => handlePosterInputChange('template', e.target.value)}
                      >
                        {POSTER_TEMPLATES.map((tmpl) => (
                          <option key={tmpl.value} value={tmpl.value}>
                            {tmpl.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="poster-size">Size</Label>
                      <Select
                        id="poster-size"
                        value={posterFormData.size}
                        onChange={(e) => handlePosterInputChange('size', e.target.value)}
                      >
                        {POSTER_SIZES.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label} ({size.dimensions})
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poster-font">Font Family</Label>
                    <Select
                      id="poster-font"
                      value={posterFormData.fontFamily}
                      onChange={(e) => handlePosterInputChange('fontFamily', e.target.value)}
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="poster-primary">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="poster-primary"
                          type="color"
                          value={posterFormData.primaryColor}
                          onChange={(e) => handlePosterInputChange('primaryColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={posterFormData.primaryColor}
                          onChange={(e) => handlePosterInputChange('primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="poster-secondary">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="poster-secondary"
                          type="color"
                          value={posterFormData.secondaryColor}
                          onChange={(e) => handlePosterInputChange('secondaryColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={posterFormData.secondaryColor}
                          onChange={(e) => handlePosterInputChange('secondaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="poster-accent">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="poster-accent"
                          type="color"
                          value={posterFormData.accentColor}
                          onChange={(e) => handlePosterInputChange('accentColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={posterFormData.accentColor}
                          onChange={(e) => handlePosterInputChange('accentColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sections */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Poster Sections</CardTitle>
                      <CardDescription>Add sections with content items</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={addPosterSection}>
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {posterSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border rounded-lg p-4 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Section title (e.g., Special Offer)"
                          value={section.title || ''}
                          onChange={(e) => updatePosterSectionTitle(sectionIndex, e.target.value)}
                          className="flex-1"
                        />
                        {posterSections.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePosterSection(sectionIndex)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2 pl-4">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-2 items-center">
                            <Input
                              placeholder="Item text"
                              value={item}
                              onChange={(e) => updatePosterItem(sectionIndex, itemIndex, e.target.value)}
                              className="flex-1"
                            />
                            {section.items.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removePosterItem(sectionIndex, itemIndex)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addPosterItem(sectionIndex)}
                        >
                          + Add Item
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleGeneratePoster}
                    disabled={isGeneratingPoster}
                  >
                    {isGeneratingPoster ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Generate Poster
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Poster History */}
            <Card>
              <CardHeader>
                <CardTitle>Your Posters</CardTitle>
                <CardDescription>View and manage your generated posters</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPosters ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : posters.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No posters yet. Create your first poster!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posters.map((poster) => (
                      <div
                        key={poster.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPoster?.id === poster.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedPoster(poster)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{poster.name}</h3>
                            <p className="text-sm text-gray-500">{poster.businessName}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                {poster.businessType}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                {poster.template}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                {poster.size}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                poster.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                              }`}>
                                {poster.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {poster.vercelUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyPosterToClipboard(poster.vercelUrl!, poster.id);
                                }}
                              >
                                {copiedPosterId === poster.id ? (
                                  <CheckIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                  <CopyIcon className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            {poster.status !== 'PUBLISHED' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePublishPoster(poster);
                                }}
                              >
                                Publish
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePoster(poster.id);
                              }}
                            >
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================================ */}
        {/* QR CODE TAB */}
        {/* ============================================================================ */}
        <TabsContent value="qrcode" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Generator</CardTitle>
              <CardDescription>Create QR codes for menus, posters, vCards, WiFi, and custom content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex border-b border-gray-200 overflow-x-auto mb-6">
                {[
                  { id: 'menu' as QrCodeType, label: 'Menu Restaurant', icon: '🍽️' },
                  { id: 'poster' as QrCodeType, label: 'Poster', icon: '📄' },
                  { id: 'vcard' as QrCodeType, label: 'vCard', icon: '👤' },
                  { id: 'wifi' as QrCodeType, label: 'WiFi', icon: '📶' },
                  { id: 'custom' as QrCodeType, label: 'Custom', icon: '✏️' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setQrActiveTab(tab.id);
                      setQrCodeImage(null);
                      setQrError(null);
                    }}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      qrActiveTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* QR Form */}
                <div className="space-y-4">
                  {qrActiveTab === 'menu' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="qr-restaurantName">Restaurant Name</Label>
                        <Input
                          id="qr-restaurantName"
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          placeholder="My Restaurant"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qr-menuUrl">Menu URL</Label>
                        <Input
                          id="qr-menuUrl"
                          type="url"
                          value={menuUrl}
                          onChange={(e) => setMenuUrl(e.target.value)}
                          placeholder="https://menu.example.com/my-restaurant"
                        />
                      </div>
                    </>
                  )}

                  {qrActiveTab === 'poster' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="qr-campaignName">Campaign Name</Label>
                        <Input
                          id="qr-campaignName"
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                          placeholder="Summer Sale 2024"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qr-posterUrl">Poster URL</Label>
                        <Input
                          id="qr-posterUrl"
                          type="url"
                          value={posterUrl}
                          onChange={(e) => setPosterUrl(e.target.value)}
                          placeholder="https://example.com/poster-promo"
                        />
                      </div>
                    </>
                  )}

                  {qrActiveTab === 'vcard' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="qr-fullName">Full Name</Label>
                          <Input
                            id="qr-fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="qr-jobTitle">Job Title</Label>
                          <Input
                            id="qr-jobTitle"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Marketing Director"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qr-company">Company</Label>
                        <Input
                          id="qr-company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="My Company LLC"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="qr-phone">Phone</Label>
                          <Input
                            id="qr-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="qr-email">Email</Label>
                          <Input
                            id="qr-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contact@example.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qr-website">Website</Label>
                        <Input
                          id="qr-website"
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://www.example.com"
                        />
                      </div>
                    </>
                  )}

                  {qrActiveTab === 'wifi' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="qr-wifiSsid">Network Name (SSID)</Label>
                        <Input
                          id="qr-wifiSsid"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          placeholder="MyWiFi"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qr-wifiPassword">Password</Label>
                        <Input
                          id="qr-wifiPassword"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          placeholder="WiFi Password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qr-wifiType">Security Type</Label>
                        <Select
                          id="qr-wifiType"
                          value={wifiType}
                          onChange={(e) => setWifiType(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None</option>
                        </Select>
                      </div>
                    </>
                  )}

                  {qrActiveTab === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="qr-customContent">Custom Content</Label>
                      <textarea
                        id="qr-customContent"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={customContent}
                        onChange={(e) => setCustomContent(e.target.value)}
                        placeholder="Enter your QR code content (URL, text, etc.)"
                        rows={6}
                      />
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleGenerateQrCode}
                    disabled={isGeneratingQr}
                  >
                    {isGeneratingQr ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Generate QR Code
                      </>
                    )}
                  </Button>

                  {qrError && (
                    <Alert variant="destructive">
                      <AlertDescription>{qrError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* QR Preview */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full max-w-sm aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                    {qrCodeImage ? (
                      <img
                        src={qrCodeImage}
                        alt="Generated QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <p>Your QR code will appear here</p>
                      </div>
                    )}
                  </div>

                  {qrCodeImage && (
                    <Button
                      className="mt-6 w-full max-w-sm"
                      onClick={handleDownloadQrCode}
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download QR Code
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}