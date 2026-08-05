"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { MenuIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { del, get } from '@/lib/api';

interface MenuRecord {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  categories?: Array<{ items?: unknown[] }>;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  slug?: string;
  vercelUrl?: string;
  createdAt?: string;
  html?: string;
}

const statusLabels = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
  ARCHIVED: 'Archivé',
} as const;

const statusVariants = {
  DRAFT: 'warning',
  PUBLISHED: 'success',
  ARCHIVED: 'secondary',
} as const;

function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchMenus = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await get<MenuRecord[]>('/menus');
      setMenus(response.data);
    } catch {
      setError('Impossible de charger vos menus. Vérifiez la connexion au backend.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMenus();
  }, [fetchMenus]);

  const removeMenu = async (menu: MenuRecord) => {
    if (!window.confirm(`Supprimer définitivement « ${menu.name} » ?`)) return;
    setDeletingId(menu.id);
    setError('');
    try {
      await del(`/menus/${menu.id}`);
      setMenus((current) => current.filter((item) => item.id !== menu.id));
    } catch {
      setError('La suppression du menu a échoué.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col gap-5 rounded-[28px] bg-[#101713] px-6 py-7 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8a94b]">Bibliothèque</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tous vos menus</h1>
          <p className="mt-2 text-sm text-white/60">{menus.length} création{menus.length === 1 ? '' : 's'} enregistrée{menus.length === 1 ? '' : 's'}</p>
        </div>
        <Link href="/menu/create" className="inline-flex items-center justify-center rounded-xl bg-[#d8a94b] px-5 py-3 font-semibold text-[#101713] transition hover:bg-[#e5bb66]">
          <PlusIcon className="mr-2 h-5 w-5" />
          Créer un nouveau menu
        </Link>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => void fetchMenus()}>Réessayer</Button>
          </AlertDescription>
        </Alert>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}
          </div>
        ) : menus.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800"><MenuIcon className="h-8 w-8" /></div>
            <h2 className="mt-5 text-xl font-semibold text-gray-900">Aucun menu généré</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500">Créez votre premier menu avec le studio IA. Il apparaîtra ensuite dans ce tableau.</p>
            <Link href="/menu/create" className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 font-medium text-white hover:bg-primary-700">Créer mon premier menu</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Menu</th>
                  <th className="px-6 py-4 font-semibold">Catégorie</th>
                  <th className="px-6 py-4 font-semibold">Contenu</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold">Créé le</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menus.map((menu) => {
                  const itemCount = menu.categories?.reduce((total, category) => total + (category.items?.length || 0), 0) || 0;
                  const pageCount = (menu.html?.match(/\bdata-menu-page\s*=/gi) || []).length || 1;
                  const publicUrl = menu.vercelUrl || (menu.slug ? `/menu/${menu.slug}` : '');
                  return (
                    <tr key={menu.id} className="transition hover:bg-gray-50/80">
                      <td className="px-6 py-4"><p className="font-semibold text-gray-900">{menu.name}</p><p className="mt-1 text-xs text-gray-500">{menu.businessName}</p></td>
                      <td className="px-6 py-4 text-gray-600">{menu.businessType.replaceAll('_', ' ')}</td>
                      <td className="px-6 py-4 text-gray-600">{menu.categories?.length || 0} sections · {itemCount} articles · {pageCount} page{pageCount > 1 ? 's' : ''}</td>
                      <td className="px-6 py-4"><Badge variant={statusVariants[menu.status]}>{statusLabels[menu.status]}</Badge></td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(menu.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/menu/create?edit=${menu.id}`} className="rounded-lg border border-emerald-700 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">Modifier</Link>
                          {publicUrl && <Link href={publicUrl} target={publicUrl.startsWith('http') ? '_blank' : undefined} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100">Voir</Link>}
                          <Button variant="ghost" size="icon" aria-label={`Supprimer ${menu.name}`} title="Supprimer" disabled={deletingId === menu.id} onClick={() => void removeMenu(menu)}>
                            <TrashIcon className="h-4 w-4 text-red-600" />
                          </Button>
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
