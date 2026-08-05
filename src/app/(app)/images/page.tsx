"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DownloadIcon, ImageIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { useImagesStore } from '@/lib/store/images-store';

function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function ImagesLibraryPage() {
  const { generatedImages, loading, fetchImages, deleteImage } = useImagesStore();
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError('');
    try { await fetchImages(); } catch { setError('Impossible de charger vos images.'); }
  }, [fetchImages]);

  useEffect(() => { void load(); }, [load]);

  const remove = async (id: string) => {
    if (!window.confirm('Supprimer définitivement cette image ?')) return;
    setDeletingId(id);
    try { await deleteImage(id); } catch { setError('La suppression de l’image a échoué.'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col gap-5 rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Bibliothèque visuelle</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Toutes vos images</h1>
          <p className="mt-2 text-sm text-white/60">{generatedImages.length} image{generatedImages.length === 1 ? '' : 's'} générée{generatedImages.length === 1 ? '' : 's'}</p>
        </div>
        <Link href="/images/create" className="inline-flex items-center justify-center rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200">
          <PlusIcon className="mr-2 h-5 w-5" />Créer une nouvelle image
        </Link>
      </header>

      {error && <Alert variant="destructive"><AlertDescription className="flex items-center justify-between gap-3"><span>{error}</span><Button size="sm" variant="outline" onClick={() => void load()}>Réessayer</Button></AlertDescription></Alert>}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">{[1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : generatedImages.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="rounded-2xl bg-cyan-50 p-4 text-cyan-700"><ImageIcon className="h-8 w-8" /></div>
            <h2 className="mt-5 text-xl font-semibold">Aucune image générée</h2>
            <p className="mt-2 text-sm text-gray-500">Créez votre premier visuel marketing avec le studio IA.</p>
            <Link href="/images/create" className="mt-6 rounded-xl bg-slate-950 px-5 py-2.5 font-medium text-white hover:bg-slate-800">Créer ma première image</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase tracking-wider text-gray-500"><tr><th className="px-6 py-4">Aperçu</th><th className="px-6 py-4">Business</th><th className="px-6 py-4">Template</th><th className="px-6 py-4">Style</th><th className="px-6 py-4">Statut</th><th className="px-6 py-4">Créée le</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {generatedImages.map((item) => {
                  const imageUrl = item.url || item.imageUrl;
                  return <tr key={item.id} className="transition hover:bg-gray-50/80">
                    <td className="px-6 py-3">{imageUrl ? <img src={imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" /> : <div className="grid h-16 w-16 place-items-center rounded-xl bg-gray-100"><ImageIcon className="h-5 w-5 text-gray-400" /></div>}</td>
                    <td className="px-6 py-4">
                      {item.businessName ? (
                        <div>
                          <p className="font-medium text-gray-900">{item.businessName}</p>
                          <p className="text-xs text-gray-500">{item.businessType}</p>
                        </div>
                      ) : (
                        <p className="max-w-[200px] truncate text-gray-700">{item.prompt}</p>
                      )}
                    </td>
                    <td className="px-6 py-4"><Badge variant="secondary" className="capitalize">{item.template || '—'}</Badge></td>
                    <td className="px-6 py-4 capitalize text-gray-600">{item.style || '—'}</td>
                    <td className="px-6 py-4"><Badge variant={item.status === 'COMPLETED' ? 'success' : item.status === 'FAILED' ? 'error' : 'warning'}>{item.status}</Badge></td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-1">
                      {imageUrl && <a href={imageUrl} download className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100" title="Télécharger"><DownloadIcon className="h-4 w-4" /></a>}
                      <Button variant="ghost" size="icon" title="Supprimer" aria-label="Supprimer l’image" disabled={deletingId === item.id} onClick={() => void remove(item.id)}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
