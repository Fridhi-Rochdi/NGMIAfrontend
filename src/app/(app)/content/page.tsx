"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CopyIcon, MessageSquareIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { useContentStore } from '@/lib/store/content-store';

const typeLabels: Record<string, string> = {
  POST: 'Publication sociale', BLOG: 'Article', AD: 'Publicité', EMAIL: 'E-mail',
  SLOGAN: 'Slogan', DESCRIPTION: 'Description',
};

function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function ContentLibraryPage() {
  const { generatedContents, loading, fetchContents, deleteContent } = useContentStore();
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError('');
    try { await fetchContents(); } catch { setError('Impossible de charger vos contenus.'); }
  }, [fetchContents]);

  useEffect(() => { void load(); }, [load]);

  const copy = async (id: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const remove = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer définitivement « ${title} » ?`)) return;
    setDeletingId(id);
    try { await deleteContent(id); } catch { setError('La suppression du contenu a échoué.'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col gap-5 rounded-[28px] bg-indigo-950 px-6 py-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">Bibliothèque éditoriale</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tous vos contenus</h1>
          <p className="mt-2 text-sm text-white/60">{generatedContents.length} contenu{generatedContents.length === 1 ? '' : 's'} généré{generatedContents.length === 1 ? '' : 's'}</p>
        </div>
        <Link href="/content/create" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-indigo-950 transition hover:bg-indigo-50">
          <PlusIcon className="mr-2 h-5 w-5" />Créer un nouveau contenu
        </Link>
      </header>

      {error && <Alert variant="destructive"><AlertDescription className="flex items-center justify-between gap-3"><span>{error}</span><Button size="sm" variant="outline" onClick={() => void load()}>Réessayer</Button></AlertDescription></Alert>}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : generatedContents.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-700"><MessageSquareIcon className="h-8 w-8" /></div>
            <h2 className="mt-5 text-xl font-semibold">Aucun contenu généré</h2>
            <p className="mt-2 text-sm text-gray-500">Créez votre première publication, publicité, description ou campagne e-mail.</p>
            <Link href="/content/create" className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700">Créer mon premier contenu</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase tracking-wider text-gray-500"><tr><th className="px-6 py-4">Contenu</th><th className="px-6 py-4">Format</th><th className="px-6 py-4">Ton</th><th className="px-6 py-4">Longueur</th><th className="px-6 py-4">Statut</th><th className="px-6 py-4">Créé le</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {generatedContents.map((item) => (
                  <tr key={item.id} className="align-top transition hover:bg-gray-50/80">
                    <td className="max-w-md px-6 py-4"><p className="font-semibold text-gray-900">{item.title}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{item.body || item.prompt}</p></td>
                    <td className="px-6 py-4 text-gray-600">{typeLabels[item.type] || item.type}</td>
                    <td className="px-6 py-4 capitalize text-gray-600">{item.tone}</td>
                    <td className="px-6 py-4 text-gray-600">{item.length}</td>
                    <td className="px-6 py-4"><Badge variant={item.status === 'PUBLISHED' ? 'success' : item.status === 'GENERATED' ? 'info' : 'warning'}>{item.status}</Badge></td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Copier" aria-label={`Copier ${item.title}`} onClick={() => void copy(item.id, item.body || '')}><CopyIcon className={`h-4 w-4 ${copiedId === item.id ? 'text-green-600' : ''}`} /></Button>
                      <Button variant="ghost" size="icon" title="Supprimer" aria-label={`Supprimer ${item.title}`} disabled={deletingId === item.id} onClick={() => void remove(item.id, item.title)}><TrashIcon className="h-4 w-4 text-red-600" /></Button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
