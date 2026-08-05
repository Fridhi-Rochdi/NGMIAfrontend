"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { ImageIcon, SparklesIcon, DownloadIcon, RefreshIcon, PaletteIcon } from '@/components/icons';
import { useImagesStore } from '@/lib/store/images-store';
import type { ImageBusinessType, ImageTemplate } from '@/types';

const BUSINESS_TYPES: { value: ImageBusinessType; label: string }[] = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'CAFE', label: 'Café' },
  { value: 'BAR', label: 'Bar' },
  { value: 'BAKERY', label: 'Boulangerie' },
  { value: 'PIZZERIA', label: 'Pizzeria' },
  { value: 'SUSHI', label: 'Sushi' },
  { value: 'FAST_FOOD', label: 'Fast-food' },
  { value: 'BURGER', label: 'Burger' },
  { value: 'ICE_CREAM', label: 'Glacier' },
  { value: 'RETAIL', label: 'Commerce' },
  { value: 'HEALTH', label: 'Santé / Bien-être' },
  { value: 'EDUCATION', label: 'Éducation' },
  { value: 'REAL_ESTATE', label: 'Immobilier' },
  { value: 'EVENT', label: 'Événementiel' },
  { value: 'TECH', label: 'Tech' },
  { value: 'OTHER', label: 'Autre' },
];

const TEMPLATES: { value: ImageTemplate; label: string }[] = [
  { value: 'modern', label: 'Moderne épuré' },
  { value: 'classic', label: 'Classique intemporel' },
  { value: 'minimal', label: 'Minimal premium' },
  { value: 'bold', label: 'Audacieux impactant' },
  { value: 'elegant', label: 'Luxe sophistiqué' },
  { value: 'rustic', label: 'Artisanal chaleureux' },
];

const FONT_OPTIONS = [
  'Inter', 'Playfair Display', 'Lora', 'Montserrat', 'Open Sans', 'Roboto', 'Poppins', 'Oswald',
];

export default function ImagesCreatePage() {
  const {
    image,
    updateImage,
    generateImage,
    loading,
    styles,
    sizes,
    aiModels,
    generatedImages,
    clearImage,
  } = useImagesStore();
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const latestImage = generatedImages[0];

  const handleGenerate = async () => {
    if (!image.businessName.trim()) {
      setError('Le nom de l\'entreprise est requis.');
      return;
    }
    setError('');
    setIsGenerating(true);
    try {
      await generateImage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la génération d\'image');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateField = (field: keyof typeof image, value: string) => {
    updateImage({ [field]: value } as Partial<typeof image>);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <header className="flex flex-col gap-5 rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Studio visuel</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Génération d&apos;image</h1>
          <p className="mt-2 text-sm text-white/60">
            L&apos;IA enrichit votre contexte métier en prompt optimisé, comme pour les menus
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} className="inline-flex items-center justify-center rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200">
          {isGenerating ? (
            <><SparklesIcon className="mr-2 h-5 w-5 animate-spin" />Génération...</>
          ) : (
            <><SparklesIcon className="mr-2 h-5 w-5" />Générer l&apos;image</>
          )}
        </Button>
      </header>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Créer une image</TabsTrigger>
          <TabsTrigger value="gallery">Galerie ({generatedImages.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* LEFT COLUMN - Business Context & Visual Settings */}
            <div className="space-y-6">
              {/* Business Info - same as menu */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-cyan-600" />
                    Contexte métier
                  </CardTitle>
                  <CardDescription>Ces infos permettent à l&apos;IA de générer un prompt optimisé</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nom de l&apos;entreprise *</Label>
                    <Input
                      id="businessName"
                      value={image.businessName}
                      onChange={(e) => updateField('businessName', e.target.value)}
                      placeholder="Ex: Le Bistrot Parisien"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Type de business</Label>
                    <select
                      id="businessType"
                      value={image.businessType}
                      onChange={(e) => updateField('businessType', e.target.value)}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                      {BUSINESS_TYPES.map((bt) => (
                        <option key={bt.value} value={bt.value}>{bt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <textarea
                      id="description"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      rows={3}
                      value={image.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Décrivez l'ambiance, le style, l'identité du business..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Visual Settings - same as menu */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PaletteIcon className="h-5 w-5 text-cyan-600" />
                    Style visuel
                  </CardTitle>
                  <CardDescription>Template et couleurs pour guider l&apos;IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template">Template</Label>
                    <select
                      id="template"
                      value={image.template}
                      onChange={(e) => updateField('template', e.target.value)}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                      {TEMPLATES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Principale</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="primaryColor"
                          value={image.primaryColor}
                          onChange={(e) => updateField('primaryColor', e.target.value)}
                          className="h-9 w-9 cursor-pointer rounded border"
                        />
                        <Input
                          value={image.primaryColor}
                          onChange={(e) => updateField('primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondaire</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="secondaryColor"
                          value={image.secondaryColor}
                          onChange={(e) => updateField('secondaryColor', e.target.value)}
                          className="h-9 w-9 cursor-pointer rounded border"
                        />
                        <Input
                          value={image.secondaryColor}
                          onChange={(e) => updateField('secondaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="accentColor"
                          value={image.accentColor}
                          onChange={(e) => updateField('accentColor', e.target.value)}
                          className="h-9 w-9 cursor-pointer rounded border"
                        />
                        <Input
                          value={image.accentColor}
                          onChange={(e) => updateField('accentColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Police</Label>
                    <select
                      id="fontFamily"
                      value={image.fontFamily}
                      onChange={(e) => updateField('fontFamily', e.target.value)}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Image Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-cyan-600" />
                    Paramètres d&apos;image
                  </CardTitle>
                  <CardDescription>Prompt personnalisé (laisser vide = IA auto)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt personnalisé (optionnel)</Label>
                    <textarea
                      id="prompt"
                      className="w-full rounded-md border px-3 py-2 text-sm"
                      rows={3}
                      value={image.prompt}
                      onChange={(e) => updateField('prompt', e.target.value)}
                      placeholder="Laissez vide pour que l'IA génère un prompt optimisé automatiquement..."
                    />
                    <p className="text-xs text-gray-400">
                      Si vide, l&apos;IA utilise le contexte métier pour créer un prompt optimisé.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="style">Style</Label>
                      <select
                        id="style"
                        value={image.style}
                        onChange={(e) => updateField('style', e.target.value)}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                      >
                        {styles.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Format</Label>
                      <select
                        id="size"
                        value={image.size}
                        onChange={(e) => updateField('size', e.target.value)}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                      >
                        {sizes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN - Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu</CardTitle>
                  <CardDescription>Résultat de la génération</CardDescription>
                </CardHeader>
                <CardContent>
                  {latestImage?.url || latestImage?.imageUrl ? (
                    <div className="space-y-4">
                      <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
                        <img
                          src={latestImage.url || latestImage.imageUrl}
                          alt={latestImage.prompt || 'Generated'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {latestImage.businessName && (
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{latestImage.businessName}</p>
                          <p className="text-xs text-gray-500">{latestImage.businessType} · {latestImage.template} · {latestImage.style}</p>
                        </div>
                      )}
                      {latestImage.enhancedPrompt && (
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">Prompt généré par l&apos;IA :</p>
                          <p className="text-xs text-gray-600 line-clamp-4">{latestImage.enhancedPrompt}</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <a
                          href={latestImage.url || latestImage.imageUrl}
                          download
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          <DownloadIcon className="h-4 w-4" />Télécharger
                        </a>
                        <Button variant="outline" size="sm" className="flex-1" onClick={handleGenerate}>
                          <RefreshIcon className="mr-2 h-4 w-4" />Régénérer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">L&apos;image générée apparaîtra ici</p>
                        <p className="text-xs text-gray-400">Remplissez le contexte métier et cliquez sur Générer</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Galerie d&apos;images</CardTitle>
              <CardDescription>{generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''} générée{generatedImages.length !== 1 ? 's' : ''}</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {generatedImages.map((img, index) => (
                    <div key={img.id || index} className="group relative overflow-hidden rounded-lg border bg-gray-100">
                      <div className="aspect-square">
                        <img
                          src={img.url || img.imageUrl}
                          alt={img.prompt || 'Generated'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="w-full">
                          {img.businessName && (
                            <p className="text-xs font-medium text-white">{img.businessName}</p>
                          )}
                          <p className="text-xs text-white/80 line-clamp-2">{img.prompt}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className="text-white border-white/30 text-xs">
                              {img.businessType || img.style}
                            </Badge>
                            {img.template && (
                              <Badge variant="outline" className="text-white border-white/30 text-xs">
                                {img.template}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">Aucune image générée</p>
                  <p className="text-sm text-gray-400">Créez votre première image marketing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
