"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  UsersIcon,
  PlusIcon,
  TrashIcon,
  LinkIcon,
  UnlinkIcon,
  SendIcon,
  CalendarIcon,
} from '@/components/icons';
import { SocialPlatformIcon, platformBrandColors } from '@/components/icons/SocialIcons';
import { useSocialStore, SocialAccount, SocialPost } from '@/lib/store/social-store';


export default function SocialPage() {
  const {
    accounts,
    posts,
    selectedPlatform,
    platforms,
    connectAccount,
    disconnectAccount,
    addPost,
    updatePost,
    removePost,
    setSelectedPlatform,
    getPostsByPlatform,
  } = useSocialStore();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [connectForm, setConnectForm] = useState({ platform: 'instagram', accountName: '' });
  const [postForm, setPostForm] = useState({
    content: '',
    platform: 'instagram',
    scheduledDate: '',
    status: 'draft',
    mediaUrls: [] as string[],
    hashtags: [] as string[],
  });
  const [hashtagInput, setHashtagInput] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');

  const filteredPosts = getPostsByPlatform(selectedPlatform);

  const handleConnect = () => {
    connectAccount({
      platform: connectForm.platform,
      accountName: connectForm.accountName,
      connected: true,
    });
    setConnectForm({ platform: 'instagram', accountName: '' });
    setShowConnectModal(false);
  };

  const handleAddPost = () => {
    addPost(postForm);
    setPostForm({
      content: '',
      platform: 'instagram',
      scheduledDate: '',
      status: 'draft',
      mediaUrls: [],
      hashtags: [],
    });
    setShowPostModal(false);
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !postForm.hashtags.includes(hashtagInput.trim())) {
      setPostForm({ ...postForm, hashtags: [...postForm.hashtags, hashtagInput.trim()] });
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setPostForm({ ...postForm, hashtags: postForm.hashtags.filter((h) => h !== tag) });
  };

  const addMediaUrl = () => {
    if (mediaUrlInput.trim()) {
      setPostForm({ ...postForm, mediaUrls: [...postForm.mediaUrls, mediaUrlInput.trim()] });
      setMediaUrlInput('');
    }
  };

  const removeMediaUrl = (url: string) => {
    setPostForm({ ...postForm, mediaUrls: postForm.mediaUrls.filter((u) => u !== url) });
  };

  const platformColor = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: 'bg-blue-100 text-blue-700',
      instagram: 'bg-pink-100 text-pink-700',
      twitter: 'bg-sky-100 text-sky-700',
      linkedin: 'bg-blue-200 text-blue-800',
      tiktok: 'bg-gray-100 text-gray-700',
      youtube: 'bg-red-100 text-red-700',
    };
    return colors[platform] || 'bg-gray-100 text-gray-700';
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media</h1>
          <p className="text-gray-600">Manage your social accounts and posts</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowConnectModal(true)} className="flex items-center space-x-2">
            <LinkIcon className="h-4 w-4" />
            Connect Account
          </Button>
          <Button onClick={() => setShowPostModal(true)} className="flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) => {
              const account = accounts.find((a) => a.platform === platform && a.connected);
              return (
                <Card key={platform}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 flex items-center justify-center ${platformBrandColors[platform]?.bg || 'bg-gray-100'}`}>
                        <SocialPlatformIcon
                          platform={platform}
                          className="h-5 w-5"
                          style={{ color: platformBrandColors[platform]?.icon || '#6b7280' }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base capitalize">{platform}</CardTitle>
                        <CardDescription>
                          {account ? account.accountName : 'Not connected'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {account ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <Badge className="bg-green-100 text-green-700">Connected</Badge>
                        </div>
                        {account.followers !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Followers</span>
                            <span className="font-medium">{account.followers.toLocaleString()}</span>
                          </div>
                        )}
                        {account.lastSync && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Last Synced</span>
                            <span className="text-xs">
                              {new Date(account.lastSync).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Click connect to link your {platform} account</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    {account ? (
                      <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700"
                        onClick={() => disconnectAccount(account.id)}
                      >
                        <UnlinkIcon className="mr-2 h-4 w-4" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setConnectForm({ platform, accountName: '' });
                          setShowConnectModal(true);
                        }}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Social Posts</CardTitle>
                  <CardDescription>{filteredPosts.length} total posts</CardDescription>
                </div>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="rounded-md border px-3 py-1.5 text-sm"
                >
                  <option value="all">All Platforms</option>
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredPosts.length > 0 ? (
                <div className="space-y-3">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm">{post.content}</p>
                          {post.hashtags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {post.hashtags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {post.mediaUrls.length > 0 && (
                            <div className="mt-2 flex gap-2">
                              {post.mediaUrls.map((url, i) => (
                                <div key={i} className="h-16 w-16 overflow-hidden rounded bg-gray-100">
                                  <img src={url} alt="" className="h-full w-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <Badge className={`flex items-center gap-1.5 ${platformColor(post.platform)}`}>
                            <SocialPlatformIcon
                              platform={post.platform}
                              className="h-3.5 w-3.5"
                              style={{ color: platformBrandColors[post.platform]?.icon }}
                            />
                            {post.platform}
                          </Badge>
                          <Badge className={statusColor(post.status)}>
                            {post.status}
                          </Badge>
                          {post.scheduledDate && (
                            <span className="text-xs text-gray-400">
                              {new Date(post.scheduledDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => removePost(post.id)}>
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <SendIcon className="h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">No posts yet</p>
                  <p className="text-sm text-gray-400">Create your first social post</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4">Connect Account</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="connectPlatform">Platform</Label>
                <select
                  id="connectPlatform"
                  value={connectForm.platform}
                  onChange={(e) => setConnectForm({ ...connectForm, platform: e.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={connectForm.accountName}
                  onChange={(e) => setConnectForm({ ...connectForm, accountName: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowConnectModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConnect}>Connect</Button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Create New Post</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postContent">Content</Label>
                <textarea
                  id="postContent"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  placeholder="Write your post..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postPlatform">Platform</Label>
                  <select
                    id="postPlatform"
                    value={postForm.platform}
                    onChange={(e) => setPostForm({ ...postForm, platform: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postDate">Schedule Date</Label>
                  <Input
                    id="postDate"
                    type="date"
                    value={postForm.scheduledDate}
                    onChange={(e) => setPostForm({ ...postForm, scheduledDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hashtags</Label>
                <div className="flex space-x-2">
                  <Input
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    placeholder="Add hashtag"
                    onKeyDown={(e) => e.key === 'Enter' && addHashtag()}
                  />
                  <Button variant="outline" size="sm" onClick={addHashtag}>
                    Add
                  </Button>
                </div>
                {postForm.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {postForm.hashtags.map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeHashtag(tag)}>
                        #{tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Media URLs</Label>
                <div className="flex space-x-2">
                  <Input
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    placeholder="https://..."
                    onKeyDown={(e) => e.key === 'Enter' && addMediaUrl()}
                  />
                  <Button variant="outline" size="sm" onClick={addMediaUrl}>
                    Add
                  </Button>
                </div>
                {postForm.mediaUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {postForm.mediaUrls.map((url, i) => (
                      <div key={i} className="relative h-12 w-12 overflow-hidden rounded bg-gray-100">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                          className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center"
                          onClick={() => removeMediaUrl(url)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPostModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPost}>
                <SendIcon className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}