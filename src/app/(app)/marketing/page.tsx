"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { SparklesIcon, DownloadIcon, ImageIcon, TrashIcon, CopyIcon, CheckIcon, MenuIcon, QrCodeIcon, UploadIcon } from '@/components/icons';
import { post, get, del, upload } from '@/lib/api';

// ==================== TYPES ====================

type BusinessType = 'RESTAURANT' | 'CAFE' | 'BAR' | 'BAKERY' | 'PIZZERIA' | 'SUSHI' | 'BURGER' | 'SALAD' | 'SEAFOOD' | 'STEAKHOUSE';

type MenuTemplate = 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'ELEGANT' | 'RUSTIC';
type PosterTemplate = 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'BOLD' | 'ELEGANT';
type PosterSize = 'A4' | 'A3' | 'SOCIAL_MEDIA' | 'STORY';
type PosterBusinessType = 'RESTAURANT' | 'CAFE' | 'RETAIL' | 'HEALTH' | 'EDUCATION' | 'EVENT' | 'OTHER';

interface MenuItem { id: string; name: string; price: string; description?: string; imageUrl?: string; }
interface MenuCategory { name: string; items: MenuItem[]; }

interface Menu {
  id: string; name: string; businessName: string; businessType: BusinessType;
  description?: string; categories: MenuCategory[]; template: MenuTemplate;
  primaryColor: string; secondaryColor: string; accentColor: string; fontFamily: string;
  html?: string; imageUrl?: string; thumbnailUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; slug?: string; publishedAt?: string;
  vercelUrl?: string; qrCodeUrl?: string; createdAt?: string; updatedAt?: string;
}

interface Poster {
  id: string; name: string; businessName: string; businessType: PosterBusinessType;
  title: string; description?: string; template: PosterTemplate; size: PosterSize;
  primaryColor: string; secondaryColor: string; accentColor: string; fontFamily: string;
  content?: string; slug?: string; status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string; vercelUrl?: string; qrCodeUrl?: string; createdAt?: string;
}

interface QRCode {
  id: string; name: string; type: 'URL' | 'TEXT' | 'WIFI' | 'VCARD' | 'EMAIL' | 'SMS';
  content: string; style: 'square' | 'rounded' | 'circle';
  foregroundColor: string; backgroundColor: string; logoUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; slug?: string;
  qrCodeUrl?: string; createdAt?: string; updatedAt?: string;
}

// ==================== CONSTANTS ====================

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: 'RESTAURANT', label: 'Restaurant' }, { value: 'CAFE', label: 'Café' },
  { value: 'BAR', label: 'Bar' }, { value: 'BAKERY', label: 'Bakery' },
  { value: 'PIZZERIA', label: 'Pizzeria' }, { value: 'SUSHI', label: 'Sushi Bar' },
  { value: 'BURGER', label: 'Burger Joint' }, { value: 'SALAD', label: 'Salad Bar' },
  { value: 'SEAFOOD', label: 'Seafood' }, { value: 'STEAKHOUSE', label: 'Steakhouse' },
];

const POSTER_BUSINESS_TYPES: { value: PosterBusinessType; label: string }[] = [
  { value: 'RESTAURANT', label: 'Restaurant' }, { value: 'CAFE', label: 'Café' },
  { value: 'RETAIL', label: 'Retail' }, { value: 'HEALTH', label: 'Santé' },
  { value: 'EDUCATION', label: 'Éducation' }, { value: 'EVENT', label: 'Événement' },
  { value: 'OTHER', label: 'Autre' },
];

const MENU_TEMPLATES: { value: MenuTemplate; label: string }[] = [
  { value: 'MODERN', label: 'Moderne' }, { value: 'CLASSIC', label: 'Classique' },
  { value: 'MINIMAL', label: 'Minimal' }, { value: 'ELEGANT', label: 'Élégant' },
  { value: 'RUSTIC', label: 'Rustique' },
];

const POSTER_TEMPLATES: { value: PosterTemplate; label: string }[] = [
  { value: 'MODERN', label: 'Moderne' }, { value: 'CLASSIC', label: 'Classique' },
  { value: 'MINIMAL', label: 'Minimal' }, { value: 'BOLD', label: 'Audacieux' },
  { value: 'ELEGANT', label: 'Élégant' },
];

const POSTER_SIZES: { value: PosterSize; label: string }[] = [
  { value: 'A4', label: 'A4' }, { value: 'A3', label: 'A3' },
  { value: 'SOCIAL_MEDIA', label: 'Réseaux Sociaux' }, { value: 'STORY', label: 'Story' },
];

const QR_TYPES: { value: 'URL' | 'TEXT' | 'WIFI' | 'VCARD' | 'EMAIL' | 'SMS'; label: string }[] = [
  { value: 'URL', label: 'URL/Lien' }, { value: 'TEXT', label: 'Texte' },
  { value: 'WIFI', label: 'WiFi' }, { value: 'VCARD', label: 'vCard' },
  { value: 'EMAIL', label: 'Email' }, { value: 'SMS', label: 'SMS' },
];

const QR_STYLES: { value: 'square' | 'rounded' | 'circle'; label: string }[] = [
  { value: 'square', label: 'Carré' }, { value: 'rounded', label: 'Arrondi' },
  { value: 'circle', label: 'Cercles' },
];

const FONT_OPTIONS = [
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Lora, serif", label: "Lora" }, { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Open Sans, sans-serif", label: "Open Sans" }, { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Poppins, sans-serif", label: "Poppins" }, { value: "Dancing Script, cursive", label: "Dancing Script" },
  { value: "Oswald, sans-serif", label: "Oswald" },
];

// ==================== DYNAMIC CATEGORIES BY BUSINESS TYPE ====================

const DEFAULT_CATEGORIES: Record<BusinessType, MenuCategory[]> = {
  RESTAURANT: [
    { name: 'Entrées', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Plats Principaux', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Desserts', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Boissons', items: [{ id: '4', name: '', price: '' }] },
  ],
  CAFE: [
    { name: 'Boissons Chaudes', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Boissons Froides', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Pâtisseries', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Snacks', items: [{ id: '4', name: '', price: '' }] },
  ],
  BAR: [
    { name: 'Cocktails', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Vins', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Bières', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Snacks', items: [{ id: '4', name: '', price: '' }] },
  ],
  BAKERY: [
    { name: 'Pains', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Viennoiseries', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Gâteaux', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Boissons', items: [{ id: '4', name: '', price: '' }] },
  ],
  PIZZERIA: [
    { name: 'Pizzas Classiques', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Pizzas Spéciales', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Desserts', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Boissons', items: [{ id: '4', name: '', price: '' }] },
  ],
  SUSHI: [
    { name: 'Entrées', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Sushis', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Sashimis', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Boissons', items: [{ id: '4', name: '', price: '' }] },
  ],
  BURGER: [
    { name: 'Burgers', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Frites & Accompagnements', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Desserts', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Boissons', items: [{ id: '4', name: '', price: '' }] },
  ],
  SALAD: [
    { name: 'Salades', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Bowls', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Smoothies & Jus', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Snacks', items: [{ id: '4', name: '', price: '' }] },
  ],
  SEAFOOD: [
    { name: 'Entrées', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Plats de Poisson', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Fruits de Mer', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Desserts', items: [{ id: '4', name: '', price: '' }] },
  ],
  STEAKHOUSE: [
    { name: 'Entrées', items: [{ id: '1', name: '', price: '' }] },
    { name: 'Viandes', items: [{ id: '2', name: '', price: '' }] },
    { name: 'Accompagnements', items: [{ id: '3', name: '', price: '' }] },
    { name: 'Desserts & Boissons', items: [{ id: '4', name: '', price: '' }] },
  ],
};

const getDefaultCategories = (businessType: BusinessType): MenuCategory[] => {
  return JSON.parse(JSON.stringify(DEFAULT_CATEGORIES[businessType] || DEFAULT_CATEGORIES.RESTAURANT));
};

// ==================== MAIN COMPONENT ====================

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('menu');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Menu state
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [menuForm, setMenuForm] = useState({ businessName: '', businessType: 'RESTAURANT' as BusinessType, description: '', template: 'MODERN' as MenuTemplate, fontFamily: 'Playfair Display, serif', primaryColor: '#1a1a2e', secondaryColor: '#16213e', accentColor: '#e94560' });
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(getDefaultCategories('RESTAURANT'));
  const [menuImages, setMenuImages] = useState<{ id: string; url: string; name: string }[]>([]);

  // Poster state
  const [posters, setPosters] = useState<Poster[]>([]);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [posterForm, setPosterForm] = useState({ businessName: '', businessType: 'RESTAURANT' as PosterBusinessType, title: '', description: '', template: 'MODERN' as PosterTemplate, size: 'A4' as PosterSize, fontFamily: 'Inter, sans-serif', primaryColor: '#1a1a2e', secondaryColor: '#16213e', accentColor: '#e94560' });
  const [posterSections, setPosterSections] = useState<{ title: string; items: { text: string; subtitle?: string }[] }[]>([]);
  const [posterImages, setPosterImages] = useState<{ id: string; url: string; name: string }[]>([]);

  // QR Code state
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [qrForm, setQrForm] = useState({ name: '', type: 'URL' as QRCode['type'], content: '', style: 'square' as QRCode['style'], foregroundColor: '#000000', backgroundColor: '#ffffff' });

  useEffect(() => { loadMenus(); loadPosters(); loadQrCodes(); }, []);

  const showMessage = (type: 'success' | 'error', text: string) => { setMessage({ type, text }); setTimeout(() => setMessage(null), 4000); };

  // ==================== MENU FUNCTIONS ====================

  const loadMenus = async () => {
    try { 
      const response = await get<Menu[]>('/menus'); 
      if (Array.isArray(response.data)) {
        setMenus(response.data); 
      }
    } catch { /* ignore */ }
  };

  const addCategory = () => setMenuCategories([...menuCategories, { name: '', items: [{ id: Date.now().toString(), name: '', price: '' }] }]);

  const updateCategory = (idx: number, name: string) => {
    const updated = [...menuCategories]; updated[idx].name = name; setMenuCategories(updated);
  };

  const addItem = (catIdx: number) => {
    const updated = [...menuCategories]; updated[catIdx].items.push({ id: Date.now().toString(), name: '', price: '' }); setMenuCategories(updated);
  };

  const updateItem = (catIdx: number, itemIdx: number, field: 'name' | 'price', value: string) => {
    const updated = [...menuCategories]; updated[catIdx].items[itemIdx][field] = value; setMenuCategories(updated);
  };

  const updateItemImage = async (catIdx: number, itemIdx: number, file: File) => {
    try {
      const response = await upload<{ url: string }>('/images/upload', file);
      const updated = [...menuCategories];
      updated[catIdx].items[itemIdx].imageUrl = response.data.url;
      setMenuCategories(updated);
      showMessage('success', 'Image uploadée avec succès!');
    } catch {
      showMessage('error', 'Erreur lors de l\'upload de l\'image');
    }
  };

  // Menu general images
  const uploadMenuImage = async (file: File) => {
    try {
      const response = await upload<{ url: string }>('/images/upload', file);
      setMenuImages([...menuImages, { id: Date.now().toString(), url: response.data.url, name: file.name }]);
      showMessage('success', 'Image ajoutée au menu!');
    } catch {
      showMessage('error', 'Erreur lors de l\'upload de l\'image');
    }
  };

  const removeMenuImage = (id: string) => setMenuImages(menuImages.filter(img => img.id !== id));

  // Poster general images
  const uploadPosterImage = async (file: File) => {
    try {
      const response = await upload<{ url: string }>('/images/upload', file);
      setPosterImages([...posterImages, { id: Date.now().toString(), url: response.data.url, name: file.name }]);
      showMessage('success', 'Image ajoutée à l\'affiche!');
    } catch {
      showMessage('error', 'Erreur lors de l\'upload de l\'image');
    }
  };

  const removePosterImage = (id: string) => setPosterImages(posterImages.filter(img => img.id !== id));

  const removeItem = (catIdx: number, itemIdx: number) => {
    const updated = [...menuCategories]; updated[catIdx].items.splice(itemIdx, 1); setMenuCategories(updated);
  };

  const generateMenu = async () => {
    if (!menuForm.businessName) { showMessage('error', 'Veuillez entrer le nom du commerce'); return; }
    setLoading(true);
    try {
      const validCategories = menuCategories.filter(c => c.name && c.items.some(i => i.name));
      const response = await post<Menu>('/ai-engine/generate-menu', {
        businessName: menuForm.businessName, businessType: menuForm.businessType,
        description: menuForm.description, template: menuForm.template,
        fontFamily: menuForm.fontFamily, colors: { primary: menuForm.primaryColor, secondary: menuForm.secondaryColor, accent: menuForm.accentColor },
        categories: validCategories,
      });
      setMenus([response.data, ...menus]); setSelectedMenu(response.data);
      showMessage('success', 'Menu généré avec succès!');
    } catch { showMessage('error', 'Erreur lors de la génération'); }
    setLoading(false);
  };

  const publishMenu = async (id: string) => {
    try {
      const response = await post<Menu>(`/menus/${id}/publish`, {});
      setMenus(menus.map(m => m.id === id ? response.data : m)); setSelectedMenu(response.data);
      showMessage('success', 'Menu publié avec succès!');
    } catch { showMessage('error', 'Erreur lors de la publication'); }
  };

  const deleteMenu = async (id: string) => {
    try { await del(`/menus/${id}`); setMenus(menus.filter(m => m.id !== id)); if (selectedMenu?.id === id) setSelectedMenu(null); showMessage('success', 'Menu supprimé'); } catch { showMessage('error', 'Erreur'); }
  };

  const copyMenuUrl = (url: string) => { navigator.clipboard.writeText(url); showMessage('success', 'URL copiée!'); };

  // ==================== POSTER FUNCTIONS ====================

  const loadPosters = async () => {
    try { 
      const response = await get<Poster[]>('/posters'); 
      if (Array.isArray(response.data)) {
        setPosters(response.data); 
      }
    } catch { /* ignore */ }
  };

  const addPosterSection = () => setPosterSections([...posterSections, { title: '', items: [{ text: '' }] }]);

  const updatePosterSection = (idx: number, title: string) => {
    const updated = [...posterSections]; updated[idx].title = title; setPosterSections(updated);
  };

  const addPosterItem = (secIdx: number) => {
    const updated = [...posterSections]; updated[secIdx].items.push({ text: '' }); setPosterSections(updated);
  };

  const updatePosterItem = (secIdx: number, itemIdx: number, field: 'text' | 'subtitle', value: string) => {
    const updated = [...posterSections]; updated[secIdx].items[itemIdx][field] = value; setPosterSections(updated);
  };

  const generatePoster = async () => {
    if (!posterForm.businessName || !posterForm.title) { showMessage('error', 'Remplissez le nom du commerce et le titre'); return; }
    setLoading(true);
    try {
      const response = await post<Poster>('/ai-engine/generate-poster', {
        businessName: posterForm.businessName, businessType: posterForm.businessType,
        title: posterForm.title, description: posterForm.description,
        template: posterForm.template, size: posterForm.size,
        fontFamily: posterForm.fontFamily,
        colors: { primary: posterForm.primaryColor, secondary: posterForm.secondaryColor, accent: posterForm.accentColor },
        sections: posterSections,
      });
      setPosters([response.data, ...posters]); setSelectedPoster(response.data);
      showMessage('success', 'Poster généré avec succès!');
    } catch { showMessage('error', 'Erreur lors de la génération'); }
    setLoading(false);
  };

  const publishPoster = async (id: string) => {
    try {
      const response = await post<Poster>(`/posters/${id}/publish`, {});
      setPosters(posters.map(p => p.id === id ? response.data : p)); setSelectedPoster(response.data);
      showMessage('success', 'Poster publié!');
    } catch { showMessage('error', 'Erreur'); }
  };

  const deletePoster = async (id: string) => {
    try { await del(`/posters/${id}`); setPosters(posters.filter(p => p.id !== id)); if (selectedPoster?.id === id) setSelectedPoster(null); showMessage('success', 'Poster supprimé'); } catch { showMessage('error', 'Erreur'); }
  };

  // ==================== QR CODE FUNCTIONS ====================

  const loadQrCodes = async () => {
    try { 
      const response = await get<QRCode[]>('/qr-code'); 
      if (Array.isArray(response.data)) {
        setQrCodes(response.data); 
      }
    } catch { /* ignore */ }
  };

  const generateQRCode = async () => {
    if (!qrForm.name || !qrForm.content) { showMessage('error', 'Remplissez le nom et le contenu'); return; }
    setLoading(true);
    try {
      const response = await post<QRCode>('/qr-code/generate', qrForm);
      const newQR = response.data;
      setQrCodes([newQR, ...qrCodes]); setSelectedQR(newQR);
      showMessage('success', 'QR Code généré!');
    } catch { showMessage('error', 'Erreur lors de la génération'); }
    setLoading(false);
  };

  const deleteQRCode = async (id: string) => {
    try { await del(`/qr-code/${id}`); setQrCodes(qrCodes.filter(q => q.id !== id)); if (selectedQR?.id === id) setSelectedQR(null); showMessage('success', 'QR Code supprimé'); } catch { showMessage('error', 'Erreur'); }
  };

  // ==================== RENDER ====================

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Marketing Tools</h1>
        <p className="text-muted-foreground">Créez vos menus, posters et codes QR en un seul endroit</p>
      </div>

      {message && <Alert className="mb-4" variant={message.type === 'error' ? 'destructive' : 'default'}><AlertDescription>{message.text}</AlertDescription></Alert>}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="menu" className="flex items-center gap-2"><MenuIcon className="h-4 w-4" /> Menus</TabsTrigger>
          <TabsTrigger value="poster" className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Posters</TabsTrigger>
          <TabsTrigger value="qrcode" className="flex items-center gap-2"><QrCodeIcon className="h-4 w-4" /> QR Codes</TabsTrigger>
        </TabsList>

        {/* ==================== MENU TAB ==================== */}
        <TabsContent value="menu" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Menu Form */}
            <Card>
              <CardHeader><CardTitle>Créer un Menu</CardTitle><CardDescription>Configurez votre menu numérique</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Nom du Commerce</Label><Input value={menuForm.businessName} onChange={e => setMenuForm({ ...menuForm, businessName: e.target.value })} placeholder="Le Petit Bistro" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Type</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2" value={menuForm.businessType} onChange={e => { const newType = e.target.value as BusinessType; setMenuForm({ ...menuForm, businessType: newType }); setMenuCategories(getDefaultCategories(newType)); }}>{BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                  <div><Label>Template</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2" value={menuForm.template} onChange={e => setMenuForm({ ...menuForm, template: e.target.value as MenuTemplate })}>{MENU_TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                </div>
                <div><Label>Description</Label><Input value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} placeholder="Cuisine française traditionnelle..." /></div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label>Couleur Principale</Label><Input type="color" value={menuForm.primaryColor} onChange={e => setMenuForm({ ...menuForm, primaryColor: e.target.value })} className="h-10" /></div>
                  <div><Label>Couleur Secondaire</Label><Input type="color" value={menuForm.secondaryColor} onChange={e => setMenuForm({ ...menuForm, secondaryColor: e.target.value })} className="h-10" /></div>
                  <div><Label>Couleur Accent</Label><Input type="color" value={menuForm.accentColor} onChange={e => setMenuForm({ ...menuForm, accentColor: e.target.value })} className="h-10" /></div>
                </div>
                <div><Label>Police</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2" value={menuForm.fontFamily} onChange={e => setMenuForm({ ...menuForm, fontFamily: e.target.value })}>{FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select></div>

                {/* Categories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><Label>Catégories et Articles</Label><Button variant="outline" size="sm" onClick={addCategory}>+ Catégorie</Button></div>
                  {menuCategories.map((cat, catIdx) => (
                    <div key={catIdx} className="rounded-lg border p-3 space-y-2">
                      <Input placeholder="Nom de la catégorie" value={cat.name} onChange={e => updateCategory(catIdx, e.target.value)} />
                      {cat.items.map((item, itemIdx) => (
                        <div key={item.id} className="space-y-2 p-2 bg-muted/30 rounded">
                          <div className="flex gap-2">
                            <Input placeholder="Nom" value={item.name} onChange={e => updateItem(catIdx, itemIdx, 'name', e.target.value)} className="flex-1" />
                            <Input placeholder="Prix" value={item.price} onChange={e => updateItem(catIdx, itemIdx, 'price', e.target.value)} className="w-24" />
                            {cat.items.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeItem(catIdx, itemIdx)}><TrashIcon className="h-4 w-4" /></Button>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Image:</Label>
                            <label className="flex items-center gap-1 px-2 py-1 text-xs bg-background border rounded cursor-pointer hover:bg-muted">
                              <UploadIcon className="h-3 w-3" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) updateItemImage(catIdx, itemIdx, file);
                                }}
                              />
                            </label>
                            {item.imageUrl && (
                              <div className="flex items-center gap-1">
                                <img src={item.imageUrl} alt="" className="h-8 w-8 object-cover rounded" />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    const updated = [...menuCategories];
                                    updated[catIdx].items[itemIdx].imageUrl = undefined;
                                    setMenuCategories(updated);
                                  }}
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addItem(catIdx)}>+ Article</Button>
                    </div>
                  ))}
                </div>

                {/* General Images */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Images du Menu</Label>
                    <label className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90">
                      <UploadIcon className="h-3 w-3" />
                      <span>Ajouter une image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) uploadMenuImage(file);
                        }}
                      />
                    </label>
                  </div>
                  {menuImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {menuImages.map(img => (
                        <div key={img.id} className="relative group">
                          <img src={img.url} alt={img.name} className="w-full h-20 object-cover rounded border" />
                          <button
                            onClick={() => removeMenuImage(img.id)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Images qui apparaîtront dans votre menu (logos, photos, etc.)</p>
                </div>
              </CardContent>
              <CardFooter><Button onClick={generateMenu} disabled={loading} className="w-full"><SparklesIcon className="mr-2 h-4 w-4" />{loading ? 'Génération...' : 'Générer le Menu'}</Button></CardFooter>
            </Card>

            {/* Menus List */}
            <Card>
              <CardHeader><CardTitle>Mes Menus</CardTitle></CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {menus.length === 0 ? <p className="text-muted-foreground text-center py-8">Aucun menu créé</p> : menus.map(menu => (
                  <div key={menu.id} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedMenu?.id === menu.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`} onClick={() => setSelectedMenu(menu)}>
                    <div className="flex items-center justify-between">
                      <div><p className="font-medium">{menu.name}</p><p className="text-sm text-muted-foreground">{menu.businessType} • {menu.status}</p></div>
                      <div className="flex gap-1">
                        {menu.vercelUrl && <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); copyMenuUrl(menu.vercelUrl!); }}><CopyIcon className="h-4 w-4" /></Button>}
                        {menu.status === 'DRAFT' && <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); publishMenu(menu.id); }}>Publier</Button>}
                        <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); deleteMenu(menu.id); }}><TrashIcon className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          {selectedMenu && (
            <Card>
              <CardHeader><CardTitle>Preview: {selectedMenu.name}</CardTitle></CardHeader>
              <CardContent>
                {selectedMenu.vercelUrl ? (
                  <iframe src={selectedMenu.vercelUrl} className="w-full h-[600px] border rounded" title="Menu Preview" />
                ) : (
                  <div className="flex items-center justify-center h-[300px] bg-muted rounded"><p className="text-muted-foreground">Publiez le menu pour voir l'aperçu</p></div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ==================== POSTER TAB ==================== */}
        <TabsContent value="poster" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Poster Form */}
            <Card>
              <CardHeader><CardTitle>Créer un Poster</CardTitle><CardDescription>Générez un poster marketing</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Nom du Commerce</Label><Input value={posterForm.businessName} onChange={e => setPosterForm({ ...posterForm, businessName: e.target.value })} placeholder="Le Petit Bistro" /></div>
                  <div><Label>Titre</Label><Input value={posterForm.title} onChange={e => setPosterForm({ ...posterForm, title: e.target.value })} placeholder="Menu du Jour" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Type</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2" value={posterForm.businessType} onChange={e => setPosterForm({ ...posterForm, businessType: e.target.value as PosterBusinessType })}>{POSTER_BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                  <div><Label>Template</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2" value={posterForm.template} onChange={e => setPosterForm({ ...posterForm, template: e.target.value as PosterTemplate })}>{POSTER_TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                  <div><Label>Taille</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2" value={posterForm.size} onChange={e => setPosterForm({ ...posterForm, size: e.target.value as PosterSize })}>{POSTER_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
                </div>
                <div><Label>Description</Label><Input value={posterForm.description} onChange={e => setPosterForm({ ...posterForm, description: e.target.value })} placeholder="Description du poster..." /></div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Label>Couleur Principale</Label><Input type="color" value={posterForm.primaryColor} onChange={e => setPosterForm({ ...posterForm, primaryColor: e.target.value })} className="h-10" /></div>
                  <div><Label>Couleur Secondaire</Label><Input type="color" value={posterForm.secondaryColor} onChange={e => setPosterForm({ ...posterForm, secondaryColor: e.target.value })} className="h-10" /></div>
                  <div><Label>Couleur Accent</Label><Input type="color" value={posterForm.accentColor} onChange={e => setPosterForm({ ...posterForm, accentColor: e.target.value })} className="h-10" /></div>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><Label>Sections</Label><Button variant="outline" size="sm" onClick={addPosterSection}>+ Section</Button></div>
                  {posterSections.map((sec, secIdx) => (
                    <div key={secIdx} className="rounded-lg border p-3 space-y-2">
                      <Input placeholder="Titre de la section" value={sec.title} onChange={e => updatePosterSection(secIdx, e.target.value)} />
                      {sec.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex gap-2">
                          <Input placeholder="Texte" value={item.text} onChange={e => updatePosterItem(secIdx, itemIdx, 'text', e.target.value)} className="flex-1" />
                          <Input placeholder="Sous-titre" value={item.subtitle || ''} onChange={e => updatePosterItem(secIdx, itemIdx, 'subtitle', e.target.value)} className="w-32" />
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addPosterItem(secIdx)}>+ Élément</Button>
                    </div>
                  ))}
                </div>

                {/* General Images */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Images de l'Affiche</Label>
                    <label className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90">
                      <UploadIcon className="h-3 w-3" />
                      <span>Ajouter une image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) uploadPosterImage(file);
                        }}
                      />
                    </label>
                  </div>
                  {posterImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {posterImages.map(img => (
                        <div key={img.id} className="relative group">
                          <img src={img.url} alt={img.name} className="w-full h-20 object-cover rounded border" />
                          <button
                            onClick={() => removePosterImage(img.id)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Images qui apparaîtront dans votre affiche (logos, photos, etc.)</p>
                </div>
              </CardContent>
              <CardFooter><Button onClick={generatePoster} disabled={loading} className="w-full"><SparklesIcon className="mr-2 h-4 w-4" />{loading ? 'Génération...' : 'Générer le Poster'}</Button></CardFooter>
            </Card>

            {/* Posters List */}
            <Card>
              <CardHeader><CardTitle>Mes Posters</CardTitle></CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {posters.length === 0 ? <p className="text-muted-foreground text-center py-8">Aucun poster créé</p> : posters.map(poster => (
                  <div key={poster.id} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedPoster?.id === poster.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`} onClick={() => setSelectedPoster(poster)}>
                    <div className="flex items-center justify-between">
                      <div><p className="font-medium">{poster.name}</p><p className="text-sm text-muted-foreground">{poster.title} • {poster.status}</p></div>
                      <div className="flex gap-1">
                        {poster.status === 'DRAFT' && <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); publishPoster(poster.id); }}>Publier</Button>}
                        <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); deletePoster(poster.id); }}><TrashIcon className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== QR CODE TAB ==================== */}
        <TabsContent value="qrcode" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* QR Form */}
            <Card>
              <CardHeader><CardTitle>Créer un QR Code</CardTitle><CardDescription>Générez des codes QR personnalisés</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Nom</Label><Input value={qrForm.name} onChange={e => setQrForm({ ...qrForm, name: e.target.value })} placeholder="Mon QR Code" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Type</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2" value={qrForm.type} onChange={e => setQrForm({ ...qrForm, type: e.target.value as QRCode['type'] })}>{QR_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                  <div><Label>Style</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2" value={qrForm.style} onChange={e => setQrForm({ ...qrForm, style: e.target.value as QRCode['style'] })}>{QR_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
                </div>
                <div><Label>Contenu</Label><Input value={qrForm.content} onChange={e => setQrForm({ ...qrForm, content: e.target.value })} placeholder={qrForm.type === 'URL' ? 'https://...' : 'Entrez le contenu...'} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Couleur de fond</Label><Input type="color" value={qrForm.backgroundColor} onChange={e => setQrForm({ ...qrForm, backgroundColor: e.target.value })} className="h-10" /></div>
                  <div><Label>Couleur du QR</Label><Input type="color" value={qrForm.foregroundColor} onChange={e => setQrForm({ ...qrForm, foregroundColor: e.target.value })} className="h-10" /></div>
                </div>
              </CardContent>
              <CardFooter><Button onClick={generateQRCode} disabled={loading} className="w-full"><SparklesIcon className="mr-2 h-4 w-4" />{loading ? 'Génération...' : 'Générer le QR Code'}</Button></CardFooter>
            </Card>

            {/* QR Codes List */}
            <Card>
              <CardHeader><CardTitle>Mes QR Codes</CardTitle></CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {qrCodes.length === 0 ? <p className="text-muted-foreground text-center py-8">Aucun QR Code créé</p> : qrCodes.map(qr => (
                  <div key={qr.id} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedQR?.id === qr.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`} onClick={() => setSelectedQR(qr)}>
                    <div className="flex items-center justify-between">
                      <div><p className="font-medium">{qr.name}</p><p className="text-sm text-muted-foreground">{qr.type} • {qr.status}</p></div>
                      <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); deleteQRCode(qr.id); }}><TrashIcon className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* QR Preview */}
          {selectedQR && (
            <Card>
              <CardHeader><CardTitle>QR Code: {selectedQR.name}</CardTitle></CardHeader>
              <CardContent className="flex justify-center">
                {selectedQR.qrCodeUrl ? (
                  <img src={selectedQR.qrCodeUrl} alt={selectedQR.name} className="max-w-xs rounded-lg" />
                ) : (
                  <div className="w-64 h-64 bg-muted rounded flex items-center justify-center"><p className="text-muted-foreground">QR Code non disponible</p></div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}