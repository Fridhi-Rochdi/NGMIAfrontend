"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';
import { SparklesIcon, DownloadIcon, ImageIcon, TrashIcon, CopyIcon, CheckIcon, QrCodeIcon } from '@/components/icons';
// Note: Select is a native HTML select wrapper - use <option> children, onChange, and value props
import { post, put, get, del } from '@/lib/api';
import { downloadArtwork, type ArtworkFormat } from '@/lib/artwork-export';

type MenuBusinessType = 
  | 'RESTAURANT'
  | 'CAFE'
  | 'BAR'
  | 'BAKERY'
  | 'PIZZERIA'
  | 'SUSHI'
  | 'FAST_FOOD'
  | 'ICE_CREAM'
  | 'FOOD_TRUCK'
  | 'OTHER';

type MenuTemplate = 'ai-free' | 'modern' | 'classic' | 'minimal' | 'elegant' | 'rustic';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  imageUrl?: string;
}

interface MenuCategory {
  name: string;
  description?: string;
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
  fontSizes?: Record<string, number>;
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
  { value: 'BAKERY', label: 'Boulangerie / Pâtisserie' },
  { value: 'PIZZERIA', label: 'Pizzeria' },
  { value: 'SUSHI', label: 'Restaurant japonais / Sushi' },
  { value: 'FAST_FOOD', label: 'Street food' },
  { value: 'ICE_CREAM', label: 'Glacier' },
  { value: 'FOOD_TRUCK', label: 'Food truck' },
  { value: 'OTHER', label: 'Autre concept' },
];

const TEMPLATES: { value: MenuTemplate; label: string }[] = [
  { value: 'ai-free', label: 'Direction artistique libre — recommandé' },
  { value: 'modern', label: 'Éditorial moderne' },
  { value: 'classic', label: 'Maison classique' },
  { value: 'minimal', label: 'Minimal premium' },
  { value: 'elegant', label: 'Luxe sombre' },
  { value: 'rustic', label: 'Artisanal chaleureux' },
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

const MENU_FORM_CONFIG: Record<MenuBusinessType, {
  entityLabel: string;
  itemLabel: string;
  conceptPlaceholder: string;
  categoryPlaceholder: string;
  itemPlaceholder: string;
  detailPlaceholder: string;
  pricePlaceholder: string;
  suggestions: string[];
  hint: string;
}> = {
  RESTAURANT: { entityLabel: 'restaurant', itemLabel: 'plat', conceptPlaceholder: 'Cuisine, saisonnalité, niveau de gamme, ambiance et clientèle visée…', categoryPlaceholder: 'Ex. Entrées', itemPlaceholder: 'Nom du plat', detailPlaceholder: 'Ingrédients, cuisson et accompagnement…', pricePlaceholder: '18 €', suggestions: ['Entrées', 'Plats', 'Desserts'], hint: 'Structure conseillée : parcours entrée, plat et dessert.' },
  CAFE: { entityLabel: 'café', itemLabel: 'produit', conceptPlaceholder: 'Style du café, spécialités, méthode de torréfaction et ambiance…', categoryPlaceholder: 'Ex. Cafés de spécialité', itemPlaceholder: 'Nom de la boisson ou gourmandise', detailPlaceholder: 'Origine, arômes, lait ou composition…', pricePlaceholder: '4,50 €', suggestions: ['Cafés', 'Boissons fraîches', 'Pâtisseries'], hint: 'Mettez en avant les formats, origines et options de lait.' },
  BAR: { entityLabel: 'bar', itemLabel: 'boisson', conceptPlaceholder: 'Univers du bar, signature du mixologue, musique et clientèle…', categoryPlaceholder: 'Ex. Cocktails signature', itemPlaceholder: 'Nom du cocktail ou de la boisson', detailPlaceholder: 'Spiritueux, ingrédients et profil aromatique…', pricePlaceholder: '12 €', suggestions: ['Signatures', 'Classiques', 'Sans alcool', 'À partager'], hint: 'Les ingrédients et la présence d’alcool facilitent le choix.' },
  BAKERY: { entityLabel: 'boulangerie', itemLabel: 'produit', conceptPlaceholder: 'Savoir-faire, farines, fermentation, production artisanale…', categoryPlaceholder: 'Ex. Pains au levain', itemPlaceholder: 'Nom du produit', detailPlaceholder: 'Farine, garniture, poids ou allergènes utiles…', pricePlaceholder: '3,20 €', suggestions: ['Pains', 'Viennoiseries', 'Pâtisseries', 'Salé'], hint: 'Indiquez les poids, formats ou pièces lorsque cela compte.' },
  PIZZERIA: { entityLabel: 'pizzeria', itemLabel: 'pizza', conceptPlaceholder: 'Style de pâte, cuisson, inspirations régionales et ingrédients…', categoryPlaceholder: 'Ex. Pizze rosse', itemPlaceholder: 'Nom de la pizza', detailPlaceholder: 'Base, fromages, garnitures et taille…', pricePlaceholder: '14 €', suggestions: ['Pizze rosse', 'Pizze bianche', 'Antipasti', 'Dolci'], hint: 'Précisez la base tomate ou blanche et les tailles disponibles.' },
  SUSHI: { entityLabel: 'restaurant japonais', itemLabel: 'création', conceptPlaceholder: 'Tradition, fusion, provenance des poissons et expérience omakase…', categoryPlaceholder: 'Ex. Nigiri', itemPlaceholder: 'Nom de la pièce ou de l’assortiment', detailPlaceholder: 'Poisson, garniture et nombre de pièces…', pricePlaceholder: '9 €', suggestions: ['Nigiri', 'Maki', 'Sashimi', 'Menus'], hint: 'Le nombre de pièces et la composition doivent être immédiatement lisibles.' },
  FAST_FOOD: { entityLabel: 'fast-food', itemLabel: 'produit', conceptPlaceholder: 'Spécialité, portions, service, public et positionnement…', categoryPlaceholder: 'Ex. Burgers', itemPlaceholder: 'Nom du produit ou de la formule', detailPlaceholder: 'Composition, accompagnement et options…', pricePlaceholder: '10,90 €', suggestions: ['Formules', 'Burgers', 'Accompagnements', 'Boissons'], hint: 'Présentez clairement produits seuls, suppléments et formules.' },
  ICE_CREAM: { entityLabel: 'glacier', itemLabel: 'parfum', conceptPlaceholder: 'Fabrication, ingrédients, saison, parfums signatures…', categoryPlaceholder: 'Ex. Glaces artisanales', itemPlaceholder: 'Parfum ou création glacée', detailPlaceholder: 'Saveurs, toppings, format ou nombre de boules…', pricePlaceholder: '5 €', suggestions: ['Crèmes glacées', 'Sorbets', 'Coupes', 'Toppings'], hint: 'Séparez parfums, formats et suppléments pour une lecture rapide.' },
  FOOD_TRUCK: { entityLabel: 'food truck', itemLabel: 'spécialité', conceptPlaceholder: 'Cuisine proposée, mobilité, service rapide et identité de rue…', categoryPlaceholder: 'Ex. Nos signatures', itemPlaceholder: 'Nom de la spécialité', detailPlaceholder: 'Composition, sauce et accompagnement…', pricePlaceholder: '11 €', suggestions: ['Signatures', 'Formules', 'Sides', 'Boissons'], hint: 'Une carte courte et très lisible fonctionne mieux en situation mobile.' },
  OTHER: { entityLabel: 'établissement', itemLabel: 'article', conceptPlaceholder: 'Décrivez précisément votre activité, votre offre et votre clientèle…', categoryPlaceholder: 'Nom de la catégorie', itemPlaceholder: 'Nom de l’article', detailPlaceholder: 'Description utile au client…', pricePlaceholder: 'Prix', suggestions: ['Offre principale', 'Sélection', 'Options'], hint: 'Utilisez des catégories qui correspondent au parcours réel de vos clients.' },
};

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
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
    businessType: 'RESTAURANT' as MenuBusinessType,
    description: '',
    template: 'ai-free' as MenuTemplate,
    primaryColor: '#17231b',
    secondaryColor: '#314c3a',
    accentColor: '#d8a94b',
    fontFamily: 'Playfair Display, serif',
    pageCount: 'auto',
    fontSizes: { title: 64, category: 30, item: 18, description: 14, price: 18 },
  });

  // Categories state
  const [categories, setCategories] = useState<MenuCategory[]>(
    MENU_FORM_CONFIG.RESTAURANT.suggestions.map((name, index) => ({
      name,
      items: [{ id: `initial-restaurant-${index}`, name: '', price: '' }],
    })),
  );
  const businessConfig = MENU_FORM_CONFIG[formData.businessType];

  useEffect(() => {
    void fetchMenus();
    const id = new URLSearchParams(window.location.search).get('edit');
    if (id) void loadMenuForEditing(id);
  }, []);

  const loadMenuForEditing = async (id: string) => {
    try {
      setIsLoading(true);
      const { data } = await get<Menu>(`/menus/${id}`);
      setEditingId(id);
      setSelectedMenu(data);
      setFormData((current) => ({
        ...current,
        name: data.name || '',
        businessName: data.businessName || '',
        businessType: data.businessType,
        description: data.description || '',
        template: data.template,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        fontFamily: data.fontFamily,
        fontSizes: { ...current.fontSizes, ...(data.fontSizes || {}) },
      }));
      if (data.categories?.length) {
        setCategories(data.categories.map((category, categoryIndex) => ({
          ...category,
          items: category.items.map((item, itemIndex) => ({
            ...item,
            id: item.id || `${categoryIndex}-${itemIndex}-${Date.now()}`,
          })),
        })));
      }
      setShowPreview(true);
      setIsCreating(true);
    } catch {
      setError('Impossible de charger ce menu pour modification.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const response = await get<Menu[]>('/menus');
      setMenus(response.data);
      if (response.data.length) {
        setSelectedMenu((current) => current || response.data[0]);
        setShowPreview(true);
      }
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

  const handleBusinessTypeChange = (value: MenuBusinessType) => {
    handleInputChange('businessType', value);
    setCategories((current) => {
      const containsRealContent = current.some((category) =>
        category.items.some((item) => item.name.trim() || item.price.trim()),
      );
      if (containsRealContent) return current;
      return MENU_FORM_CONFIG[value].suggestions.map((name, index) => ({
        name,
        items: [{ id: `suggested-${value}-${index}`, name: '', price: '' }],
      }));
    });
  };

  const updateFontSize = (category: string, value: string) => {
    setFormData((current) => ({
      ...current,
      fontSizes: { ...current.fontSizes, [category]: Number(value) },
    }));
  };

  const updateCategoryDescription = (index: number, description: string) => {
    setCategories((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, description } : cat))
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

  const updateItem = (categoryIndex: number, itemIndex: number, field: 'name' | 'price' | 'description', value: string) => {
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

      const payload = {
        name: formData.name,
        businessName: formData.businessName,
        businessType: formData.businessType,
        description: formData.description,
        categories: validCategories.map((category) => ({
          name: category.name,
          description: category.description,
          items: category.items
            .filter((item) => item.name && item.price)
            .map(({ name, price, description, imageUrl }) => ({ name, price, description, imageUrl })),
        })),
        template: formData.template,
        colors: {
          primary: formData.primaryColor,
          secondary: formData.secondaryColor,
          accent: formData.accentColor,
        },
        fontFamily: formData.fontFamily,
        fontSizes: formData.fontSizes,
        ...(!editingId && formData.pageCount !== 'auto' ? { pageCount: Number(formData.pageCount) } : {}),
      };
      const response = editingId
        ? await put<Menu>(`/menus/${editingId}`, payload)
        : await post<Menu>('/menus/generate', payload);

      setMenus((prev) => editingId
        ? prev.map((menu) => menu.id === editingId ? response.data : menu)
        : [response.data, ...prev]);
      setSelectedMenu(response.data);
      setShowPreview(true);
      setIsCreating(false);
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

  const downloadMenu = async (menu: Menu, format: ArtworkFormat = 'html') => {
    try {
      if (!menu.html) throw new Error('Menu HTML unavailable');
      await downloadArtwork(menu.html, menu.name || menu.businessName, format);
    } catch {
      setError('Impossible de télécharger le menu. Veuillez réessayer.');
    }
  };

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

  const handleGenerateQr = async (menu: Menu) => {
    setIsGeneratingQr(true);
    setError('');
    try {
      const response = await post<{ qrCodeUrl: string; url: string }>(`/menus/${menu.id}/generate-qr`, {});
      const updated = { ...menu, qrCodeUrl: response.data.qrCodeUrl, vercelUrl: response.data.url, status: 'PUBLISHED' as const };
      setSelectedMenu(updated);
      setMenus((current) => current.map((item) => item.id === menu.id ? updated : item));
    } catch {
      setError('Impossible de créer le QR code. Veuillez réessayer.');
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const completedItems = categories.reduce(
    (total, category) => total + category.items.filter((item) => item.name && item.price).length,
    0,
  );
  const estimatedPageCount = Math.max(1, Math.ceil(completedItems / 14));
  const briefSignals = [
    formData.businessName.length >= 3,
    formData.description.length >= 40,
    categories.some((category) => category.name.trim().length > 0),
    completedItems >= 3,
  ];
  const briefScore = Math.round((briefSignals.filter(Boolean).length / briefSignals.length) * 100);

  return (
    <div className="space-y-8 pb-12">
      <section className="relative overflow-hidden rounded-[32px] bg-[#101713] px-6 py-8 text-white shadow-2xl shadow-emerald-950/10 sm:px-10 sm:py-10">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-6 -top-16 h-48 w-48 rounded-full bg-[#d8a94b]/10 blur-2xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#d8a94b]">Studio Menu — GLM‑5.2 + FLUX.2</p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Concevez une carte qui donne envie avant la première bouchée.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">Décrivez votre univers culinaire. L’IA construit une direction artistique originale, génère le visuel et compose un menu responsive prêt à publier.</p>
          </div>
          <div className="min-w-48 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
            <div className="flex items-end justify-between gap-6">
              <span className="text-xs uppercase tracking-[0.18em] text-white/50">Qualité du brief</span>
              <strong className="text-2xl text-[#d8a94b]">{briefScore}%</strong>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#d8a94b] transition-all duration-500" style={{ width: `${briefScore}%` }} />
            </div>
            <p className="mt-3 text-xs leading-5 text-white/45">Un concept précis et au moins trois plats améliorent fortement la direction artistique.</p>
            <Button
              className="mt-4 w-full rounded-xl bg-[#d8a94b] text-[#101713] hover:bg-[#e5bb66]"
              onClick={() => setIsCreating((current) => !current)}
            >
              {isCreating ? 'Fermer le studio' : '+ Créer un nouveau menu'}
            </Button>
          </div>
        </div>
      </section>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={isCreating ? 'grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,0.88fr)_minmax(540px,1.12fr)]' : 'grid grid-cols-1 gap-8'}>
        {/* Form Section */}
        {isCreating && <div className="space-y-6">
          <Card className="overflow-hidden rounded-3xl border-gray-200/80 shadow-lg shadow-gray-950/[0.03]">
            <CardHeader>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">01 — Le brief</p>
              <CardTitle className="text-2xl tracking-tight">Identité de votre {businessConfig.entityLabel}</CardTitle>
              <CardDescription className="mt-1">Donnez au directeur artistique suffisamment de matière pour créer un univers unique.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la carte</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Carte du soir, Menu déjeuner…"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Nom de votre {businessConfig.entityLabel}</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Maison Olive"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Type d’établissement</Label>
                <Select
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleBusinessTypeChange(e.target.value as MenuBusinessType)}
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="description">Concept et ambiance</Label>
                  <span className="text-xs text-gray-400">{formData.description.length}/1000</span>
                </div>
                <textarea
                  id="description"
                  className="min-h-28 w-full resize-y rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={businessConfig.conceptPlaceholder}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Direction artistique</Label>
                  <p className="mt-1 text-xs leading-5 text-gray-500">Ce choix guide l’IA sans imposer une mise en page prédéfinie.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.value}
                      type="button"
                      onClick={() => handleInputChange('template', template.value)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                        formData.template === template.value
                          ? 'border-emerald-800 bg-emerald-950 text-white shadow-md shadow-emerald-950/10'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Signature typographique</Label>
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
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-900">{businessConfig.hint}</div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Tailles par catégorie</Label>
                  <p className="mt-1 text-xs text-gray-500">Réglez séparément chaque niveau de lecture du menu.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {([
                    ['title', 'Nom du restaurant', 28, 120],
                    ['category', 'Titres des catégories', 18, 64],
                    ['item', 'Noms des plats', 12, 32],
                    ['description', 'Descriptions', 10, 24],
                    ['price', 'Prix', 12, 32],
                  ] as const).map(([key, label, min, max]) => (
                    <div key={key} className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm">{formData.fontSizes[key]} px</span>
                      </div>
                      <input className="w-full accent-emerald-800" type="range" min={min} max={max} value={formData.fontSizes[key]} onChange={(event) => updateFontSize(key, event.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pageCount">Nombre de pages</Label>
                <Select
                  id="pageCount"
                  value={formData.pageCount}
                  onChange={(e) => handleInputChange('pageCount', e.target.value)}
                >
                  <option value="auto">Automatique — environ {estimatedPageCount} page{estimatedPageCount > 1 ? 's' : ''}</option>
                  <option value="1">1 page</option>
                  <option value="2">2 pages</option>
                  <option value="3">3 pages</option>
                  <option value="4">4 pages</option>
                  <option value="5">5 pages</option>
                  <option value="6">6 pages</option>
                </Select>
                <p className="text-xs leading-5 text-gray-500">Le mode automatique ajoute des pages selon le nombre de plats. Si le contenu est trop dense, le studio privilégie toujours la lisibilité.</p>
              </div>
            </CardContent>
          </Card>

          {/* Colors Card */}
          <Card className="overflow-hidden rounded-3xl border-gray-200/80 shadow-lg shadow-gray-950/[0.03]">
            <CardHeader>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">02 — L’univers visuel</p>
                  <CardTitle className="text-2xl tracking-tight">Palette de marque</CardTitle>
                  <CardDescription className="mt-1">Trois couleurs suffisent pour construire une identité mémorable.</CardDescription>
                </div>
                <div className="flex overflow-hidden rounded-full border-4 border-white shadow-md">
                  {[formData.primaryColor, formData.secondaryColor, formData.accentColor].map((color) => (
                    <span key={color} className="h-10 w-10" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Principale</Label>
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
                  <Label>Secondaire</Label>
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
          <Card className="overflow-hidden rounded-3xl border-gray-200/80 shadow-lg shadow-gray-950/[0.03]">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">03 — La carte</p>
                  <CardTitle className="text-2xl tracking-tight">Catégories et {businessConfig.itemLabel}s</CardTitle>
                  <CardDescription className="mt-1">Le vocabulaire et les suggestions sont adaptés à votre activité. L’IA conserve une direction créative libre.</CardDescription>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">{completedItems} {businessConfig.itemLabel}{completedItems > 1 ? 's' : ''}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={category.name}
                      onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
                      placeholder={businessConfig.categoryPlaceholder}
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
                  <Input
                    value={category.description || ''}
                    onChange={(e) => updateCategoryDescription(categoryIndex, e.target.value)}
                    placeholder="Courte introduction de la catégorie (optionnel)"
                  />

                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={item.id} className="grid grid-cols-[1fr_100px_auto] gap-2 rounded-xl bg-white p-3 shadow-sm">
                        <div className="space-y-2">
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(categoryIndex, itemIndex, 'name', e.target.value)}
                            placeholder={businessConfig.itemPlaceholder}
                          />
                          <Input
                            value={item.description || ''}
                            onChange={(e) => updateItem(categoryIndex, itemIndex, 'description', e.target.value)}
                            placeholder={businessConfig.detailPlaceholder}
                          />
                        </div>
                        <Input
                          value={item.price}
                          onChange={(e) => updateItem(categoryIndex, itemIndex, 'price', e.target.value)}
                          placeholder={businessConfig.pricePlaceholder}
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
                    <Button variant="outline" size="sm" onClick={() => addItem(categoryIndex)} className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100">
                      + Ajouter un {businessConfig.itemLabel}
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addCategory} className="w-full rounded-xl border-dashed border-gray-300 py-3 text-gray-700 hover:bg-gray-50">
                + Ajouter une catégorie
              </Button>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !formData.businessName}
            className="w-full rounded-2xl bg-[#101713] py-4 text-base text-white shadow-xl shadow-emerald-950/15 hover:bg-[#1b2a21]"
            size="lg"
          >
            {isGenerating ? (
              <>
                <SparklesIcon className="h-4 w-4 mr-2 animate-spin" />
                Création artistique en cours…
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2" />
                {editingId ? 'Enregistrer les modifications' : 'Générer le menu premium'}
              </>
            )}
          </Button>
        </div>}

        {/* Preview & Saved Menus Section */}
        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          {/* Preview */}
          {!selectedMenu && (
            <div className="grid min-h-[560px] place-items-center overflow-hidden rounded-[32px] border border-gray-200 bg-[#f4f0e7] p-8 text-center shadow-xl shadow-gray-950/[0.04]">
              <div className="max-w-sm">
                <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border border-emerald-950/10 bg-white shadow-lg">
                  <SparklesIcon className="h-8 w-8 text-emerald-900" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">Votre prochaine carte</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-gray-950">Un aperçu digne d’un studio apparaîtra ici.</h2>
                <p className="mt-4 text-sm leading-7 text-gray-600">Renseignez votre concept puis lancez la génération. La photographie, la composition et la typographie seront conçues ensemble.</p>
              </div>
            </div>
          )}
          {selectedMenu && (
            <Card className="overflow-hidden rounded-[32px] border-gray-200 shadow-xl shadow-gray-950/[0.05]">
              <CardHeader className="flex flex-col gap-4 border-gray-100 bg-white sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Aperçu interactif</p>
                  <CardTitle className="text-xl">{selectedMenu.name}</CardTitle>
                  <CardDescription>{selectedMenu.businessName} · {selectedMenu.status}</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Masquer' : 'Afficher'}
                  </Button>
                  {(['html', 'png', 'jpg'] as ArtworkFormat[]).map((format) => (
                    <Button
                      key={format}
                      variant="outline"
                      size="sm"
                      className={format === 'png' ? 'border-emerald-800 bg-emerald-950 text-white hover:bg-emerald-900' : ''}
                      onClick={() => downloadMenu(selectedMenu, format)}
                    >
                      <DownloadIcon className="mr-1 h-4 w-4" />
                      {format.toUpperCase()}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateQr(selectedMenu)}
                    disabled={isGeneratingQr}
                  >
                    <QrCodeIcon className="mr-1 h-4 w-4" />
                    {isGeneratingQr ? 'Création…' : 'Créer le QR'}
                  </Button>
                  {!selectedMenu.imageUrl && (
                    <Button size="sm" variant="outline" onClick={() => handleGenerateImage(selectedMenu)} disabled={isGeneratingImage}>
                      <ImageIcon className="h-4 w-4 mr-1" />
                      {isGeneratingImage ? 'Création…' : 'Nouveau visuel'}
                    </Button>
                  )}
                  {selectedMenu.status === 'DRAFT' && (
                    <Button size="sm" onClick={() => handlePublish(selectedMenu)}>
                      Publier
                    </Button>
                  )}
                </div>
              </CardHeader>
              {showPreview && selectedMenu.html && (
                <CardContent className="bg-gray-100 p-3 sm:p-5">
                  <iframe
                    srcDoc={selectedMenu.html}
                    className="h-[680px] w-full rounded-2xl border border-gray-200 bg-white shadow-inner"
                    title="Menu Preview"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </CardContent>
              )}
            </Card>
          )}

          {/* Published Links */}
          {selectedMenu?.vercelUrl && (
            <Card className="overflow-hidden rounded-3xl border-emerald-900/10 bg-emerald-950 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Menu publié</CardTitle>
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
                  <div className="flex flex-col gap-4 rounded-2xl bg-white/10 p-4 sm:flex-row sm:items-center">
                    <img src={selectedMenu.qrCodeUrl} alt="QR code du menu" className="h-32 w-32 rounded-xl bg-white p-2" />
                    <div>
                      <p className="font-semibold">QR code prêt</p>
                      <p className="mt-1 text-sm text-white/60">Il ouvre directement le menu publié.</p>
                      <a href={selectedMenu.qrCodeUrl} download={`qr-${selectedMenu.slug || selectedMenu.id}.png`} className="mt-3 inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-950">
                        <DownloadIcon className="mr-2 h-4 w-4" />Télécharger le QR
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Saved Menus */}
          <Card className="overflow-hidden rounded-3xl border-gray-200/80 shadow-lg shadow-gray-950/[0.03]">
            <CardHeader>
              <CardTitle>Vos créations</CardTitle>
              <CardDescription>Retrouvez, publiez ou exportez vos menus générés.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">Chargement…</div>
              ) : menus.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun menu pour le moment. Créez votre première carte.
                </div>
              ) : (
                <div className="space-y-3">
                  {menus.map((menu) => (
                    <div
                      key={menu.id}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                        selectedMenu?.id === menu.id ? 'border-emerald-800 bg-emerald-50 shadow-sm' : 'border-gray-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
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
                          title="Télécharger le menu"
                          aria-label={`Télécharger ${menu.name || menu.businessName}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            downloadMenu(menu);
                          }}
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
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
