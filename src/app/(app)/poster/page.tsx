"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { SparklesIcon, DownloadIcon, ImageIcon, TrashIcon, CopyIcon, CheckIcon } from '@/components/icons';
import { post, get, del } from '@/lib/api';

type PosterBusinessType = 
  | 'RESTAURANT'
  | 'CAFE'
  | 'RETAIL'
  | 'EVENT'
  | 'PROMOTION'
  | 'REAL_ESTATE'
  | 'HEALTH'
  | 'EDUCATION';

type PosterTemplate = 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'BOLD' | 'ELEGANT';

type PosterSize = 'SQUARE' | 'PORTRAIT' | 'LANDSCAPE' | 'STORY';

interface PosterSection {
  title?: string;
  items: string[];
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

const BUSINESS_TYPES: { value: PosterBusinessType; label: string }[] = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'CAFE', label: 'Café' },
  { value: 'RETAIL', label: 'Retail Store' },
  { value: 'EVENT', label: 'Event' },
  { value: 'PROMOTION', label: 'Promotion / Sale' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'HEALTH', label: 'Health & Wellness' },
  { value: 'EDUCATION', label: 'Education' },
];

const TEMPLATES: { value: PosterTemplate; label: string }[] = [
  { value: 'MODERN', label: 'Modern' },
  { value: 'CLASSIC', label: 'Classic' },
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'BOLD', label: 'Bold' },
  { value: 'ELEGANT', label: 'Elegant' },
];

const SIZES: { value: PosterSize; label: string; dimensions: string }[] = [
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
  { value: "Bebas Neue, sans-serif", label: "Bebas Neue" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Lora, serif", label: "Lora" },
  { value: "Dancing Script, cursive", label: "Dancing Script" },
];

export default function PosterPage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
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

  // Sections state
  const [sections, setSections] = useState<PosterSection[]>([
    { title: 'Special Offer', items: ['50% OFF', 'Today Only'] },
  ]);

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      setIsLoading(true);
      const response = await get<Poster[]>('/posters');
      setPosters(response.data);
    } catch (err) {
      console.error('Failed to fetch posters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { title: '', items: [''] },
    ]);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSectionTitle = (index: number, title: string) => {
    setSections((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, title } : sec))
    );
  };

  const addItem = (sectionIndex: number) => {
    setSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? { ...sec, items: [...sec.items, ''] }
          : sec
      )
    );
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    setSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? { ...sec, items: sec.items.filter((_, idx) => idx !== itemIndex) }
          : sec
      )
    );
  };

  const updateItem = (sectionIndex: number, itemIndex: number, value: string) => {
    setSections((prev) =>
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

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      const validSections = sections.filter(
        (sec) => sec.items.some((item) => item.trim())
      );

      const response = await post<Poster>('/posters/generate', {
        name: formData.name,
        businessName: formData.businessName,
        businessType: formData.businessType,
        title: formData.title,
        description: formData.description,
        sections: validSections,
        template: formData.template,
        size: formData.size,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        accentColor: formData.accentColor,
        fontFamily: formData.fontFamily,
      });

      setPosters((prev) => [response.data, ...prev]);
      setSelectedPoster(response.data);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate poster');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poster?')) return;

    try {
      await del(`/posters/${id}`);
      setPosters((prev) => prev.filter((p) => p.id !== id));
      if (selectedPoster?.id === id) {
        setSelectedPoster(null);
        setShowPreview(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete poster');
    }
  };

  const handlePublish = async (poster: Poster) => {
    try {
      const response = await post<Poster>(`/posters/${poster.id}/publish`, {});
      setPosters((prev) =>
        prev.map((p) => (p.id === poster.id ? response.data : p))
      );
      setSelectedPoster(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish poster');
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadAsPng = async (poster: Poster) => {
    if (!poster.content) return;

    const sizeConfig = SIZES.find((s) => s.value === poster.size);
    const width = sizeConfig?.value === 'LANDSCAPE' ? 1200 : 1080;
    const height = sizeConfig?.value === 'PORTRAIT' || sizeConfig?.value === 'STORY' ? (sizeConfig?.value === 'STORY' ? 1920 : 1350) : 1080;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(formData.fontFamily.split(',')[0])}:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: ${formData.fontFamily}; }
            ${poster.content || ''}
          </style>
        </head>
        <body style="width: ${width}px; height: ${height}px;">${poster.content}</body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${poster.name || 'poster'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Poster Generator</h1>
          <p className="text-gray-600">Create stunning promotional posters</p>
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
              <CardTitle>Poster Details</CardTitle>
              <CardDescription>Enter your poster information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Poster Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Summer Sale, Grand Opening"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Your business name"
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
                <Label htmlFor="title">Main Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., 50% OFF, Grand Opening"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Additional details about your promotion"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select
                    id="template"
                    value={formData.template}
                    onChange={(e) => handleInputChange('template', e.target.value)}
                  >
                    {TEMPLATES.map((tmpl) => (
                      <option key={tmpl.value} value={tmpl.value}>
                        {tmpl.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select
                    id="size"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                  >
                    {SIZES.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label} ({size.dimensions})
                      </option>
                    ))}
                  </Select>
                </div>
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
              <CardDescription>Customize your poster colors</CardDescription>
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

          {/* Sections Card */}
          <Card>
            <CardHeader>
              <CardTitle>Content Sections</CardTitle>
              <CardDescription>Add content to your poster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={section.title || ''}
                      onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                      placeholder="Section title (e.g., Offer Details)"
                      className="flex-1"
                    />
                    {sections.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(sectionIndex)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2 pl-4">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <Input
                          value={item}
                          onChange={(e) => updateItem(sectionIndex, itemIndex, e.target.value)}
                          placeholder="Content item"
                          className="flex-1"
                        />
                        {section.items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(sectionIndex, itemIndex)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addItem(sectionIndex)}>
                      + Add Item
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addSection}>
                + Add Section
              </Button>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.businessName || !formData.title}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <SparklesIcon className="h-4 w-4 mr-2 animate-spin" />
                Generating Poster...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generate Poster
              </>
            )}
          </Button>
        </div>

        {/* Preview & Saved Posters Section */}
        <div className="space-y-6">
          {/* Preview */}
          {selectedPoster && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>{selectedPoster.name}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadAsPng(selectedPoster)}>
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Export HTML
                  </Button>
                  {selectedPoster.status === 'DRAFT' && (
                    <Button size="sm" onClick={() => handlePublish(selectedPoster)}>
                      Publish
                    </Button>
                  )}
                </div>
              </CardHeader>
              {showPreview && selectedPoster.content && (
                <CardContent>
                  <div
                    className="border rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: selectedPoster.content }}
                  />
                </CardContent>
              )}
            </Card>
          )}

          {/* Published Links */}
          {selectedPoster?.vercelUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Published Poster</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input value={selectedPoster.vercelUrl} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedPoster.vercelUrl!, 'url')}
                  >
                    {copiedId === 'url' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                  </Button>
                </div>
                {selectedPoster.qrCodeUrl && (
                  <div className="flex items-center space-x-2">
                    <Input value={selectedPoster.qrCodeUrl} readOnly className="flex-1" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedPoster.qrCodeUrl!, 'qr')}
                    >
                      {copiedId === 'qr' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Saved Posters */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Posters</CardTitle>
              <CardDescription>Your generated posters</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : posters.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No posters yet. Create your first poster!
                </div>
              ) : (
                <div className="space-y-3">
                  {posters.map((poster) => (
                    <div
                      key={poster.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPoster?.id === poster.id ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedPoster(poster);
                        setShowPreview(true);
                      }}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{poster.name || poster.title || poster.businessName}</p>
                        <p className="text-sm text-gray-500">
                          {poster.template} • {poster.size} • {poster.status}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPoster(poster);
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
                            handleDelete(poster.id);
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