'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import type { BrandItem } from '@/types';
import type { WebsiteResponse, WebsiteSummary, WebsiteSection } from '@/types/website';

type View = 'list' | 'wizard' | 'editor';

const templates = [
  { id: 'modern', name: 'Moderne', preview: '🎨' },
  { id: 'classic', name: 'Classique', preview: '📋' },
  { id: 'minimal', name: 'Minimaliste', preview: '⬜' },
  { id: 'bold', name: 'Audacieux', preview: '🔥' },
] as const;

const businessTypes = [
  'Restaurant', 'Boutique', 'Salon de coiffure', 'Cabinet médical', 'Avocat',
  'Architecte', 'Agence immobilière', 'Auto-école', 'Fitness / Salle de sport', 'Autre',
];

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
] as const;

const currencies = [
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'USD', label: 'Dollar US ($)' },
  { code: 'GBP', label: 'Livre (£)' },
  { code: 'MAD', label: 'Dirham marocain (DH)' },
  { code: 'CAD', label: 'Dollar canadien ($)' },
  { code: 'CHF', label: 'Franc suisse (CHF)' },
  { code: 'AED', label: 'Dirham (AED)' },
  { code: 'SAR', label: 'Riyal (SAR)' },
  { code: 'TND', label: 'Dinar tunisien (DT)' },
];

const colorPresets = [
  { name: 'Bleu Professionnel', primary: '#2563eb', secondary: '#1e40af', accent: '#60a5fa' },
  { name: 'Vert Nature', primary: '#16a34a', secondary: '#15803d', accent: '#4ade80' },
  { name: 'Rouge Énergique', primary: '#dc2626', secondary: '#b91c1c', accent: '#f87171' },
  { name: 'Violet Créatif', primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa' },
  { name: 'Orange Chaud', primary: '#ea580c', secondary: '#c2410c', accent: '#fb923c' },
  { name: 'Noir & Blanc', primary: '#171717', secondary: '#404040', accent: '#a3a3a3' },
];

const sectionLabels: Record<string, string> = {
  hero: 'Accueil (Hero)', about: 'À propos', services: 'Services', products: 'Produits',
  gallery: 'Galerie', testimonials: 'Témoignages', faq: 'FAQ', cta: "Appel à l'action", contact: 'Contact',
  custom: 'Section personnalisée',
};

const fieldLabels: Record<string, string> = {
  eyebrow: 'Accroche', title: 'Titre', subtitle: 'Sous-titre', description: 'Description', body: 'Texte',
  heading: 'Titre', subheading: 'Sous-titre', ctaLabel: 'Bouton', buttonLabel: 'Bouton',
  name: 'Nom', price: 'Prix', quote: 'Citation', author: 'Auteur', role: 'Rôle',
  question: 'Question', answer: 'Réponse', label: 'Libellé', value: 'Valeur', icon: 'Icône',
};

const STRING_KEYS = Object.keys(fieldLabels);
const HIDDEN_KEYS = ['imagePrompt', 'request'];

export default function WebsitesPage() {
  const [view, setView] = useState<View>('list');
  const [siteId, setSiteId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {view === 'list' && (
          <ListView
            onCreate={() => setView('wizard')}
            onOpen={(id) => { setSiteId(id); setView('editor'); }}
          />
        )}
        {view === 'wizard' && (
          <Wizard
            onCancel={() => setView('list')}
            onGenerated={(id) => { setSiteId(id); setView('editor'); }}
          />
        )}
        {view === 'editor' && siteId && (
          <Editor id={siteId} onBack={() => setView('list')} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ List */

function ListView({ onCreate, onOpen }: { onCreate: () => void; onOpen: (id: string) => void }) {
  const [sites, setSites] = useState<WebsiteSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<WebsiteSummary[]>('/websites')
      .then((r) => setSites(r.data || []))
      .catch(() => toast.error('Impossible de charger les sites'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sites Web</h1>
          <p className="text-gray-600 mt-1">Générez et gérez vos sites vitrine.</p>
        </div>
        <button onClick={onCreate} className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
          + Nouveau site
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : sites.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <div className="text-5xl mb-4">🌐</div>
          <p className="text-gray-600 mb-6">Vous n'avez pas encore de site web.</p>
          <button onClick={onCreate} className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
            Créer mon premier site
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 truncate">{s.businessName}</h3>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-xs font-mono text-gray-400 truncate mb-4">{s.subdomain}</p>
              <div className="flex gap-2">
                <button onClick={() => onOpen(s.id)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  Modifier
                </button>
                {s.status === 'PUBLISHED' && s.vercelUrl && (
                  <a href={s.vercelUrl} target="_blank" rel="noreferrer" className="flex-1 py-2 text-center bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100">
                    Voir le site
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT: 'bg-yellow-100 text-yellow-700',
    PUBLISHED: 'bg-green-100 text-green-700',
    ARCHIVED: 'bg-gray-100 text-gray-500',
  };
  const label: Record<string, string> = { DRAFT: 'Brouillon', PUBLISHED: 'Publié', ARCHIVED: 'Archivé' };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || map.DRAFT}`}>{label[status] || status}</span>;
}

/* ---------------------------------------------------------------- Wizard */

function Wizard({ onCancel, onGenerated }: { onCancel: () => void; onGenerated: (id: string) => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const [contact, setContact] = useState({ phone: '', email: '', whatsapp: '', googleReviewUrl: '', googleMapsUrl: '', hours: '' });
  const [galleryEnabled, setGalleryEnabled] = useState(true);
  const [galleryImages, setGalleryImages] = useState<{ imageUrl?: string; imagePrompt?: string }[]>([{}, {}, {}]);
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal' | 'bold'>('modern');
  const [colors, setColors] = useState(colorPresets[0]);
  const [language, setLanguage] = useState<'fr' | 'en' | 'es' | 'ar' | 'de'>('fr');
  const [currency, setCurrency] = useState('EUR');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [products, setProducts] = useState<{ name: string; price: string; description?: string; imageUrl?: string; imagePrompt?: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | undefined> => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.upload<{ url: string }>('/websites/upload', fd);
      return data.url;
    } catch {
      toast.error('Échec du téléversement');
      return undefined;
    } finally {
      setUploading(false);
    }
  };

  const addProduct = () => setProducts([...products, { name: '', price: '' }]);
  const updateProduct = (i: number, patch: Partial<{ name: string; price: string; description?: string; imageUrl?: string; imagePrompt?: string }>) =>
    setProducts(products.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const removeProduct = (i: number) => setProducts(products.filter((_, idx) => idx !== i));

  // Pre-fill from the tenant's brand.
  useEffect(() => {
    api.get<BrandItem[]>('/branding')
      .then((r) => {
        const b = (r.data || [])[0];
        if (b) {
          setBusinessName(b.name || '');
          setBusinessType(b.industry || '');
          setDescription(b.description || '');
          if (b.primaryColor) {
            setColors({
              name: 'Marque', primary: b.primaryColor,
              secondary: b.secondaryColor || b.primaryColor, accent: b.accentColor || b.primaryColor,
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setPrefilled(true));
  }, []);

  const addService = () => {
    const v = newService.trim();
    if (v && !services.includes(v)) { setServices([...services, v]); setNewService(''); }
  };

  const updateGalleryImage = (i: number, patch: { imageUrl?: string; imagePrompt?: string }) =>
    setGalleryImages(galleryImages.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));

  const generate = async () => {
    setLoading(true);
    try {
      const cleanProducts = products
        .filter((p) => p.name.trim() && p.price.trim())
        .map((p) => ({ name: p.name.trim(), price: p.price.trim(), description: p.description, imageUrl: p.imageUrl, imagePrompt: p.imagePrompt }));
      const { data } = await api.post<WebsiteResponse>('/websites/generate', {
        businessName, businessType, description, services,
        products: cleanProducts,
        gallery: { enabled: galleryEnabled, images: galleryImages },
        logoUrl: logoUrl || undefined,
        contactInfo: contact,
        colors: { primary: colors.primary, secondary: colors.secondary, accent: colors.accent },
        template,
        language,
        currency,
      });
      toast.success('Site généré !');
      onGenerated(data.id);
    } catch (e: any) {
      toast.error(e?.message || 'Erreur lors de la génération du site web');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nouveau site web</h1>
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">← Retour</button>
      </div>

      <div className="flex items-center justify-center mb-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
            {s < 3 && <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-8 text-sm text-gray-600">
        {step === 1 && 'Informations'}
        {step === 2 && 'Produits & Galerie'}
        {step === 3 && 'Design'}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
            ℹ️ Pré-rempli depuis votre marque — modifiez seulement ce que vous voulez.
          </div>
          <Field label="Logo (optionnel — sinon logo texte automatique)">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoUrl ? <img src={logoUrl} alt="logo" className="w-full h-full object-contain" /> : <span className="text-gray-300 text-xl">🖼</span>}
              </div>
              <label className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-200">
                {uploading ? 'Téléversement…' : 'Téléverser un logo'}
                <input type="file" accept="image/*" className="hidden"
                  onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const u = await uploadFile(f); if (u) setLogoUrl(u); } }} />
              </label>
              {logoUrl && <button onClick={() => setLogoUrl('')} className="text-xs text-gray-500 hover:text-gray-700">Retirer</button>}
            </div>
          </Field>
          <Field label="Nom de l'entreprise *">
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputCls} placeholder="Ma Belle Entreprise" />
          </Field>
          <Field label="Type d'activité *">
            <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className={inputCls}>
              <option value="">Sélectionnez…</option>
              {businessTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Description *">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} placeholder="Décrivez votre activité…" />
          </Field>
          <Field label="Services proposés">
            <div className="flex gap-2 mb-2">
              <input value={newService} onChange={(e) => setNewService(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())} className={`${inputCls} flex-1`} placeholder="Ajouter un service…" />
              <button onClick={addService} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Ajouter</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {s}<button onClick={() => setServices(services.filter((x) => x !== s))} className="hover:text-blue-900">×</button>
                </span>
              ))}
            </div>
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Téléphone"><input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={inputCls} placeholder="+33 6 12 34 56 78" /></Field>
            <Field label="Email"><input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={inputCls} placeholder="contact@exemple.com" /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="WhatsApp (bouton de contact)"><input value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} className={inputCls} placeholder="+212 6 12 34 56 78" /></Field>
            <Field label="Lien avis Google (bouton d'avis)"><input value={contact.googleReviewUrl} onChange={(e) => setContact({ ...contact, googleReviewUrl: e.target.value })} className={inputCls} placeholder="https://g.page/r/…/review" /></Field>
          </div>
          <Field label="Lien Google Maps de votre établissement">
            <input value={contact.googleMapsUrl} onChange={(e) => setContact({ ...contact, googleMapsUrl: e.target.value })} className={inputCls} placeholder="Collez le lien Google Maps de votre commerce (ex : https://maps.app.goo.gl/…)" />
            <p className="text-xs text-gray-400 mt-1">La carte de votre emplacement s'affichera automatiquement sur le site.</p>
          </Field>
          <Field label="Horaires d'ouverture">
            <input value={contact.hours} onChange={(e) => setContact({ ...contact, hours: e.target.value })} className={inputCls} placeholder="Ex : Lun–Ven 9h–18h · Sam 9h–13h · Dim fermé" />
          </Field>
          <p className="text-xs text-gray-400">WhatsApp et l'email activent un bouton de discussion et un formulaire de contact.</p>
          <div className="flex justify-end">
            <button onClick={() => setStep(2)} disabled={!businessName || !businessType || !description} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              Suivant →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
            🛍️ Ajoutez vos produits (nom + prix). Sans photo, l'IA en génère une. Aucune étape n'est obligatoire.
          </div>
          <Field label="Devise (monnaie)">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
              {currencies.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </Field>
          {products.length === 0 && (
            <p className="text-sm text-gray-500">Aucun produit — le site sera généré sans section produits.</p>
          )}
          <div className="space-y-4">
            {products.map((p, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 flex gap-4 items-start">
                <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xl">🖼</span>}
                </div>
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nom du produit *</label>
                    <input value={p.name} onChange={(e) => updateProduct(i, { name: e.target.value })} className={inputCls} placeholder="Ex : Café Latte" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Prix * (montant seul)</label>
                    <input value={p.price} onChange={(e) => updateProduct(i, { price: e.target.value })} className={inputCls} placeholder="Ex : 4,50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description (optionnel)</label>
                    <input value={p.description || ''} onChange={(e) => updateProduct(i, { description: e.target.value })} className={inputCls} placeholder="Courte description du produit" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3">
                    <label className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs cursor-pointer hover:bg-gray-200">
                      {p.imageUrl ? 'Changer la photo' : 'Photo (optionnel)'}
                      <input type="file" accept="image/*" className="hidden"
                        onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const u = await uploadFile(f); if (u) updateProduct(i, { imageUrl: u }); } }} />
                    </label>
                    {p.imageUrl && <button onClick={() => updateProduct(i, { imageUrl: undefined })} className="text-xs text-gray-500 hover:text-gray-700">Retirer la photo</button>}
                    <button onClick={() => removeProduct(i)} className="ml-auto text-xs text-red-500 hover:text-red-700">Supprimer</button>
                  </div>
                  {!p.imageUrl && (
                    <div className="md:col-span-2">
                      <input value={p.imagePrompt || ''} onChange={(e) => updateProduct(i, { imagePrompt: e.target.value })} className={inputCls} placeholder="Sans photo : décrivez l'image à générer (ex : tajine de poulet aux olives, vue de dessus)" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={addProduct} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
            + Ajouter un produit
          </button>

          <div className="border-t border-gray-100 pt-6">
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input type="checkbox" checked={galleryEnabled} onChange={(e) => setGalleryEnabled(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="font-medium text-gray-800">Ajouter une galerie photos</span>
            </label>
            {galleryEnabled ? (
              <>
                <p className="text-xs text-gray-500 mb-3">Ajoutez 3 photos, ou laissez-les vides — l'IA les générera (décrivez l'image souhaitée si vous voulez).</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {galleryImages.map((g, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                      <div className="w-full h-28 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {g.imageUrl ? <img src={g.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-2xl">🖼</span>}
                      </div>
                      <label className="block text-center px-2 py-1.5 bg-gray-100 text-gray-700 rounded text-xs cursor-pointer hover:bg-gray-200">
                        {g.imageUrl ? 'Changer' : 'Téléverser'}
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const u = await uploadFile(f); if (u) updateGalleryImage(i, { imageUrl: u }); } }} />
                      </label>
                      {g.imageUrl ? (
                        <button onClick={() => updateGalleryImage(i, { imageUrl: undefined })} className="text-xs text-gray-500 hover:text-gray-700 w-full">Retirer</button>
                      ) : (
                        <input value={g.imagePrompt || ''} onChange={(e) => updateGalleryImage(i, { imagePrompt: e.target.value })} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs" placeholder="Décrire l'image (optionnel)" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400">La galerie ne sera pas incluse dans le site.</p>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">← Retour</button>
            <button onClick={() => setStep(3)} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Suivant →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-8">
          <Field label="Langue du site">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {languages.map((l) => (
                <button key={l.code} onClick={() => setLanguage(l.code)} className={`p-3 border-2 rounded-xl text-center ${language === l.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-2xl mb-1">{l.flag}</div>
                  <div className="text-sm font-medium text-gray-800">{l.label}</div>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Template">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((t) => (
                <button key={t.id} onClick={() => setTemplate(t.id)} className={`p-4 border-2 rounded-xl text-center ${template === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-3xl mb-2">{t.preview}</div>
                  <div className="font-medium text-gray-900">{t.name}</div>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Palette de couleurs">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {colorPresets.map((p) => (
                <button key={p.name} onClick={() => setColors(p)} className={`p-3 border-2 rounded-xl ${colors.primary === p.primary ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex gap-1 mb-2">
                    <span className="w-6 h-6 rounded-full" style={{ backgroundColor: p.primary }} />
                    <span className="w-6 h-6 rounded-full" style={{ backgroundColor: p.secondary }} />
                    <span className="w-6 h-6 rounded-full" style={{ backgroundColor: p.accent }} />
                  </div>
                  <div className="text-xs font-medium text-gray-700">{p.name}</div>
                </button>
              ))}
            </div>
          </Field>
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">← Retour</button>
            <button onClick={generate} disabled={loading} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Génération en cours…' : 'Générer le site'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- Editor */

function Editor({ id, onBack }: { id: string; onBack: () => void }) {
  const [site, setSite] = useState<WebsiteResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<'desktop' | 'mobile'>('desktop');
  const [addReq, setAddReq] = useState('');
  const [designReq, setDesignReq] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    api.get<WebsiteResponse>(`/websites/${id}`)
      .then((r) => setSite(r.data))
      .catch(() => toast.error('Impossible de charger le site'));
  }, [id]);

  const mutate = useCallback(async (p: Promise<{ data: WebsiteResponse }>, okMsg?: string) => {
    setBusy(true);
    try {
      const { data } = await p;
      setSite(data);
      if (data.status === 'PUBLISHED') setDirty(true); // edited a live site → needs re-publish
      if (okMsg) toast.success(okMsg);
      return data;
    } catch (e: any) {
      toast.error(e?.message || 'Une erreur est survenue');
    } finally {
      setBusy(false);
    }
  }, []);

  const saveText = (path: string, value: string) => mutate(api.patch<WebsiteResponse>(`/websites/${id}/text`, { path, value }));
  const genImage = (path: string, prompt?: string) => mutate(api.post<WebsiteResponse>(`/websites/${id}/images/generate`, { path, prompt }), 'Image générée');
  const uploadImage = (path: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('path', path);
    return mutate(api.upload<WebsiteResponse>(`/websites/${id}/images/upload`, fd), 'Image téléversée');
  };

  const addSection = async () => {
    if (!addReq.trim()) return;
    await mutate(api.post<WebsiteResponse>(`/websites/${id}/sections`, { request: addReq }), 'Section ajoutée');
    setAddReq('');
  };

  const applyDesign = async () => {
    if (!designReq.trim()) return;
    await mutate(api.post<WebsiteResponse>(`/websites/${id}/design-assist`, { instruction: designReq }), 'Design mis à jour');
    setDesignReq('');
  };

  const publish = async () => {
    setPublishing(true);
    try {
      const res = await api.post<{ publishedUrl: string; status: string; deploymentId?: string }>(`/websites/${id}/publish`);
      setDirty(false);
      toast.success('Publication lancée !');
      // poll status
      const poll = async (n: number) => {
        const { data } = await api.get<{ status: string; url?: string }>(`/websites/${id}/deployment-status`);
        if (data.status === 'READY') {
          const r = await api.get<WebsiteResponse>(`/websites/${id}`);
          setSite(r.data);
          toast.success('Site publié en ligne !');
          return;
        }
        if (n > 0) setTimeout(() => poll(n - 1), 3000);
      };
      poll(20);
      const r = await api.get<WebsiteResponse>(`/websites/${id}`);
      setSite(r.data);
    } catch (e: any) {
      toast.error(e?.message || 'Erreur lors de la publication');
    } finally {
      setPublishing(false);
    }
  };

  const openFullPreview = () => {
    if (!site) return;
    const blob = new Blob([site.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  if (!site) return <p className="text-gray-500">Chargement…</p>;

  const c = site.content;
  const visibleIds = c.sections.map((s) => s.id);

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">← Sites</button>
          <h1 className="text-2xl font-bold text-gray-900">{c.meta.title}</h1>
          <StatusBadge status={site.status} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { if (confirm('Régénérer tout le contenu ? Vos textes actuels seront remplacés (le thème, le logo et les contacts sont conservés).')) mutate(api.post<WebsiteResponse>(`/websites/${id}/regenerate`), 'Contenu régénéré'); }} disabled={busy} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
            ↻ Tout régénérer
          </button>
          <button onClick={publish} disabled={publishing || busy} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
            {publishing ? 'Publication…' : site.status === 'PUBLISHED' ? '↑ Mettre à jour' : '🚀 Publier'}
          </button>
        </div>
      </div>

      {site.status === 'PUBLISHED' && site.vercelUrl && (
        <a href={site.vercelUrl} target="_blank" rel="noreferrer" className="inline-block mb-4 text-sm text-green-700 font-mono hover:underline">
          🌍 {site.vercelUrl}
        </a>
      )}

      {site.status === 'PUBLISHED' && dirty && (
        <div className="mb-4 flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <span>⚠️ Modifications non publiées — elles ne sont pas encore visibles sur le site en ligne.</span>
          <button onClick={publish} disabled={publishing} className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-semibold hover:bg-amber-700 disabled:opacity-50 whitespace-nowrap">
            {publishing ? 'Publication…' : 'Mettre à jour le site'}
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ---- Left: editor ---- */}
        <div className="space-y-4">
          {/* Logo + theme */}
          <Panel title="Logo & style">
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Logo</p>
              <ImageSlot
                url={c.logo.type === 'image' ? c.logo.imageUrl : undefined}
                onUpload={(f) => uploadImage('logo.imageUrl', f)}
                onGenerate={() => genImage('logo.imageUrl', `logo for ${c.meta.title}`)}
                onReset={c.logo.type === 'image' ? () => mutate(api.post<WebsiteResponse>(`/websites/${id}/logo/reset`), 'Logo réinitialisé') : undefined}
                emptyLabel={`Texte : « ${c.logo.text} » (aucune image = logo texte auto)`}
                busy={busy}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {(['primaryColor', 'secondaryColor', 'accentColor'] as const).map((k) => (
                <label key={k} className="text-xs text-gray-500">
                  {k === 'primaryColor' ? 'Primaire' : k === 'secondaryColor' ? 'Secondaire' : 'Accent'}
                  <input type="color" value={c.theme[k]} onChange={(e) => mutate(api.patch<WebsiteResponse>(`/websites/${id}/theme`, { [k]: e.target.value }))} className="mt-1 w-full h-9 rounded cursor-pointer border border-gray-200" />
                </label>
              ))}
            </div>
            <p className="text-xs font-medium text-gray-500 mb-2">Design (aucune régénération, gratuit)</p>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
              <label>Arrondis
                <select value={c.theme.radius || 'large'} onChange={(e) => mutate(api.patch<WebsiteResponse>(`/websites/${id}/theme`, { radius: e.target.value }))} className={selCls}>
                  <option value="none">Aucun</option><option value="small">Petit</option><option value="medium">Moyen</option><option value="large">Grand</option><option value="full">Très arrondi</option>
                </select>
              </label>
              <label>Boutons
                <select value={c.theme.buttonStyle || 'pill'} onChange={(e) => mutate(api.patch<WebsiteResponse>(`/websites/${id}/theme`, { buttonStyle: e.target.value }))} className={selCls}>
                  <option value="pill">Arrondis (pilule)</option><option value="rounded">Semi-arrondis</option><option value="square">Carrés</option>
                </select>
              </label>
              <label>Police
                <select value={c.theme.fontFamily || 'Inter'} onChange={(e) => mutate(api.patch<WebsiteResponse>(`/websites/${id}/theme`, { fontFamily: e.target.value }))} className={selCls}>
                  {['Inter', 'Poppins', 'Montserrat', 'Playfair Display', 'Roboto', 'Lora'].map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 mt-5">
                <input type="checkbox" checked={c.theme.animations !== false} onChange={(e) => mutate(api.patch<WebsiteResponse>(`/websites/${id}/theme`, { animations: e.target.checked }))} className="w-4 h-4" />
                <span>Animations</span>
              </label>
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Assistant design (décrivez le changement)</p>
              <div className="flex gap-2">
                <input value={designReq} onChange={(e) => setDesignReq(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyDesign()} className={`${inputCls} flex-1`} placeholder="Ex : coins plus arrondis, couleurs plus chaudes, boutons carrés…" />
                <button onClick={applyDesign} disabled={busy || !designReq.trim()} className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50">Appliquer</button>
              </div>
            </div>
          </Panel>

          {/* Sections */}
          {c.sections.map((section, i) => (
            <SectionCard
              key={section.id}
              section={section}
              index={i}
              total={c.sections.length}
              busy={busy}
              onText={saveText}
              onGenImage={genImage}
              onUploadImage={uploadImage}
              onRegenerate={() => mutate(api.post<WebsiteResponse>(`/websites/${id}/sections/${section.id}/regenerate`), 'Section régénérée')}
              onDelete={() => { if (confirm('Supprimer cette section ?')) mutate(api.del<WebsiteResponse>(`/websites/${id}/sections/${section.id}`), 'Section supprimée'); }}
              onToggle={(v) => mutate(api.patch<WebsiteResponse>(`/websites/${id}/sections/${section.id}/visibility`, { visible: v }))}
              onAddItem={() => mutate(api.post<WebsiteResponse>(`/websites/${id}/sections/${section.id}/items`), 'Élément ajouté')}
              onRemoveItem={(idx) => mutate(api.del<WebsiteResponse>(`/websites/${id}/sections/${section.id}/items/${idx}`), 'Élément supprimé')}
              onAddGalleryImage={() => mutate(api.post<WebsiteResponse>(`/websites/${id}/sections/${section.id}/gallery-image`), 'Image ajoutée')}
              onMove={(dir) => {
                const order = [...visibleIds];
                const j = i + dir;
                if (j < 0 || j >= order.length) return;
                [order[i], order[j]] = [order[j], order[i]];
                mutate(api.patch<WebsiteResponse>(`/websites/${id}/sections/reorder`, { order }));
              }}
            />
          ))}

          {/* Add section via AI */}
          <Panel title="Ajouter une section (IA)">
            <p className="text-xs text-gray-500 mb-2">Décrivez la section à ajouter, l'IA la génère (statique).</p>
            <div className="flex gap-2">
              <input value={addReq} onChange={(e) => setAddReq(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSection())} className={`${inputCls} flex-1`} placeholder="Ex : une section FAQ, une section équipe…" />
              <button onClick={addSection} disabled={busy || !addReq.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                Ajouter
              </button>
            </div>
          </Panel>
        </div>

        {/* ---- Right: live preview ---- */}
        <div className="lg:sticky lg:top-6 self-start">
          <div className="flex items-center justify-between mb-3 gap-2">
            <h3 className="text-sm font-semibold text-gray-700">Aperçu en direct</h3>
            <div className="flex items-center gap-2">
              <button onClick={openFullPreview} title="Ouvrir en plein écran dans un nouvel onglet" className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                Plein écran
              </button>
              <div className="flex p-1 bg-gray-100 rounded-lg">
                {(['desktop', 'mobile'] as const).map((m) => (
                  <button key={m} onClick={() => setPreview(m)} className={`px-3 py-1.5 text-xs font-medium rounded-md ${preview === m ? 'bg-white shadow-sm text-blue-700' : 'text-gray-500'}`}>
                    {m === 'desktop' ? 'Desktop' : 'Mobile'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-xl p-3 flex justify-center">
            <div className={`bg-white rounded-lg overflow-hidden border border-gray-300 transition-all ${preview === 'mobile' ? 'w-[375px]' : 'w-full'}`} style={{ height: '75vh' }}>
              <iframe srcDoc={site.html} className="w-full h-full border-0" title="Aperçu" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* --------------------------------------------------------- Section card */

function SectionCard({
  section, index, total, busy, onText, onGenImage, onUploadImage, onRegenerate, onDelete, onToggle, onMove,
  onAddItem, onRemoveItem, onAddGalleryImage,
}: {
  section: WebsiteSection; index: number; total: number; busy: boolean;
  onText: (path: string, v: string) => void;
  onGenImage: (path: string, prompt?: string) => void;
  onUploadImage: (path: string, f: File) => void;
  onRegenerate: () => void; onDelete: () => void; onToggle: (v: boolean) => void; onMove: (dir: number) => void;
  onAddItem: () => void; onRemoveItem: (idx: number) => void; onAddGalleryImage: () => void;
}) {
  const base = `sections.${section.id}.data`;
  const d = section.data;
  const canHaveItems = ['custom', 'products', 'services', 'faq', 'testimonials'].includes(section.type) || Array.isArray(d.items);
  const canHaveImage = ['hero', 'about', 'custom'].includes(section.type) || 'imageUrl' in d || d.imagePrompt;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${section.visible ? '' : 'opacity-60'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{sectionLabels[section.type] || section.type}</h3>
        <div className="flex items-center gap-1">
          <IconBtn title="Monter" onClick={() => onMove(-1)} disabled={busy || index === 0}>↑</IconBtn>
          <IconBtn title="Descendre" onClick={() => onMove(1)} disabled={busy || index === total - 1}>↓</IconBtn>
          <IconBtn title="Régénérer" onClick={onRegenerate} disabled={busy}>↻</IconBtn>
          <IconBtn title={section.visible ? 'Masquer' : 'Afficher'} onClick={() => onToggle(!section.visible)} disabled={busy}>{section.visible ? '👁' : '🚫'}</IconBtn>
          <IconBtn title="Supprimer" onClick={onDelete} disabled={busy}>🗑</IconBtn>
        </div>
      </div>

      <div className="space-y-3">
        {/* simple string fields */}
        {STRING_KEYS.filter((k) => typeof d[k] === 'string').map((k) => (
          <EditableField key={k} label={fieldLabels[k]} value={d[k]} multiline={k === 'description' || k === 'body'} onSave={(v) => onText(`${base}.${k}`, v)} />
        ))}

        {/* main image slot */}
        {canHaveImage && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Image</p>
            <ImageSlot url={d.imageUrl} busy={busy}
              onUpload={(f) => onUploadImage(`${base}.imageUrl`, f)}
              onGenerate={() => onGenImage(`${base}.imageUrl`, d.imagePrompt)} />
          </div>
        )}

        {/* gallery images */}
        {Array.isArray(d.images) && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Galerie</p>
            <div className="grid grid-cols-2 gap-2">
              {d.images.map((url: string, i: number) => (
                <ImageSlot key={i} url={url} compact busy={busy}
                  onUpload={(f) => onUploadImage(`${base}.images.${i}`, f)}
                  onGenerate={() => onGenImage(`${base}.images.${i}`, d.imagePrompt)} />
              ))}
            </div>
            <button onClick={onAddGalleryImage} disabled={busy} className="mt-2 text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50">+ Ajouter une image</button>
          </div>
        )}

        {/* arrays of objects: items / stats */}
        {(['items', 'stats'] as const).map((arrKey) =>
          Array.isArray(d[arrKey]) ? (
            <div key={arrKey} className="space-y-2">
              <p className="text-xs font-medium text-gray-500">{arrKey === 'items' ? 'Éléments' : 'Statistiques'}</p>
              {d[arrKey].map((it: any, i: number) => (
                <div key={i} className="relative border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50">
                  {arrKey === 'items' && (
                    <button onClick={() => onRemoveItem(i)} disabled={busy} title="Supprimer l'élément" className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-sm">✕</button>
                  )}
                  {'imageUrl' in it && (
                    <ImageSlot url={it.imageUrl} compact busy={busy}
                      onUpload={(f) => onUploadImage(`${base}.${arrKey}.${i}.imageUrl`, f)}
                      onGenerate={() => onGenImage(`${base}.${arrKey}.${i}.imageUrl`, `${it.name || ''}`)} />
                  )}
                  {Object.keys(it).filter((f) => typeof it[f] === 'string' && !HIDDEN_KEYS.includes(f)).map((f) => (
                    <EditableField key={f} label={fieldLabels[f] || f} value={it[f]} compact onSave={(v) => onText(`${base}.${arrKey}.${i}.${f}`, v)} />
                  ))}
                </div>
              ))}
            </div>
          ) : null,
        )}

        {canHaveItems && (
          <button onClick={onAddItem} disabled={busy} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 font-medium">
            + Ajouter un élément (nom, prix, image…)
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- small pieces */

function EditableField({ label, value, onSave, multiline, compact }: {
  label: string; value: string; onSave: (v: string) => void; multiline?: boolean; compact?: boolean;
}) {
  const [val, setVal] = useState(value);
  useEffect(() => setVal(value), [value]);
  const commit = () => { if (val !== value) onSave(val); };
  return (
    <label className="block">
      <span className={`block text-gray-500 mb-1 ${compact ? 'text-[11px]' : 'text-xs font-medium'}`}>{label}</span>
      {multiline ? (
        <textarea value={val} onChange={(e) => setVal(e.target.value)} onBlur={commit} rows={3} className={inputCls} />
      ) : (
        <input value={val} onChange={(e) => setVal(e.target.value)} onBlur={commit} className={inputCls} />
      )}
    </label>
  );
}

function ImageSlot({ url, onUpload, onGenerate, onReset, busy, compact, emptyLabel }: {
  url?: string; onUpload: (f: File) => void; onGenerate: () => void; onReset?: () => void;
  busy?: boolean; compact?: boolean; emptyLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 ${compact ? 'w-14 h-14' : 'w-20 h-20'}`}>
        {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xl">🖼</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        {emptyLabel && !url && <span className="text-[11px] text-gray-400">{emptyLabel}</span>}
        <div className="flex gap-1.5 flex-wrap">
          <label className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 cursor-pointer">
            Téléverser
            <input type="file" accept="image/*" className="hidden" disabled={busy}
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
          </label>
          <button onClick={onGenerate} disabled={busy} className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium hover:bg-purple-200 disabled:opacity-50">
            Générer IA
          </button>
          {onReset && <button onClick={onReset} disabled={busy} className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded text-xs hover:bg-gray-200">Retirer</button>}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function IconBtn({ children, onClick, disabled, title }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; title: string }) {
  return (
    <button title={title} onClick={onClick} disabled={disabled} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-sm disabled:opacity-30">
      {children}
    </button>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
const selCls = 'mt-1 w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500';
