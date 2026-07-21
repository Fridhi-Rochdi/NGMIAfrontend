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
// Note: Select is a native HTML select wrapper - use <option> children, onChange, and value props
import { post, get, del } from '@/lib/api';

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

type MenuTemplate = 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'ELEGANT' | 'RUSTIC';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
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

const BUSINESS_TYPES: { value: MenuBusinessType; label: string }[] = [
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

const TEMPLATES: { value: MenuTemplate; label: string }[] = [
  { value: 'MODERN', label: 'Modern' },
  { value: 'CLASSIC', label: 'Classic' },
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'ELEGANT', label: 'Elegant' },
  { value: 'RUSTIC', label: 'Rustic' },
];

const FONT_OPTIONS = [
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Lora, serif", label: "Lora" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Dancing Script, cursive", label: "Dancing Script" },
  { value: "Oswald, sans-serif", label: "Oswald" },
];

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
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

  // Categories state
  const [categories, setCategories] = useState<MenuCategory[]>([
    {
      name: 'Starters',
      items: [
        { id: '1', name: '', price: '' },
      ],
    },
  ]);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const response = await get<Menu[]>('/menus');
      setMenus(response.data);
    } catch (err) {
      console.error('Failed to fetch menus:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      {
        name: '',
        items: [{ id: Date.now().toString(), name: '', price: '' }],
      },
    ]);
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCategoryName = (index: number, name: string) => {
    setCategories((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, name } : cat))
    );
  };

  const addItem = (categoryIndex: number) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, items: [...cat.items, { id: Date.now().toString(), name: '', price: '' }] }
          : cat
      )
    );
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, items: cat.items.filter((_, idx) => idx !== itemIndex) }
          : cat
      )
    );
  };

  const updateItem = (categoryIndex: number, itemIndex: number, field: 'name' | 'price', value: string) => {
    setCategories((prev) =>
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

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      const validCategories = categories.filter(
        (cat) => cat.name && cat.items.some((item) => item.name && item.price)
      );

      const response = await post<Menu>('/menus/generate', {
        name: formData.name,
        businessName: formData.businessName,
        businessType: formData.businessType,
        description: formData.description,
        categories: validCategories,
        template: formData.template,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        accentColor: formData.accentColor,
        fontFamily: formData.fontFamily,
      });

      setMenus((prev) => [response.data, ...prev]);
      setSelectedMenu(response.data);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate menu');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    try {
      await del(`/menus/${id}`);
      setMenus((prev) => prev.filter((m) => m.id !== id));
      if (selectedMenu?.id === id) {
        setSelectedMenu(null);
        setShowPreview(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu');
    }
  };

  const handlePublish = async (menu: Menu) => {
    try {
      const response = await post<Menu>(`/menus/${menu.id}/publish`, {});
      setMenus((prev) =>
        prev.map((m) => (m.id === menu.id ? response.data : m))
      );
      setSelectedMenu(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish menu');
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadMenu = (menu: Menu, format: string) => {
    const token = localStorage.getItem('token');
    const slug = getTenantSlug();
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/menus/${menu.id}/download?format=${format}`;
    fetch(url, { headers: { 'Authorization': `Bearer ${token}`, 'X-Tenant-Slug': slug || '' } })
      .then(res => res.blob())
      .then(blob => {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = downloadUrl; a.download = `menu-${(menu.name || 'menu').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${format === 'jpeg' ? 'jpg' : format}`; a.click();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch(() => setError('Erreur telechargement'));
  };

function getTenantSlug(): string | null {
  if (typeof window === 'undefined') return null;
  try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u?.tenant?.slug ?? null; } catch { return null; }
}

  const handleGenerateImage = async (menu: Menu) => {
    setIsGeneratingImage(true);
    try {
      const response = await post<{ imageUrl: string }>(`/menus/${menu.id}/generate-image`, {});
      setSelectedMenu((prev) => prev ? { ...prev, imageUrl: response.data.imageUrl } : prev);
      setMenus((prev) => prev.map((m) => m.id === menu.id ? { ...m, imageUrl: response.data.imageUrl } : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Generator</h1>
          <p className="text-gray-600">Create beautiful digital menus for your restaurant</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu Details</CardTitle>
              <CardDescription>Enter your menu information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Menu Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Lunch Menu, Dinner Menu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Your restaurant name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="A brief description of your restaurant"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select
                  id="template"
                  value={formData.template}
                  onChange={(e) => handleInputChange('template', e.target.value)}
                >
                  {TEMPLATES.map((template) => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  id="fontFamily"
                  value={formData.fontFamily}
                  onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Colors Card */}
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>Customize your menu colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Primary</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="h-10 w-12"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Secondary</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="h-10 w-12"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accent</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="h-10 w-12"
                    />
                    <Input
                      value={formData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card>
            <CardHeader>
              <CardTitle>Categories & Items</CardTitle>
              <CardDescription>Add your menu items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={category.name}
                      onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
                      placeholder="Category name (e.g., Starters)"
                      className="flex-1"
                    />
                    {categories.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(categoryIndex)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2 pl-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(categoryIndex, itemIndex, 'name', e.target.value)}
                          placeholder="Item name"
                          className="flex-1"
                        />
                        <Input
                          value={item.price}
                          onChange={(e) => updateItem(categoryIndex, itemIndex, 'price', e.target.value)}
                          placeholder="Price"
                          className="w-24"
                        />
                        {category.items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(categoryIndex, itemIndex)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addItem(categoryIndex)}>
                      + Add Item
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addCategory}>
                + Add Category
              </Button>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.businessName}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <SparklesIcon className="h-4 w-4 mr-2 animate-spin" />
                Generating Menu...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generate Menu
              </>
            )}
          </Button>
        </div>

        {/* Preview & Saved Menus Section */}
        <div className="space-y-6">
          {/* Preview */}
          {selectedMenu && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>{selectedMenu.name}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadMenu(selectedMenu, 'html')}>
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Export HTML
                  </Button>
                  {!selectedMenu.imageUrl && (
                    <Button size="sm" variant="outline" onClick={() => handleGenerateImage(selectedMenu)} disabled={isGeneratingImage}>
                      <ImageIcon className="h-4 w-4 mr-1" />
                      {isGeneratingImage ? 'Generating...' : 'AI Image'}
                    </Button>
                  )}
                  {selectedMenu.status === 'DRAFT' && (
                    <Button size="sm" onClick={() => handlePublish(selectedMenu)}>
                      Publish
                    </Button>
                  )}
                </div>
              </CardHeader>
              {showPreview && selectedMenu.html && (
                <CardContent>
                  <iframe
                    srcDoc={selectedMenu.html}
                    className="w-full h-[600px] border rounded"
                    title="Menu Preview"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </CardContent>
              )}
            </Card>
          )}

          {/* Published Links */}
          {selectedMenu?.vercelUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Published Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input value={selectedMenu.vercelUrl} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedMenu.vercelUrl!, 'url')}
                  >
                    {copiedId === 'url' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                  </Button>
                </div>
                {selectedMenu.qrCodeUrl && (
                  <div className="flex items-center space-x-2">
                    <Input value={selectedMenu.qrCodeUrl} readOnly className="flex-1" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedMenu.qrCodeUrl!, 'qr')}
                    >
                      {copiedId === 'qr' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Saved Menus */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Menus</CardTitle>
              <CardDescription>Your generated menus</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : menus.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No menus yet. Create your first menu!
                </div>
              ) : (
                <div className="space-y-3">
                  {menus.map((menu) => (
                    <div
                      key={menu.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMenu?.id === menu.id ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedMenu(menu);
                        setShowPreview(true);
                      }}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{menu.name || menu.businessName}</p>
                        <p className="text-sm text-gray-500">
                          {menu.template} • {menu.status}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMenu(menu);
                            setShowPreview(true);
                          }}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(menu.id);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}