"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { SparklesIcon, TextIcon, PaletteIcon, FontIcon, CopyIcon, TrashIcon, EditIcon } from '@/components/icons';
import { useContentStore } from '@/lib/store/content-store';
import type { ContentItem } from '@/types';

export default function ContentPage() {
  const { 
    content, 
    updateContent, 
    generateContent, 
    loading,
    contentTypes,
    contentLengths,
    aiModels,
    generatedContents,
    fetchContents,
    deleteContent
  } = useContentStore();
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchContents().catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      });
    }
  }, [activeTab, fetchContents]);

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);
    try {
      await generateContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof typeof content, value: string) => {
    updateContent({ ...content, [field]: value });
  };

  const handleCopyContent = (item: ContentItem) => {
    navigator.clipboard.writeText(item.body || '');
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteContent = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete content');
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'success';
      case 'GENERATED': return 'default';
      case 'DRAFT': return 'secondary';
      case 'ARCHIVED': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Generation</h1>
          <p className="text-gray-600">Create and manage your marketing content</p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} className="flex items-center space-x-2">
          {isGenerating ? (
            <>
              <SparklesIcon className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="manage">Manage Content</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
              <CardDescription>Configure your content generation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Content Type</Label>
                  <select
                    id="type"
                    value={content.type || ''}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="">Select content type</option>
                    {contentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="length">Content Length</Label>
                  <select
                    id="length"
                    value={content.length || ''}
                    onChange={(e) => handleInputChange('length', e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="">Select length</option>
                    {contentLengths.map((length) => (
                      <option key={length} value={length}>
                        {length.charAt(0).toUpperCase() + length.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={content.topic || ''}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    placeholder="Enter your topic or idea..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input
                    id="tone"
                    value={content.tone || ''}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    placeholder="e.g., professional, casual, humorous"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input
                    id="hashtags"
                    value={content.hashtags || ''}
                    onChange={(e) => handleInputChange('hashtags', e.target.value)}
                    placeholder="e.g., #marketing #ai #content"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="callToAction">Call to Action</Label>
                  <Input
                    id="callToAction"
                    value={content.callToAction || ''}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                    placeholder="e.g., Learn more, Sign up, Buy now"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aiModel">AI Model</Label>
                  <select
                    id="aiModel"
                    value={content.aiModel || ''}
                    onChange={(e) => handleInputChange('aiModel', e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="">Select AI model</option>
                    {aiModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInstructions">Additional Instructions</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={content.additionalInstructions || ''}
                    onChange={(e) => handleInputChange('additionalInstructions', e.target.value)}
                    placeholder="Any additional instructions for the AI..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <SparklesIcon className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Generated Content</CardTitle>
              <CardDescription>View and edit your previously generated content</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : generatedContents.length === 0 ? (
                <div className="space-y-4 py-8 text-center">
                  <TextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">No content generated yet.</p>
                  <p className="text-sm text-gray-500">Create content in the "Create Content" tab to see it here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedContents.map((item) => (
                    <div key={item.id} className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{item.title || 'Untitled'}</h3>
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {item.status}
                          </Badge>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyContent(item)}
                          >
                            <CopyIcon className="h-4 w-4" />
                            {copiedId === item.id && <span className="ml-1 text-xs">Copied!</span>}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContent(item.id)}
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      {item.body && (
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.body}</p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {item.tone && <span>Tone: {item.tone}</span>}
                        {item.length && <span>Length: {item.length}</span>}
                        {item.createdAt && (
                          <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}