"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { SparklesIcon, PaletteIcon, FontIcon, TextIcon, CheckIcon } from '@/components/icons';
import { useBrandStore } from '@/lib/store/brand-store';

const FONT_OPTIONS = [
  "Inter, sans-serif",
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Montserrat, sans-serif",
  "Lato, sans-serif",
  "Poppins, sans-serif",
  "Playfair Display, serif",
  "Merriweather, serif",
  "Nunito, sans-serif",
  "Raleway, sans-serif",
  "Ubuntu, sans-serif",
  "Oswald, sans-serif",
  "Rubik, sans-serif",
  "Noto Sans, sans-serif",
  "Work Sans, sans-serif",
  "Fira Sans, sans-serif",
  "Quicksand, sans-serif",
  "Barlow, sans-serif",
  "PT Sans, sans-serif",
  "PT Serif, serif",
  "Lora, serif",
  "Libre Baskerville, serif",
  "Crimson Text, serif",
  "EB Garamond, serif",
  "Josefin Sans, sans-serif",
  "DM Sans, sans-serif",
  "Karla, sans-serif",
  "Mulish, sans-serif",
  "Inconsolata, monospace",
  "Source Code Pro, monospace",
  "Space Mono, monospace",
  "Dancing Script, cursive",
  "Pacifico, cursive",
  "Caveat, cursive",
  "Outfit, sans-serif",
  "Manrope, sans-serif",
  "Plus Jakarta Sans, sans-serif",
  "Sora, sans-serif",
  "Public Sans, sans-serif",
  "Cabin, sans-serif",
  "Hind, sans-serif",
  "Heebo, sans-serif",
  "Arimo, sans-serif",
  "Dosis, sans-serif",
  "Overpass, sans-serif",
  "Bitter, serif",
  "Zilla Slab, serif",
  "Arvo, serif",
  "Courier New, monospace"
];

function FontPicker({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedName = (value || 'Inter').split(',')[0].replace(/'/g, '');
  
  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white cursor-pointer flex justify-between items-center shadow-sm"
      >
        <span style={{ fontFamily: value }} className="text-base">{selectedName}</span>
        <span className="text-gray-400 text-xs">▼</span>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-md border bg-white shadow-lg">
          {options.map((font) => {
            const fontName = font.split(',')[0].replace(/'/g, '');
            return (
              <div
                key={font}
                onClick={() => {
                  onChange(font);
                  setIsOpen(false);
                }}
                className="px-3 py-3 text-base cursor-pointer hover:bg-gray-100 hover:text-indigo-600 transition-colors border-b border-gray-50 last:border-0"
                style={{ fontFamily: font }}
              >
                {fontName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BrandingPage() {
  const { brand, updateBrand, generateBranding, loading } = useBrandStore();
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch brand data on mount
  useEffect(() => {
    // The store uses persist middleware, so data is already loaded from localStorage
    // Just fetch latest from API if needed
  }, []);

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);
    try {
      await generateBranding();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate branding');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof typeof brand, value: string) => {
    // Store uses persist middleware, so updates are automatically saved
    updateBrand({ ...brand, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Branding</h1>
          <p className="text-gray-600">Define your brand identity and guidelines</p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} className="flex items-center space-x-2">
          {isGenerating ? (
            <>
              <SparklesIcon className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              Generate Branding
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {brand && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="tone">Tone & Voice</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Overview</CardTitle>
                <CardDescription>Basic brand information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Brand Name</Label>
                  <Input
                    id="name"
                    value={brand.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your Brand Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={brand.tagline || ''}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="Your brand tagline"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={brand.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your brand in a few sentences..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={brand.industry || ''}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    placeholder="e.g., SaaS, E-commerce, Marketing"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={brand.targetAudience || ''}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="Describe your ideal customer..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>Primary, secondary, and accent colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={brand.primaryColor || '#6366f1'}
                          onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                          className="h-10 w-16"
                        />
                        <Input
                          value={brand.primaryColor || '#6366f1'}
                          onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                          placeholder="#6366f1"
                        />
                      </div>
                    </div>
                    <div
                      className="h-10 w-10 rounded-md"
                      style={{ backgroundColor: brand.primaryColor || '#6366f1' }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={brand.secondaryColor || '#8b5cf6'}
                          onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                          className="h-10 w-16"
                        />
                        <Input
                          value={brand.secondaryColor || '#8b5cf6'}
                          onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                    <div
                      className="h-10 w-10 rounded-md"
                      style={{ backgroundColor: brand.secondaryColor || '#8b5cf6' }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="accentColor"
                          type="color"
                          value={brand.accentColor || '#ec4899'}
                          onChange={(e) => handleInputChange('accentColor', e.target.value)}
                          className="h-10 w-16"
                        />
                        <Input
                          value={brand.accentColor || '#ec4899'}
                          onChange={(e) => handleInputChange('accentColor', e.target.value)}
                          placeholder="#ec4899"
                        />
                      </div>
                    </div>
                    <div
                      className="h-10 w-10 rounded-md"
                      style={{ backgroundColor: brand.accentColor || '#ec4899' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>Font family and styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <FontPicker 
                    value={brand.fontFamily || 'Inter, sans-serif'} 
                    onChange={(val) => handleInputChange('fontFamily', val)}
                    options={FONT_OPTIONS}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Font Preview</Label>
                  <div className="border rounded-md p-4">
                    <p className="text-lg font-semibold" style={{ fontFamily: brand.fontFamily || 'Inter, sans-serif' }}>
                      {brand.name || 'Your Brand Name'}
                    </p>
                    <p className="text-sm text-gray-600" style={{ fontFamily: brand.fontFamily || 'Inter, sans-serif' }}>
                      {brand.tagline || 'Your brand tagline'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tone" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tone & Voice</CardTitle>
                <CardDescription>Brand personality and communication style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input
                    id="tone"
                    value={brand.tone || 'professional'}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    placeholder="e.g., professional, friendly, witty"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="values">Core Values</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={brand.values || ''}
                    onChange={(e) => handleInputChange('values', e.target.value)}
                    placeholder="e.g., Innovation, Customer-Centric, Integrity, Excellence"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guidelines">Communication Guidelines</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={brand.guidelines || ''}
                    onChange={(e) => handleInputChange('guidelines', e.target.value)}
                    placeholder="Describe how your brand communicates..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}