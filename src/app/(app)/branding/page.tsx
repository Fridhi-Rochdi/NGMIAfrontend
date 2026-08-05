"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { DownloadIcon, PaletteIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { useBrandStore } from '@/lib/store/brand-store';

function tenantSlug() {
  try { return JSON.parse(localStorage.getItem('user') || '{}')?.tenant?.slug || ''; } catch { return ''; }
}

function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function BrandingLibraryPage() {
  const { savedBrands, fetchBrands, deleteBrand, loading } = useBrandStore();
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError('');
    try { await fetchBrands(); } catch { setError('Impossible de charger vos identités de marque.'); }
  }, [fetchBrands]);

  useEffect(() => { void load(); }, [load]);

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer définitivement la marque « ${name} » ?`)) return;
    setDeletingId(id);
    try { await deleteBrand(id); } catch { setError('La suppression de la marque a échoué.'); }
    finally { setDeletingId(null); }
  };

  const downloadLogo = async (id: string, name: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/branding/${id}/logo/download?format=png`, {
        headers: { Authorization: `Bearer ${token}`, 'X-Tenant-Slug': tenantSlug() },
      });
      if (!response.ok) throw new Error('download failed');
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `logo-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError('Le téléchargement du logo a échoué.'); }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col gap-5 rounded-[28px] bg-violet-950 px-6 py-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">Bibliothèque de marque</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Toutes vos identités</h1>
          <p className="mt-2 text-sm text-white/60">{savedBrands.length} marque{savedBrands.length === 1 ? '' : 's'} enregistrée{savedBrands.length === 1 ? '' : 's'}</p>
        </div>
        <Link href="/branding/create" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-violet-950 transition hover:bg-violet-50"><PlusIcon className="mr-2 h-5 w-5" />Créer une nouvelle identité</Link>
      </header>

      {error && <Alert variant="destructive"><AlertDescription className="flex items-center justify-between gap-3"><span>{error}</span><Button size="sm" variant="outline" onClick={() => void load()}>Réessayer</Button></AlertDescription></Alert>}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? <div className="space-y-3 p-6">{[1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-gray-100" />)}</div>
          : savedBrands.length === 0 ? <div className="flex flex-col items-center px-6 py-20 text-center"><div className="rounded-2xl bg-violet-50 p-4 text-violet-700"><PaletteIcon className="h-8 w-8" /></div><h2 className="mt-5 text-xl font-semibold">Aucune identité créée</h2><p className="mt-2 text-sm text-gray-500">Créez votre première stratégie de marque et son logo.</p><Link href="/branding/create" className="mt-6 rounded-xl bg-violet-700 px-5 py-2.5 font-medium text-white hover:bg-violet-800">Créer mon identité</Link></div>
          : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase tracking-wider text-gray-500"><tr><th className="px-6 py-4">Marque</th><th className="px-6 py-4">Secteur</th><th className="px-6 py-4">Palette</th><th className="px-6 py-4">Typographie</th><th className="px-6 py-4">Créée le</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{savedBrands.map((brand) => <tr key={brand.id} className="transition hover:bg-gray-50/80">
              <td className="px-6 py-4"><div className="flex items-center gap-3">{brand.logo ? <img src={brand.logo} alt="" className="h-14 w-14 rounded-xl border bg-white object-contain p-1" /> : <div className="grid h-14 w-14 place-items-center rounded-xl bg-gray-100"><PaletteIcon className="h-5 w-5 text-gray-400" /></div>}<div><p className="font-semibold text-gray-900">{brand.name}</p><p className="mt-1 text-xs italic text-gray-500">{brand.tagline || 'Sans signature'}</p></div></div></td>
              <td className="px-6 py-4 capitalize text-gray-600">{brand.industry || '—'}</td>
              <td className="px-6 py-4"><div className="flex gap-1">{[brand.primaryColor, brand.secondaryColor, brand.accentColor].filter(Boolean).map((color) => <span key={color} title={color} className="h-7 w-7 rounded-full border border-black/5" style={{ backgroundColor: color }} />)}</div></td>
              <td className="px-6 py-4 text-gray-600">{brand.fontFamily?.split(',')[0] || '—'}</td>
              <td className="px-6 py-4 text-gray-600">{formatDate(brand.createdAt)}</td>
              <td className="px-6 py-4"><div className="flex justify-end gap-1">{brand.logo && <Button variant="ghost" size="icon" title="Télécharger le logo" aria-label={`Télécharger ${brand.name}`} onClick={() => void downloadLogo(brand.id, brand.name)}><DownloadIcon className="h-4 w-4" /></Button>}<Button variant="ghost" size="icon" title="Supprimer" aria-label={`Supprimer ${brand.name}`} disabled={deletingId === brand.id} onClick={() => void remove(brand.id, brand.name)}><TrashIcon className="h-4 w-4 text-red-600" /></Button></div></td>
            </tr>)}</tbody>
          </table></div>}
      </section>
    </div>
  );
}
