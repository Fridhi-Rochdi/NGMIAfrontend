'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { WebsiteSummary } from '@/types/website';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GlobeIcon, PlusIcon } from '@/components/icons';

const statusLabels = { DRAFT: 'Brouillon', PUBLISHED: 'Publié', ARCHIVED: 'Archivé' } as const;
const statusVariants = { DRAFT: 'warning', PUBLISHED: 'success', ARCHIVED: 'secondary' } as const;

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function WebsitesPage() {
  const [sites, setSites] = useState<WebsiteSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWebsites = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get<WebsiteSummary[]>('/websites');
      setSites(response.data || []);
    } catch {
      setError('Impossible de charger vos sites web. Vérifiez la connexion au backend.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWebsites();
  }, [loadWebsites]);

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col gap-5 rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">Bibliothèque</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tous vos sites web</h1>
          <p className="mt-2 text-sm text-white/60">{sites.length} site{sites.length === 1 ? '' : 's'} généré{sites.length === 1 ? '' : 's'}</p>
        </div>
        <Link href="/websites/create" className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
          <PlusIcon className="mr-2 h-5 w-5" />
          Créer un nouveau site
        </Link>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => void loadWebsites()}>Réessayer</Button>
          </AlertDescription>
        </Alert>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}
          </div>
        ) : sites.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="rounded-2xl bg-cyan-50 p-4 text-cyan-700"><GlobeIcon className="h-8 w-8" /></div>
            <h2 className="mt-5 text-xl font-semibold text-gray-900">Aucun site généré</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500">Créez votre premier site avec le studio IA. Il apparaîtra ensuite dans ce tableau.</p>
            <Link href="/websites/create" className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 font-medium text-white hover:bg-primary-700">Créer mon premier site</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Site</th>
                  <th className="px-6 py-4 font-semibold">Sous-domaine</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Déploiement</th>
                  <th className="px-6 py-4 font-semibold">Dernière modification</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sites.map((site) => {
                  const publicUrl = site.vercelUrl || site.previewUrl;
                  return (
                    <tr key={site.id} className="transition hover:bg-gray-50/80">
                      <td className="px-6 py-4"><p className="font-semibold text-gray-900">{site.businessName}</p><p className="mt-1 text-xs text-gray-500">ID : {site.id.slice(0, 8)}</p></td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">{site.subdomain || '—'}</td>
                      <td className="px-6 py-4"><Badge variant={statusVariants[site.status]}>{statusLabels[site.status]}</Badge></td>
                      <td className="px-6 py-4 text-gray-600">{site.deploymentStatus || (site.status === 'PUBLISHED' ? 'Déployé' : 'Non déployé')}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(site.updatedAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/websites/create?edit=${site.id}`} className="rounded-lg border border-cyan-700 px-3 py-2 text-xs font-semibold text-cyan-800 hover:bg-cyan-50">Modifier</Link>
                          {publicUrl && <a href={publicUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100">Voir</a>}
                        </div>
                      </td>
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
