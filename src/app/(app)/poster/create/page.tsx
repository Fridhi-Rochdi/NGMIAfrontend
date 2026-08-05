"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { SparklesIcon, DownloadIcon, ImageIcon, TrashIcon, CopyIcon, CheckIcon, QrCodeIcon } from '@/components/icons';
import { post, put, get, del } from '@/lib/api';
import { downloadArtwork, type ArtworkFormat } from '@/lib/artwork-export';

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
  fontSizes?: Record<string, number>;
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
  { value: 'RETAIL', label: 'Commerce / Boutique' },
  { value: 'EVENT', label: 'Événement' },
  { value: 'PROMOTION', label: 'Promotion / Soldes' },
  { value: 'REAL_ESTATE', label: 'Immobilier' },
  { value: 'HEALTH', label: 'Santé et bien-être' },
  { value: 'EDUCATION', label: 'Éducation / Formation' },
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

const POSTER_FORM_CONFIG: Record<PosterBusinessType, {
  entityLabel: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  sectionPlaceholder: string;
  itemPlaceholder: string;
  suggestions: string[];
  hint: string;
}> = {
  RESTAURANT: { entityLabel: 'restaurant', titleLabel: 'Message principal', titlePlaceholder: 'Nouveau menu, soirée dégustation…', descriptionPlaceholder: 'Cuisine, expérience proposée et raison de venir…', sectionPlaceholder: 'Ex. À découvrir', itemPlaceholder: 'Plat signature, date ou information utile', suggestions: ['À découvrir', 'Informations pratiques'], hint: 'Un poster de restaurant doit donner envie puis rendre l’action évidente.' },
  CAFE: { entityLabel: 'café', titleLabel: 'Message principal', titlePlaceholder: 'Nouveau brunch, café du mois…', descriptionPlaceholder: 'Spécialité, ambiance et expérience proposée…', sectionPlaceholder: 'Ex. Nos spécialités', itemPlaceholder: 'Boisson, gourmandise ou horaire utile', suggestions: ['Nos spécialités', 'Rendez-vous'], hint: 'Mettez en avant une boisson, un moment ou une offre précise.' },
  RETAIL: { entityLabel: 'commerce', titleLabel: 'Offre ou nouveauté', titlePlaceholder: 'Nouvelle collection, offre spéciale…', descriptionPlaceholder: 'Produits concernés, bénéfice client et conditions…', sectionPlaceholder: 'Ex. Offre', itemPlaceholder: 'Avantage, produit ou condition', suggestions: ['L’offre', 'Conditions'], hint: 'La promotion, le produit et la période doivent être compris immédiatement.' },
  EVENT: { entityLabel: 'événement', titleLabel: 'Nom de l’événement', titlePlaceholder: 'Festival, conférence, soirée privée…', descriptionPlaceholder: 'Promesse de l’événement, public et programme…', sectionPlaceholder: 'Ex. Programme', itemPlaceholder: 'Date, lieu, intervenant ou temps fort', suggestions: ['Programme', 'Informations pratiques'], hint: 'Date, lieu et appel à l’action sont prioritaires pour un événement.' },
  PROMOTION: { entityLabel: 'campagne', titleLabel: 'Offre principale', titlePlaceholder: '-30 %, lancement, offre limitée…', descriptionPlaceholder: 'Avantage, produits concernés, durée et conditions…', sectionPlaceholder: 'Ex. Avantages', itemPlaceholder: 'Bénéfice ou condition de l’offre', suggestions: ['Avantages', 'Conditions'], hint: 'Une promotion efficace présente une offre unique et des conditions lisibles.' },
  REAL_ESTATE: { entityLabel: 'agence', titleLabel: 'Bien ou opération', titlePlaceholder: 'Appartement à vendre, portes ouvertes…', descriptionPlaceholder: 'Type de bien, localisation, surface et points forts…', sectionPlaceholder: 'Ex. Points forts', itemPlaceholder: 'Surface, pièce, équipement ou contact', suggestions: ['Caractéristiques', 'Visite et contact'], hint: 'Localisation, surface, prix et contact structurent la décision immobilière.' },
  HEALTH: { entityLabel: 'établissement de santé', titleLabel: 'Service ou campagne', titlePlaceholder: 'Consultation, prévention, nouveau service…', descriptionPlaceholder: 'Service, public concerné et modalités, sans promesse médicale…', sectionPlaceholder: 'Ex. Accompagnement', itemPlaceholder: 'Service, modalité ou information pratique', suggestions: ['Services', 'Prendre rendez-vous'], hint: 'Privilégiez clarté, confiance et informations vérifiables.' },
  EDUCATION: { entityLabel: 'établissement éducatif', titleLabel: 'Programme ou annonce', titlePlaceholder: 'Inscriptions ouvertes, nouvelle formation…', descriptionPlaceholder: 'Programme, public, résultats attendus et modalités…', sectionPlaceholder: 'Ex. Programme', itemPlaceholder: 'Module, date, prérequis ou avantage', suggestions: ['Programme', 'Admissions'], hint: 'Le public, le programme et la procédure d’inscription doivent être clairs.' },
};

export default function PosterPage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    fontSizes: { title: 64, subtitle: 28, body: 16, detail: 13 },
  });

  // Sections state
  const [sections, setSections] = useState<PosterSection[]>([
    { title: 'À découvrir', items: [''] },
  ]);
  const businessConfig = POSTER_FORM_CONFIG[formData.businessType];

  useEffect(() => {
    void fetchPosters();
    const id = new URLSearchParams(window.location.search).get('edit');
    if (id) void loadPosterForEditing(id);
  }, []);

  const loadPosterForEditing = async (id: string) => {
    try {
      setIsLoading(true);
      const { data } = await get<Poster>(`/posters/${id}`);
      setEditingId(id);
      setSelectedPoster(data);
      setFormData((current) => ({
        ...current,
        name: data.name || '',
        businessName: data.businessName || '',
        businessType: data.businessType,
        title: data.title || '',
        description: data.description || '',
        template: data.template,
        size: data.size,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        fontFamily: data.fontFamily,
        fontSizes: { ...current.fontSizes, ...(data.fontSizes || {}) },
      }));
      if (data.sections?.length) setSections(data.sections);
      setShowPreview(true);
      setIsCreating(true);
    } catch {
      setError('Impossible de charger ce poster pour modification.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosters = async () => {
    try {
      setIsLoading(true);
      const response = await get<Poster[]>('/posters');
      setPosters(response.data);
      if (response.data.length) {
        setSelectedPoster((current) => current || response.data[0]);
        setShowPreview(true);
      }
    } catch (err) {
      console.error('Failed to fetch posters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBusinessTypeChange = (value: PosterBusinessType) => {
    handleInputChange('businessType', value);
    setSections((current) => {
      const containsRealContent = current.some((section) => section.items.some((item) => item.trim()));
      if (containsRealContent) return current;
      return POSTER_FORM_CONFIG[value].suggestions.map((title) => ({ title, items: [''] }));
    });
  };

  const updateFontSize = (category: string, value: string) => {
    setFormData((current) => ({
      ...current,
      fontSizes: { ...current.fontSizes, [category]: Number(value) },
    }));
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
    if (!formData.businessName.trim() || !formData.title.trim()) {
      setError('Le nom de l’entreprise et le message principal sont obligatoires.');
      return;
    }
    setIsGenerating(true);

    try {
      const validSections = sections.filter(
        (sec) => sec.items.some((item) => item.trim())
      );

      const payload = {
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
        fontSizes: formData.fontSizes,
      };
      const response = editingId
        ? await put<Poster>(`/posters/${editingId}`, payload)
        : await post<Poster>('/posters/generate', payload);

      setPosters((prev) => editingId
        ? prev.map((poster) => poster.id === editingId ? response.data : poster)
        : [response.data, ...prev]);
      setSelectedPoster(response.data);
      setShowPreview(true);
      setIsCreating(false);
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

  const downloadPoster = async (poster: Poster, format: ArtworkFormat) => {
    if (!poster.content) return;
    try {
      await downloadArtwork(poster.content, poster.name || poster.businessName, format);
    } catch {
      setError('Impossible de télécharger le poster. Veuillez réessayer.');
    }
  };

  const handleGenerateQr = async (poster: Poster) => {
    setIsGeneratingQr(true);
    setError('');
    try {
      const response = await post<{ qrCodeUrl: string; url: string }>(`/posters/${poster.id}/generate-qr`, {});
      const updated = { ...poster, qrCodeUrl: response.data.qrCodeUrl, vercelUrl: response.data.url, status: 'PUBLISHED' as const };
      setSelectedPoster(updated);
      setPosters((current) => current.map((item) => item.id === poster.id ? updated : item));
    } catch {
      setError('Impossible de créer le QR code. Veuillez réessayer.');
    } finally {
      setIsGeneratingQr(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-5 rounded-[30px] bg-gray-950 px-7 py-8 text-white shadow-xl sm:flex-row sm:items-end sm:justify-between sm:px-10">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">Studio Poster</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">Vos posters</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">Consultez vos créations, téléchargez-les ou démarrez une nouvelle direction artistique.</p>
        </div>
        <Button className="rounded-xl bg-amber-400 text-gray-950 hover:bg-amber-300" onClick={() => setIsCreating((current) => !current)}>
          {isCreating ? 'Fermer le studio' : '+ Créer un nouveau poster'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={isCreating ? 'grid grid-cols-1 gap-6 lg:grid-cols-2' : 'grid grid-cols-1 gap-6'}>
        {/* Form Section */}
        {isCreating && <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brief pour votre {businessConfig.entityLabel}</CardTitle>
              <CardDescription>Les informations demandées s’adaptent au secteur sélectionné.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom interne du poster</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex. Campagne été 2026"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Nom de votre {businessConfig.entityLabel}</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Nom affiché sur le poster"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Secteur d’activité</Label>
                <Select
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleBusinessTypeChange(e.target.value as PosterBusinessType)}
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">{businessConfig.hint}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">{businessConfig.titleLabel}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={businessConfig.titlePlaceholder}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Contexte et message</Label>
                <textarea
                  id="description"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={businessConfig.descriptionPlaceholder}
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

              <div className="space-y-3">
                <div>
                  <Label>Tailles par catégorie</Label>
                  <p className="mt-1 text-xs text-gray-500">Contrôlez chaque niveau typographique du poster.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {([
                    ['title', 'Titre principal', 28, 140],
                    ['subtitle', 'Sous-titres', 16, 72],
                    ['body', 'Texte principal', 11, 36],
                    ['detail', 'Détails et légendes', 9, 24],
                  ] as const).map(([key, label, min, max]) => (
                    <div key={key} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold shadow-sm">{formData.fontSizes[key]} px</span>
                      </div>
                      <input className="w-full accent-amber-500" type="range" min={min} max={max} value={formData.fontSizes[key]} onChange={(event) => updateFontSize(key, event.target.value)} />
                    </div>
                  ))}
                </div>
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
              <CardTitle>Contenu adapté au secteur</CardTitle>
              <CardDescription>Ajoutez uniquement les informations réellement utiles à votre audience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={section.title || ''}
                      onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                      placeholder={businessConfig.sectionPlaceholder}
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
                          placeholder={businessConfig.itemPlaceholder}
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
                      + Ajouter une information
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addSection}>
                + Ajouter une section
              </Button>
            </CardContent>
          </Card>

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
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
                {editingId ? 'Enregistrer les modifications' : 'Générer le poster'}
              </>
            )}
          </Button>
        </div>}

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
                  {(['html', 'png', 'jpg'] as ArtworkFormat[]).map((format) => (
                    <Button key={format} variant="outline" size="sm" onClick={() => downloadPoster(selectedPoster, format)}>
                      <DownloadIcon className="mr-1 h-4 w-4" />
                      {format.toUpperCase()}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => handleGenerateQr(selectedPoster)} disabled={isGeneratingQr}>
                    <QrCodeIcon className="mr-1 h-4 w-4" />
                    {isGeneratingQr ? 'Création…' : 'Créer le QR'}
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
                  <iframe
                    title={`Preview of ${selectedPoster.name}`}
                    className="h-[720px] w-full rounded-lg border"
                    sandbox=""
                    referrerPolicy="no-referrer"
                    srcDoc={selectedPoster.content}
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
                  <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-4 sm:flex-row sm:items-center">
                    <img src={selectedPoster.qrCodeUrl} alt="QR code du poster" className="h-32 w-32 rounded-xl bg-white p-2 shadow-sm" />
                    <div>
                      <p className="font-semibold text-gray-900">QR code prêt</p>
                      <p className="mt-1 text-sm text-gray-500">Il ouvre directement le poster publié.</p>
                      <a href={selectedPoster.qrCodeUrl} download={`qr-${selectedPoster.slug || selectedPoster.id}.png`} className="mt-3 inline-flex items-center rounded-lg bg-gray-950 px-3 py-2 text-sm font-semibold text-white">
                        <DownloadIcon className="mr-2 h-4 w-4" />Télécharger le QR
                      </a>
                    </div>
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
