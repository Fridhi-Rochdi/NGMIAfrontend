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

function getTenantSlug(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.tenant?.slug ?? null;
  } catch {
    return null;
  }
}

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

const BRAND_PROFILES: Record<string, {
  label: string;
  descriptionPlaceholder: string;
  taglinePlaceholder: string;
  values: string;
  audience: string;
  tone: string;
  style: string;
  guidelines: string;
  colors: [string, string, string];
  fontFamily: string;
  tip: string;
}> = {
  restaurant: { label: 'Restaurant', descriptionPlaceholder: 'Cuisine, expérience, niveau de gamme, origine des produits et ambiance…', taglinePlaceholder: 'Une signature qui évoque votre expérience culinaire', values: 'hospitalité, qualité, authenticité, saisonnalité', audience: 'Clients locaux, visiteurs et amateurs de gastronomie', tone: 'chaleureux, sensoriel et élégant', style: 'classic', guidelines: 'Évoquer les sens et le savoir-faire sans utiliser de clichés gastronomiques.', colors: ['#173b2f', '#e8ddc7', '#c58b3a'], fontFamily: 'Playfair Display, serif', tip: 'L’identité doit traduire une expérience culinaire précise, pas seulement afficher des couverts.' },
  cafe: { label: 'Café', descriptionPlaceholder: 'Type de café, spécialités, ambiance, quartier et moments de consommation…', taglinePlaceholder: 'Une phrase courte qui donne envie de faire une pause', values: 'convivialité, artisanat, proximité, créativité', audience: 'Étudiants, actifs, habitants du quartier et passionnés de café', tone: 'chaleureux, accessible et créatif', style: 'modern', guidelines: 'Créer une marque accueillante, contemporaine et facilement reconnaissable sur les gobelets et réseaux sociaux.', colors: ['#3b2a22', '#efe3d2', '#c77b45'], fontFamily: 'DM Sans, sans-serif', tip: 'Pour un café, la marque doit vendre un rituel, une atmosphère et un sentiment d’appartenance.' },
  retail: { label: 'Commerce / Boutique', descriptionPlaceholder: 'Produits, positionnement, expérience en boutique et différence concurrentielle…', taglinePlaceholder: 'Une promesse claire orientée client', values: 'qualité, service, sélection, proximité', audience: 'Acheteurs recherchant une sélection distinctive et un service personnalisé', tone: 'inspirant, clair et commercial', style: 'modern', guidelines: 'Mettre la sélection et le bénéfice client au premier plan.', colors: ['#20242a', '#f4efe8', '#d06c4b'], fontFamily: 'Montserrat, sans-serif', tip: 'L’identité doit rester efficace sur enseigne, packaging, étiquette et boutique en ligne.' },
  technology: { label: 'Technologie / SaaS', descriptionPlaceholder: 'Produit, problème résolu, technologie, marché et avantage concurrentiel…', taglinePlaceholder: 'Une promesse simple qui explique la valeur du produit', values: 'innovation, simplicité, fiabilité, performance', audience: 'Entreprises, équipes numériques et décideurs', tone: 'expert, direct et accessible', style: 'tech', guidelines: 'Expliquer le bénéfice avant la technologie et éviter le jargon inutile.', colors: ['#172554', '#2563eb', '#22d3ee'], fontFamily: 'Sora, sans-serif', tip: 'Une marque tech crédible montre la valeur du produit sans tomber dans le gradient SaaS générique.' },
  health: { label: 'Santé et bien-être', descriptionPlaceholder: 'Spécialité, accompagnement, public, méthode et cadre professionnel…', taglinePlaceholder: 'Une signature rassurante et factuelle', values: 'confiance, écoute, rigueur, bienveillance', audience: 'Patients et personnes recherchant un accompagnement fiable', tone: 'rassurant, professionnel et humain', style: 'modern', guidelines: 'Ne jamais inventer de résultat clinique ou de promesse médicale.', colors: ['#155e75', '#ecfeff', '#5eead4'], fontFamily: 'Nunito, sans-serif', tip: 'La confiance, la lisibilité et l’absence de promesses abusives sont prioritaires.' },
  beauty: { label: 'Beauté / Cosmétique', descriptionPlaceholder: 'Expertise, soins, ingrédients, expérience et positionnement tarifaire…', taglinePlaceholder: 'Une promesse élégante centrée sur l’expérience', values: 'soin, confiance, qualité, élégance', audience: 'Clients attentifs au soin, à l’expertise et à la qualité', tone: 'élégant, positif et sensoriel', style: 'luxurious', guidelines: 'Rester premium sans codes visuels excessivement décoratifs.', colors: ['#4a2638', '#f8ebe9', '#c89b8f'], fontFamily: 'Cormorant Garamond, serif', tip: 'Construisez une identité premium qui reste lisible et crédible sur les produits.' },
  realestate: { label: 'Immobilier', descriptionPlaceholder: 'Zone, types de biens, clientèle, services et positionnement de l’agence…', taglinePlaceholder: 'Une promesse axée confiance, lieu et accompagnement', values: 'confiance, expertise, transparence, accompagnement', audience: 'Acheteurs, vendeurs, investisseurs et propriétaires', tone: 'professionnel, rassurant et précis', style: 'classic', guidelines: 'Éviter le luxe générique ; mettre l’expertise locale et la confiance en avant.', colors: ['#1f2937', '#f5f1e8', '#b58a4a'], fontFamily: 'Libre Baskerville, serif', tip: 'La marque doit fonctionner sur annonces, panneaux, documents et présence digitale.' },
  education: { label: 'Éducation / Formation', descriptionPlaceholder: 'Programmes, pédagogie, public, résultats attendus et environnement…', taglinePlaceholder: 'Une signature tournée vers la progression', values: 'transmission, progression, inclusion, exigence', audience: 'Étudiants, familles, professionnels et entreprises', tone: 'inspirant, clair et crédible', style: 'modern', guidelines: 'Rendre l’apprentissage accessible sans promettre de résultats garantis.', colors: ['#1e3a8a', '#eff6ff', '#f59e0b'], fontFamily: 'Plus Jakarta Sans, sans-serif', tip: 'L’identité doit exprimer progression et confiance auprès des apprenants.' },
  event: { label: 'Événement / Divertissement', descriptionPlaceholder: 'Concept, public, programmation, atmosphère et échelle de l’événement…', taglinePlaceholder: 'Une accroche mémorable et énergique', values: 'émotion, partage, découverte, énergie', audience: 'Participants et communautés intéressés par la programmation', tone: 'énergique, fédérateur et mémorable', style: 'playful', guidelines: 'Créer un système visuel flexible pour affiches, billets et réseaux sociaux.', colors: ['#312e81', '#f5f3ff', '#f43f5e'], fontFamily: 'Outfit, sans-serif', tip: 'Une marque événementielle doit rester forte dans tous les formats et annoncer une expérience.' },
  professional: { label: 'Services professionnels', descriptionPlaceholder: 'Expertise, problèmes résolus, méthode, clientèle et zone d’intervention…', taglinePlaceholder: 'Une promesse précise et crédible', values: 'expertise, intégrité, clarté, efficacité', audience: 'Entreprises et particuliers recherchant cette expertise', tone: 'professionnel, clair et accessible', style: 'classic', guidelines: 'Montrer l’expertise et la méthode sans formules vagues ou prétentions invérifiables.', colors: ['#1e293b', '#f8fafc', '#0f766e'], fontFamily: 'Manrope, sans-serif', tip: 'La crédibilité vient d’une promesse précise, d’un langage clair et d’un système sobre.' },
};

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
  const { brand, updateBrand, generateBranding, savedBrands, fetchBrands, deleteBrand, deleteBrandLogo, modifyBrandLogo, loading } = useBrandStore();
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modifyingId, setModifyingId] = useState<string | null>(null);
  const [modifyPrompt, setModifyPrompt] = useState('');
  const [showPromptFor, setShowPromptFor] = useState<string | null>(null);
  const brandProfile = BRAND_PROFILES[brand.industry] || BRAND_PROFILES.professional;

  // Fetch saved brands on mount
  useEffect(() => {
    fetchBrands().catch(() => {});
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

  const handleDownloadLogo = (brandId: string, brandName: string, format: string) => {
    const token = localStorage.getItem('token');
    const slug = getTenantSlug();
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/branding/${brandId}/logo/download?format=${format}`;
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Tenant-Slug': slug || '',
      },
    })
      .then(res => res.blob())
      .then(blob => {
        const ext = blob.type.includes('svg') ? 'svg'
          : blob.type.includes('png') ? 'png'
            : blob.type.includes('webp') ? 'webp'
              : 'jpg';
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `logo-${brandName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${ext}`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
      })
      .catch(err => setError('Erreur téléchargement: ' + err.message));
  };

  const handleDeleteLogo = async (brandId: string) => {
    setError('');
    try {
      await deleteBrandLogo(brandId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur suppression logo');
    }
  };

  const handleModifyLogo = async (brandId: string, prompt?: string) => {
    setError('');
    setModifyingId(brandId);
    setShowPromptFor(null);
    try {
      await modifyBrandLogo(brandId, prompt ? { logoDescription: prompt } : undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur modification logo');
    } finally {
      setModifyingId(null);
    }
  };

  const handleInputChange = (field: keyof typeof brand, value: string) => {
    // Store uses persist middleware, so updates are automatically saved
    updateBrand({ ...brand, [field]: value });
  };

  const handleIndustryChange = (industry: string) => {
    const profile = BRAND_PROFILES[industry];
    if (!profile) return updateBrand({ industry });
    updateBrand({
      industry,
      values: profile.values,
      targetAudience: profile.audience,
      tone: profile.tone,
      style: profile.style,
      guidelines: profile.guidelines,
      primaryColor: profile.colors[0],
      secondaryColor: profile.colors[1],
      accentColor: profile.colors[2],
      fontFamily: profile.fontFamily,
    });
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
                    placeholder={brandProfile.taglinePlaceholder}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={brand.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={brandProfile.descriptionPlaceholder}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Secteur d'activité</Label>
                  <select
                    id="industry"
                    value={brand.industry || ''}
                    onChange={(e) => handleIndustryChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="">-- Sélectionner --</option>
                    {Object.entries(BRAND_PROFILES).map(([value, profile]) => <option key={value} value={value}>{profile.label}</option>)}
                  </select>
                  <div className="mt-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs leading-5 text-violet-950">{brandProfile.tip}</div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="style">Style de design</Label>
                  <select
                    id="style"
                    value={brand.style || 'modern'}
                    onChange={(e) => handleInputChange('style', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="modern">Moderne — Épuré, géométrique, contemporain</option>
                    <option value="classic">Classique — Élégant, intemporel, traditionnel</option>
                    <option value="playful">Ludique — Coloré, jeune, créatif</option>
                    <option value="luxurious">Luxe — Premium, doré, sophistiqué</option>
                    <option value="tech">Tech — Futuriste, digital, minimaliste</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="values">Valeurs (séparées par des virgules)</Label>
                  <Input
                    id="values"
                    value={brand.values || ''}
                    onChange={(e) => handleInputChange('values', e.target.value)}
                    placeholder={brandProfile.values}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Public cible</Label>
                  <Input
                    id="targetAudience"
                    value={brand.targetAudience || ''}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder={brandProfile.audience}
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
                  <Label htmlFor="tone">Ton de communication</Label>
                  <Input
                    id="tone"
                    value={brand.tone || 'professional'}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    placeholder={brandProfile.tone}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guidelines">Directives de communication</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={brand.guidelines || ''}
                    onChange={(e) => handleInputChange('guidelines', e.target.value)}
                    placeholder={brandProfile.guidelines}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* ======== SAVED BRANDS GALLERY ======== */}
      {savedBrands.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Marques generees ({savedBrands.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedBrands.map((b) => (
              <div
                key={b.id}
                className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Logo + Name */}
                <div
                  className="flex items-center gap-3 mb-3 cursor-pointer"
                  onClick={() => {
                    updateBrand({
                      name: b.name || '',
                      tagline: b.tagline || '',
                      description: b.description || '',
                      industry: b.industry || '',
                      tone: b.tone || '',
                      primaryColor: b.primaryColor || '',
                      secondaryColor: b.secondaryColor || '',
                      accentColor: b.accentColor || '',
                      fontFamily: b.fontFamily || '',
                    });
                  }}
                >
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="w-14 h-14 rounded-xl object-contain bg-gray-50 border" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 text-gray-400 text-xs text-center">
                      Pas de logo
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-base">{b.name}</h3>
                    {b.tagline && <p className="text-xs text-gray-500 italic">{b.tagline}</p>}
                  </div>
                </div>

                {/* Colors */}
                <div className="flex gap-1.5 mb-2">
                  {[b.primaryColor, b.secondaryColor, b.accentColor].filter(Boolean).map((c, i) => (
                    <div key={i} className="flex-1 h-3 rounded-full" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>

                {/* Info */}
                <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                  {b.industry && <p>Industrie : {b.industry}</p>}
                  {b.fontFamily && <p>Police : {b.fontFamily.split(',')[0]}</p>}
                  <p className="text-gray-400">
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString('fr-FR') : ''}
                  </p>
                </div>

                {/* Download format selector + Action Buttons */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
                  {/* Download row with format selector */}
                  {b.logo && (
                    <div className="flex gap-1">
                      <select
                        id={`format-${b.id}`}
                        defaultValue="png"
                        className="text-xs rounded-md border border-gray-200 px-1.5 py-1 bg-white flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="svg">SVG</option>
                      </select>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const sel = document.getElementById(`format-${b.id}`) as HTMLSelectElement;
                          handleDownloadLogo(b.id, b.name, sel?.value || 'png');
                        }}
                        className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium"
                      >
                        Telecharger
                      </button>
                    </div>
                  )}

                  {/* Delete whole brand */}
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteBrand(b.id).catch(() => {}); }}
                      className="flex-1 text-xs px-2 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
                    >
                      Supprimer
                    </button>

                    {/* IA Modify: show prompt input or button */}
                    {showPromptFor === b.id ? (
                      <div className="flex-1 flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          autoFocus
                          className="flex-1 text-xs rounded-md border border-purple-200 px-1.5 py-1"
                          placeholder="Decris le logo souhaite..."
                          value={modifyPrompt}
                          onChange={(e) => setModifyPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleModifyLogo(b.id, modifyPrompt || undefined);
                              setModifyPrompt('');
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            handleModifyLogo(b.id, modifyPrompt || undefined);
                            setModifyPrompt('');
                          }}
                          className="text-xs px-2 py-1 rounded-md bg-purple-500 text-white hover:bg-purple-600 font-medium"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowPromptFor(b.id); setModifyPrompt(''); }}
                        disabled={modifyingId === b.id}
                        className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50 ${
                          b.logo
                            ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {modifyingId === b.id ? 'Generation...' : b.logo ? 'IA Modifier' : 'Generer logo'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedBrands.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Aucune marque générée</p>
          <p className="text-sm mt-1">Remplis le formulaire et clique sur « Generate Branding »</p>
        </div>
      )}
    </div>
  );
}
