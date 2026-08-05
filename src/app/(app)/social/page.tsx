"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import {
  UsersIcon,
  PlusIcon,
  TrashIcon,
  LinkIcon,
  UnlinkIcon,
  SendIcon,
  CalendarIcon,
  SparklesIcon,
  RefreshIcon,
  CheckIcon
} from '@/components/icons';
import { SocialPlatformIcon, platformBrandColors } from '@/components/icons/SocialIcons';
import { useSocialStore } from '@/lib/store/social-store';
import toast from 'react-hot-toast';

export default function SocialPage() {
  const {
    accounts,
    posts,
    selectedPlatform,
    platforms,
    connectAccount,
    disconnectAccount,
    addPost,
    removePost,
    setSelectedPlatform,
    getPostsByPlatform,
    generatePost,
    loading: isStoreLoading,
  } = useSocialStore();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectForm, setConnectForm] = useState({ platform: 'instagram', accountName: '' });

  // AI Generator Form State
  const [aiForm, setAiForm] = useState({
    topic: '',
    platform: 'linkedin',
    tone: 'professional',
    language: 'français',
    hashtags: [] as string[],
  });
  const [aiHashtagInput, setAiHashtagInput] = useState('');
  const [activeTab, setActiveTab] = useState('generator');

  const filteredPosts = getPostsByPlatform(selectedPlatform);

  // Animations & UX state
  const [isGenerating, setIsGenerating] = useState(false);

  const handleConnect = () => {
    connectAccount({
      platform: connectForm.platform,
      accountName: connectForm.accountName,
      connected: true,
    });
    setConnectForm({ platform: 'instagram', accountName: '' });
    setShowConnectModal(false);
    toast.success('Account connected successfully');
  };

  const handleGenerate = async () => {
    if (!aiForm.topic.trim()) {
      toast.error('Please enter a topic first');
      return;
    }
    
    setIsGenerating(true);
    try {
      await generatePost({
        topic: aiForm.topic,
        platform: aiForm.platform,
        tone: aiForm.tone,
        hashtags: aiForm.hashtags.length > 0 ? aiForm.hashtags.join(',') : undefined,
      });
      toast.success('Post generated successfully!');
      setActiveTab('posts'); // Switch to posts tab to see the result
    } catch (error) {
      toast.error('Failed to generate post. Please try again.');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addAiHashtag = () => {
    if (aiHashtagInput.trim() && !aiForm.hashtags.includes(aiHashtagInput.trim())) {
      setAiForm({ ...aiForm, hashtags: [...aiForm.hashtags, aiHashtagInput.trim().replace(/^#/, '')] });
      setAiHashtagInput('');
    }
  };

  const removeAiHashtag = (tag: string) => {
    setAiForm({ ...aiForm, hashtags: aiForm.hashtags.filter((h) => h !== tag) });
  };

  const platformColor = (platform: string) => {
    const key = platform.toLowerCase();
    return platformBrandColors[key] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: '#6b7280' };
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'generated': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Helper to format post content with clickable hashtags
  const formatPostContent = (content: string) => {
    if (!content) return null;
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(' ').map((word, j) => {
          if (word.startsWith('#')) {
            return <span key={j} className="text-primary-600 font-medium">{word} </span>;
          }
          if (word.startsWith('@')) {
            return <span key={j} className="text-primary-600 font-medium">{word} </span>;
          }
          if (word.match(/https?:\/\//)) {
            return <span key={j} className="text-blue-500 hover:underline cursor-pointer">{word} </span>;
          }
          return <span key={j}>{word} </span>;
        })}
        <br />
      </span>
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Premium */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-primary-500 opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Social Media Hub</h1>
            <p className="mt-2 text-primary-100 max-w-xl">
              Create, schedule, and analyze your social content. Let our AI craft the perfect message for your audience.
            </p>
          </div>
          <div className="flex shrink-0 space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowConnectModal(true)} 
              className="border-primary-400 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all"
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Link Account
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
            <p className="text-sm font-medium text-primary-100">Total Posts</p>
            <p className="mt-1 text-2xl font-bold">{posts.length}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
            <p className="text-sm font-medium text-primary-100">Connected Accounts</p>
            <p className="mt-1 text-2xl font-bold">{accounts.filter(a => a.connected).length}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
            <p className="text-sm font-medium text-primary-100">Scheduled</p>
            <p className="mt-1 text-2xl font-bold">{posts.filter(p => p.status.toLowerCase() === 'scheduled').length}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
            <p className="text-sm font-medium text-primary-100">Total Followers</p>
            <p className="mt-1 text-2xl font-bold">
              {accounts.reduce((acc, curr) => acc + (curr.followers || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="flex justify-center md:justify-start">
          <TabsList className="bg-gray-100/80 p-1 backdrop-blur-sm border border-gray-200">
            <TabsTrigger value="generator" className="data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm rounded-md px-6 py-2 transition-all">
              <SparklesIcon className="mr-2 h-4 w-4 text-purple-500" />
              AI Generator
            </TabsTrigger>
            <TabsTrigger value="posts" className="data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm rounded-md px-6 py-2 transition-all">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Posts Library
            </TabsTrigger>
            <TabsTrigger value="accounts" className="data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-sm rounded-md px-6 py-2 transition-all">
              <UsersIcon className="mr-2 h-4 w-4" />
              Accounts
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB: AI GENERATOR */}
        <TabsContent value="generator" className="focus:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: Form */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-gray-200 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-primary-600"></div>
                <CardHeader className="bg-gray-50/50 pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <SparklesIcon className="mr-2 h-5 w-5 text-purple-600" />
                    AI Post Creator
                  </CardTitle>
                  <CardDescription>Let AI write high-converting social copy for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  
                  <div className="space-y-2">
                    <Label htmlFor="aiTopic" className="text-gray-700 font-medium">What is the post about?</Label>
                    <Textarea
                      id="aiTopic"
                      placeholder="e.g. We just launched a new feature that lets users automate their emails..."
                      className="resize-none min-h-[100px] border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      value={aiForm.topic}
                      onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aiPlatform" className="text-gray-700 font-medium">Platform</Label>
                      <Select
                        id="aiPlatform"
                        value={aiForm.platform}
                        onChange={(e) => setAiForm({ ...aiForm, platform: e.target.value })}
                      >
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter / X</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aiTone" className="text-gray-700 font-medium">Tone of Voice</Label>
                      <Select
                        id="aiTone"
                        value={aiForm.tone}
                        onChange={(e) => setAiForm({ ...aiForm, tone: e.target.value })}
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual & Friendly</option>
                        <option value="humorous">Humorous</option>
                        <option value="inspirational">Inspirational</option>
                        <option value="urgent">Urgent / Promo</option>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Target Hashtags (Optional)</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={aiHashtagInput}
                        onChange={(e) => setAiHashtagInput(e.target.value)}
                        placeholder="e.g. marketing, AI"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAiHashtag())}
                      />
                      <Button type="button" variant="secondary" onClick={addAiHashtag}>Add</Button>
                    </div>
                    {aiForm.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {aiForm.hashtags.map((tag) => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200 transition-colors border border-purple-200"
                            onClick={() => removeAiHashtag(tag)}
                          >
                            #{tag}
                            <span className="text-purple-400 hover:text-purple-900">×</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                </CardContent>
                <CardFooter className="bg-gray-50/50 pt-4 pb-4 border-t border-gray-100">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 text-white border-0 shadow-md transition-all hover:shadow-lg"
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiForm.topic.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshIcon className="mr-2 h-4 w-4 animate-spin" />
                        Generating magic...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="mr-2 h-4 w-4" />
                        Generate Post
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Col: Interactive Preview (Mockup) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="sticky top-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  Live Preview
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                    Interactive
                  </span>
                </h3>
                
                {/* Social Card Mockup */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden transition-all duration-300 max-w-md mx-auto xl:max-w-lg relative">
                  
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin mb-4"></div>
                      <p className="text-sm font-medium text-purple-800 animate-pulse">AI is writing your post...</p>
                    </div>
                  )}

                  {/* Mockup Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${platformColor(aiForm.platform).bg}`}>
                        <SocialPlatformIcon 
                          platform={aiForm.platform} 
                          className="w-4 h-4" 
                          style={{ color: platformColor(aiForm.platform).icon }} 
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{aiForm.platform} Post Preview</p>
                        <p className="text-xs text-gray-500">How your audience will see it</p>
                      </div>
                    </div>
                  </div>

                  {/* Mockup Body */}
                  <div className="p-5">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex-shrink-0"></div>
                      <div>
                        <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse mb-1.5"></div>
                        <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="text-gray-800 text-sm leading-relaxed mb-4">
                      {aiForm.topic ? (
                        <p className="opacity-50 italic">
                          "Your post about {aiForm.topic.substring(0, 40)}{aiForm.topic.length > 40 ? '...' : ''} will appear here."
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                          <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                          <div className="h-3 w-4/6 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    <div className="w-full aspect-video bg-gray-100 rounded-lg border border-gray-100 flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>

                    <div className="flex items-center space-x-4 pt-2 border-t border-gray-100 text-gray-400">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-100"></div>
                        <div className="h-2 w-8 bg-gray-100 rounded"></div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-100"></div>
                        <div className="h-2 w-8 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB: POSTS */}
        <TabsContent value="posts" className="focus:outline-none">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Your Content Library</h3>
                  <p className="text-sm text-gray-500">{filteredPosts.length} posts total</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-40 bg-gray-50"
                >
                  <option value="all">All Platforms</option>
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </Select>
                <Button onClick={() => setActiveTab('generator')} className="hidden sm:flex">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.map((post) => {
                  const pColor = platformColor(post.platform);
                  return (
                    <div key={post.id} className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                      {/* Post Header */}
                      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md ${pColor.bg} ${pColor.text} text-xs font-semibold`}>
                          <SocialPlatformIcon platform={post.platform} className="w-3.5 h-3.5" style={{ color: pColor.icon }} />
                          <span className="capitalize">{post.platform}</span>
                        </div>
                        <Badge variant="outline" className={`${statusColor(post.status)} capitalize text-[10px] uppercase tracking-wider font-bold`}>
                          {post.status}
                        </Badge>
                      </div>
                      
                      {/* Post Content */}
                      <div className="p-5 flex-grow">
                        <div className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                          {formatPostContent(post.content)}
                        </div>
                        
                        {post.mediaUrls && post.mediaUrls.length > 0 && (
                          <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 aspect-video relative">
                            <img src={post.mediaUrls[0]} alt="Post media" className="w-full h-full object-cover" />
                            {post.mediaUrls.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-md font-medium">
                                +{post.mediaUrls.length - 1}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Post Footer Actions */}
                      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-gray-500 font-medium">
                          {post.scheduledDate ? `Scheduled for ${new Date(post.scheduledDate).toLocaleDateString()}` : 'No date set'}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full">
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => removePost(post.id)}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <SparklesIcon className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No posts found</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  You haven't generated any social media posts yet. Use our AI Generator to create your first engaging post.
                </p>
                <Button onClick={() => setActiveTab('generator')}>
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Generate First Post
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB: ACCOUNTS */}
        <TabsContent value="accounts" className="focus:outline-none">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) => {
              const account = accounts.find((a) => a.platform === platform && a.connected);
              const pColor = platformColor(platform);
              
              return (
                <div key={platform} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                  <div className={`h-2 w-full ${pColor.bg}`}></div>
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${pColor.bg}`}>
                        <SocialPlatformIcon
                          platform={platform}
                          className="h-6 w-6"
                          style={{ color: pColor.icon || '#6b7280' }}
                        />
                      </div>
                      {account ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">Connected</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Not Connected</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 capitalize mb-1">{platform}</h3>
                    <p className="text-sm text-gray-500 mb-4 h-5">
                      {account ? account.accountName : `Connect your ${platform} profile`}
                    </p>

                    {account && (
                      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {account.followers !== undefined && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-500">Followers</span>
                            <span className="text-sm font-bold text-gray-900">{account.followers.toLocaleString()}</span>
                          </div>
                        )}
                        {account.lastSync && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-500">Last Synced</span>
                            <span className="text-xs font-medium text-gray-900">
                              {new Date(account.lastSync).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    {account ? (
                      <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                        onClick={() => disconnectAccount(account.id)}
                      >
                        <UnlinkIcon className="mr-2 h-4 w-4" />
                        Disconnect Account
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm"
                        onClick={() => {
                          setConnectForm({ platform, accountName: '' });
                          setShowConnectModal(true);
                        }}
                      >
                        <LinkIcon className="mr-2 h-4 w-4 text-gray-500" />
                        Connect Now
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Connect Account</h2>
            <p className="text-sm text-gray-500 mb-6">Link your profile to start scheduling posts.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="connectPlatform">Platform</Label>
                <Select
                  id="connectPlatform"
                  value={connectForm.platform}
                  onChange={(e) => setConnectForm({ ...connectForm, platform: e.target.value })}
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Username / Page Name</Label>
                <Input
                  id="accountName"
                  value={connectForm.accountName}
                  onChange={(e) => setConnectForm({ ...connectForm, accountName: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setShowConnectModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConnect} disabled={!connectForm.accountName.trim()}>
                Connect Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline ImageIcon placeholder for the mockup
function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}