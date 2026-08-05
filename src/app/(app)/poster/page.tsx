"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { ImageIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { del, get } from '@/lib/api';

interface PosterRecord {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  title?: string;
  size: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  slug?: string;
  vercelUrl?: string;
  createdAt?: string;
}

const statusLabels = { DRAFT: 'Brouillon', PUBLISHED: 'Publié', ARCHIVED: 'Archivé' } as const;
const statusVariants = { DRAFT: 'warning', PUBLISHED: 'success', ARCHIVED: 'secondary' } as const;

function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function PostersPage() {
  const [posters, setPosters] = useState<PosterRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchPosters = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await get<PosterRecord[]>('/posters');
      setPosters(response.data);
    } catch {
      setError('Impossible de charger vos posters. Vérifiez la connexion au backend.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosters();
  }, [fetchPosters]);

  const removePoster = async (poster: PosterRecord) => {
    if (!window.confirm(`Supprimer définitivement « ${poster.name} » ?`)) return;
    setDeletingId(poster.id);
    setError('');
    try {
      await del(`/posters/${poster.id}`);
      setPosters((current) => current.filter((item) => item.id !== poster.id));
    } catch {
      setError('La suppression du poster a échoué.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col gap-5 rounded-[28px] bg-gray-950 px-6 py-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">Bibliothèque</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tous vos posters</h1>
          <p className="mt-2 text-sm text-white/60">{posters.length} création{posters.length === 1 ? '' : 's'} enregistrée{posters.length === 1 ? '' : 's'}</p>
        </div>
        <Link href="/poster/create" className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-semibold text-gray-950 transition hover:bg-amber-300">
          <PlusIcon className="mr-2 h-5 w-5" />
          Créer un nouveau poster
        </Link>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between gap-4"><span>{error}</span><Button variant="outline" size="sm" onClick={() => void fetchPosters()}>Réessayer</Button></AlertDescription>
        </Alert>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="space-y-3 p-6">{[1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : posters.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-700"><ImageIcon className="h-8 w-8" /></div>
            <h2 className="mt-5 text-xl font-semibold text-gray-900">Aucun poster généré</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500">Créez votre premier poster avec le studio IA. Il apparaîtra ensuite dans ce tableau.</p>
            <Link href="/poster/create" className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 font-medium text-white hover:bg-primary-700">Créer mon premier poster</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr><th className="px-6 py-4 font-semibold">Poster</th><th className="px-6 py-4 font-semibold">Catégorie</th><th className="px-6 py-4 font-semibold">Format</th><th className="px-6 py-4 font-semibold">Statut</th><th className="px-6 py-4 font-semibold">Créé le</th><th className="px-6 py-4 text-right font-semibold">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posters.map((poster) => {
                  const publicUrl = poster.vercelUrl || (poster.slug ? `/poster/${poster.slug}` : '');
                  return (
                    <tr key={poster.id} className="transition hover:bg-gray-50/80">
                      <td className="px-6 py-4"><p className="font-semibold text-gray-900">{poster.name}</p><p className="mt-1 text-xs text-gray-500">{poster.businessName}{poster.title ? ` · ${poster.title}` : ''}</p></td>
                      <td className="px-6 py-4 text-gray-600">{poster.businessType.replaceAll('_', ' ')}</td>
                      <td className="px-6 py-4 text-gray-600">{poster.size}</td>
                      <td className="px-6 py-4"><Badge variant={statusVariants[poster.status]}>{statusLabels[poster.status]}</Badge></td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(poster.createdAt)}</td>
                      <td className="px-6 py-4"><div className="flex items-center justify-end gap-2">
                        <Link href={`/poster/create?edit=${poster.id}`} className="rounded-lg border border-amber-600 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">Modifier</Link>
                        {publicUrl && <Link href={publicUrl} target={publicUrl.startsWith('http') ? '_blank' : undefined} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100">Voir</Link>}
                        <Button variant="ghost" size="icon" aria-label={`Supprimer ${poster.name}`} title="Supprimer" disabled={deletingId === poster.id} onClick={() => void removePoster(poster)}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
