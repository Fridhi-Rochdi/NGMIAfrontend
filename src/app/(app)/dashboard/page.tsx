"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { CalendarIcon, ChartBarIcon, UsersIcon, SparklesIcon, MessageSquareIcon } from '@/components/icons';
import { useDashboardStore } from '@/lib/store/dashboard-store';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const { stats, recentPosts, activities, loading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getChangeText = (change: number) => {
    if (change > 0) return `+${change} from last month`;
    if (change < 0) return `${change} from last month`;
    return 'No change';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your marketing AI.</p>
        </div>
        <Button onClick={() => router.push('/content')}>
          <SparklesIcon className="mr-2 h-4 w-4" />
          Generate Content
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
                <p className="text-xs text-muted-foreground">{getChangeText(stats?.postsChange || 0)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeAccounts || 0}</div>
                <p className="text-xs text-muted-foreground">{getChangeText(stats?.accountsChange || 0)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.scheduledPosts || 0}</div>
                <p className="text-xs text-muted-foreground">{getChangeText(stats?.scheduledChange || 0)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Success Rate</CardTitle>
                <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.aiSuccessRate || 0}%</div>
                <p className="text-xs text-muted-foreground">{getChangeText(stats?.successRateChange || 0)}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                  <CardDescription>Latest content generated by AI</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquareIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-gray-600">No posts generated yet.</p>
                      <Button className="mt-4" onClick={() => router.push('/content')}>
                        Generate Your First Post
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentPosts.map((post, index) => (
                        <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{post.title}</p>
                              <p className="text-sm text-gray-500">{post.platform} - {formatTimeAgo(post.createdAt)}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{post.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <Alert>
                <AlertDescription>
                  You have {stats?.scheduledPosts || 0} pending scheduled posts. Check your planner to manage them.
                </AlertDescription>
              </Alert>
              
              <Card>
                <CardHeader>
                  <CardTitle>Activity Feed</CardTitle>
                  <CardDescription>Recent actions in your workspace</CardDescription>
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No recent activity.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">{activity.user.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{activity.action} {activity.content}</p>
                              <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>AI-generated content performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 text-gray-500">Analytics visualization would appear here</p>
                      <p className="text-sm text-gray-400">Connect more accounts to see detailed analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}