'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import {
  CalendarIcon,
  ChartBarIcon,
  GlobeIcon,
  ImageIcon,
  MessageSquareIcon,
  RefreshIcon,
  SparklesIcon,
  UsersIcon,
} from '@/components/icons';
import { useDashboardStore } from '@/lib/store/dashboard-store';

const resourceLinks = [
  { key: 'brands', label: 'Marques', href: '/branding' },
  { key: 'images', label: 'Images', href: '/images' },
  { key: 'calendars', label: 'Calendriers', href: '/planner' },
  { key: 'websites', label: 'Sites web', href: '/websites' },
  { key: 'menus', label: 'Menus', href: '/menu' },
  { key: 'posters', label: 'Affiches', href: '/poster' },
] as const;

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const { data, loading, error, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const stats = data?.stats;
  const maxAnalytics = Math.max(
    1,
    ...(data?.analytics.flatMap((item) => [item.content, item.images]) ?? [1]),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {data?.workspace.plan && (
              <Badge variant="secondary">{data.workspace.plan}</Badge>
            )}
          </div>
          <p className="text-gray-600">
            {data?.workspace.name
              ? `Vue d’ensemble de ${data.workspace.name}`
              : 'Pilotez votre activité marketing depuis un seul endroit.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => void fetchDashboard(true)}
          >
            <RefreshIcon
              className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            Actualiser
          </Button>
          <Button onClick={() => router.push('/content')}>
            <SparklesIcon className="mr-2 h-4 w-4" />
            Générer du contenu
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void fetchDashboard(true)}
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading && !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Contenus générés"
              value={stats?.totalContent ?? 0}
              change={stats?.changes.content ?? 0}
              icon={<MessageSquareIcon className="h-5 w-5" />}
              onClick={() => router.push('/content')}
            />
            <StatCard
              label="Comptes actifs"
              value={stats?.activeAccounts ?? 0}
              change={stats?.changes.accounts ?? 0}
              icon={<UsersIcon className="h-5 w-5" />}
              onClick={() => router.push('/social')}
            />
            <StatCard
              label="Publications planifiées"
              value={stats?.scheduledEvents ?? 0}
              change={stats?.changes.scheduled ?? 0}
              icon={<CalendarIcon className="h-5 w-5" />}
              onClick={() => router.push('/planner')}
            />
            <StatCard
              label="Taux de réussite"
              value={`${stats?.successRate ?? 0}%`}
              icon={<ChartBarIcon className="h-5 w-5" />}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {resourceLinks.map((resource) => (
              <button
                key={resource.key}
                onClick={() => router.push(resource.href)}
                className="rounded-xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <p className="text-2xl font-bold">
                  {data?.resources[resource.key] ?? 0}
                </p>
                <p className="text-sm text-gray-500">{resource.label}</p>
              </button>
            ))}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="overview">Vue d’ensemble</TabsTrigger>
              <TabsTrigger value="recent">Activité récente</TabsTrigger>
              <TabsTrigger value="analytics">Analytique</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Contenus récents</CardTitle>
                    <CardDescription>
                      Les dernières créations de votre espace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {data?.recentContent.length ? (
                      <div className="space-y-2">
                        {data.recentContent.map((content) => (
                          <button
                            key={content.id}
                            onClick={() => router.push('/content')}
                            className="flex w-full items-center justify-between gap-4 rounded-lg border p-3 text-left hover:bg-gray-50"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {content.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {content.platform || content.type} ·{' '}
                                {formatRelative(content.createdAt)}
                              </p>
                            </div>
                            <Badge variant="outline">{content.status}</Badge>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={<MessageSquareIcon className="h-10 w-10" />}
                        text="Aucun contenu généré pour le moment."
                        action="Créer un contenu"
                        onClick={() => router.push('/content')}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prochaines publications</CardTitle>
                    <CardDescription>
                      Votre calendrier marketing à venir
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {data?.upcomingEvents.length ? (
                      <div className="space-y-3">
                        {data.upcomingEvents.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => router.push('/planner')}
                            className="flex w-full gap-3 rounded-lg border p-3 text-left hover:bg-gray-50"
                          >
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                              <CalendarIcon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {event.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(event.scheduledAt)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {event.calendar.name}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={<CalendarIcon className="h-10 w-10" />}
                        text="Aucune publication planifiée."
                        action="Ouvrir le planner"
                        onClick={() => router.push('/planner')}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Flux d’activité</CardTitle>
                  <CardDescription>
                    Les dernières opérations réalisées dans votre espace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data?.activities.length ? (
                    <div className="divide-y">
                      {data.activities.map((activity) => (
                        <button
                          key={`${activity.type}-${activity.id}`}
                          onClick={() => router.push(activity.href)}
                          className="flex w-full items-center justify-between gap-4 py-4 text-left hover:bg-gray-50"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <ActivityIcon type={activity.type} />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {activity.action} · {activity.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatRelative(activity.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{activity.status}</Badge>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<SparklesIcon className="h-10 w-10" />}
                      text="Votre activité apparaîtra ici."
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Production sur 6 mois</CardTitle>
                    <CardDescription>
                      Contenus et images créés chaque mois
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-64 items-end gap-3">
                      {data?.analytics.map((item) => (
                        <div
                          key={item.month}
                          className="flex h-full flex-1 flex-col justify-end gap-1"
                        >
                          <div className="flex flex-1 items-end justify-center gap-1">
                            <div
                              title={`${item.content} contenus`}
                              className="w-2/5 rounded-t bg-blue-600"
                              style={{
                                height: `${Math.max(3, (item.content / maxAnalytics) * 100)}%`,
                              }}
                            />
                            <div
                              title={`${item.images} images`}
                              className="w-2/5 rounded-t bg-cyan-400"
                              style={{
                                height: `${Math.max(3, (item.images / maxAnalytics) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-center text-xs text-gray-500">
                            {item.month}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center gap-5 text-xs text-gray-500">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded bg-blue-600" />
                        Contenus
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded bg-cyan-400" />
                        Images
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>État des publications</CardTitle>
                    <CardDescription>
                      Résultats disponibles dans votre espace
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <HealthRow
                      label="Images terminées"
                      value={data?.health.completedImages ?? 0}
                    />
                    <HealthRow
                      label="Sites publiés"
                      value={data?.health.publishedWebsites ?? 0}
                    />
                    <HealthRow
                      label="Menus publiés"
                      value={data?.health.publishedMenus ?? 0}
                    />
                    <HealthRow
                      label="Affiches publiées"
                      value={data?.health.publishedPosters ?? 0}
                    />
                    {(data?.health.failedImages ?? 0) > 0 && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {data?.health.failedImages} génération(s) d’image ont
                          échoué.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  icon,
  onClick,
}: {
  label: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Card
      className={onClick ? 'cursor-pointer transition hover:shadow-md' : ''}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <span className="text-gray-500">{icon}</span>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        {change !== undefined && (
          <p
            className={`mt-1 text-xs ${
              change > 0
                ? 'text-emerald-600'
                : change < 0
                  ? 'text-amber-600'
                  : 'text-gray-500'
            }`}
          >
            {change > 0 ? '+' : ''}
            {change} par rapport au mois précédent
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityIcon({
  type,
}: {
  type: 'content' | 'image' | 'website' | 'menu' | 'poster';
}) {
  const className =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600';
  if (type === 'website') {
    return (
      <span className={className}>
        <GlobeIcon className="h-4 w-4" />
      </span>
    );
  }
  if (type === 'image' || type === 'poster') {
    return (
      <span className={className}>
        <ImageIcon className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className={className}>
      <MessageSquareIcon className="h-4 w-4" />
    </span>
  );
}

function HealthRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function EmptyState({
  icon,
  text,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-8 text-center text-gray-400">
      {icon}
      <p className="mt-3 text-sm text-gray-500">{text}</p>
      {action && onClick && (
        <Button className="mt-4" size="sm" onClick={onClick}>
          {action}
        </Button>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border bg-white"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-xl border bg-white" />
    </div>
  );
}

function formatRelative(value: string) {
  const date = new Date(value);
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000),
  );
  if (seconds < 60) return 'À l’instant';
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86_400) return `Il y a ${Math.floor(seconds / 3600)} h`;
  if (seconds < 604_800) return `Il y a ${Math.floor(seconds / 86_400)} j`;
  return date.toLocaleDateString('fr-FR');
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
