"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { SparklesIcon, CopyIcon, TrashIcon, CheckCircleIcon, CalendarIcon } from '@/components/icons';
import { useContentStore } from '@/lib/store/content-store';
import type { ContentItem } from '@/types';

export default function ContentPage() {
  const { 
    content, 
    updateContent, 
    generateContent, 
    loading,
    isGenerating,
    contentTypes,
    contentLengths,
    generatedContents,
    fetchContents,
    deleteContent
  } = useContentStore();
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const justGenerated = useRef(false);

  useEffect(() => {
    if (activeTab === 'manage' && !justGenerated.current) {
      fetchContents().catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      });
    }
    // Reset the flag after the effect runs so future manual tab switches do fetch
    justGenerated.current = false;
  }, [activeTab, fetchContents]);

  const handleGenerate = async () => {
    if (!content.topic) {
      setError('Please provide a Topic or Product Description to generate content.');
      return;
    }
    setError('');
    try {
      await generateContent();
      justGenerated.current = true;
      setActiveTab('manage'); // Switch to manage tab to see the result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    }
  };

  const handleInputChange = (field: keyof typeof content, value: string) => {
    updateContent({ [field]: value });
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI Copywriter</h1>
          </div>
          <p className="text-gray-500 max-w-2xl text-sm md:text-base">
            Generate high-converting ads, engaging social media posts, and professional blogs instantly using advanced AI models.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="create" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Studio</TabsTrigger>
          <TabsTrigger value="manage" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Generated Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5">
                <h2 className="text-lg font-bold text-gray-800">Content Parameters</h2>
                <p className="text-xs text-gray-500 mt-1">Configure exactly how you want the AI to write your copy.</p>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="type" className="text-sm font-semibold text-gray-700">Content Format</Label>
                    <Select
                      id="type"
                      value={content.type || ''}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    >
                      <option value="">Select format...</option>
                      {contentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type === 'AD' ? 'Facebook / Google Ad' : type === 'POST' ? 'Social Media Post' : type.charAt(0) + type.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="length" className="text-sm font-semibold text-gray-700">Output Length</Label>
                    <Select
                      id="length"
                      value={content.length || ''}
                      onChange={(e) => handleInputChange('length', e.target.value)}
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    >
                      <option value="">Select length...</option>
                      {contentLengths.map((length) => (
                        <option key={length} value={length}>
                          {length === 'SHORT' ? 'Short (Punchy)' : length === 'MEDIUM' ? 'Medium (Standard)' : 'Long (Detailed)'}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="space-y-2.5">
                  <Label htmlFor="topic" className="text-sm font-semibold text-gray-700">What is this about? (Product, Topic, or Offer) *</Label>
                  <Textarea
                    id="topic"
                    value={content.topic || ''}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    placeholder="e.g., A new AI software that automates social media posting. 50% discount for early adopters."
                    className="rounded-xl border-gray-300 focus:ring-indigo-500 resize-none h-24"
                  />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="targetAudience" className="text-sm font-semibold text-gray-700">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      value={content.targetAudience || ''}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      placeholder="e.g., Small business owners, Gen Z gamers"
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    />
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="tone" className="text-sm font-semibold text-gray-700">Voice & Tone</Label>
                    <Input
                      id="tone"
                      value={content.tone || ''}
                      onChange={(e) => handleInputChange('tone', e.target.value)}
                      placeholder="e.g., Persuasive, Professional, Funny"
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="callToAction" className="text-sm font-semibold text-gray-700">Call to Action (CTA)</Label>
                    <Input
                      id="callToAction"
                      value={content.callToAction || ''}
                      onChange={(e) => handleInputChange('callToAction', e.target.value)}
                      placeholder="e.g., Click the link below to sign up!"
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="hashtags" className="text-sm font-semibold text-gray-700">Hashtags (Optional)</Label>
                    <Input
                      id="hashtags"
                      value={content.hashtags || ''}
                      onChange={(e) => handleInputChange('hashtags', e.target.value)}
                      placeholder="e.g., #marketing #growth"
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-8 py-5 flex justify-end">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-all hover:shadow-lg w-full md:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <SparklesIcon className="h-5 w-5 animate-spin mr-2" />
                      Crafting Magic...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Side Panel / Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-indigo-600" />
                  Pro Tips for Best Results
                </h3>
                <ul className="space-y-3 text-sm text-indigo-800/80">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span><strong>Be specific:</strong> The more details you provide in the topic, the better the AI can tailor the copy.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span><strong>Know your audience:</strong> Mentioning pain points for your target audience yields higher conversions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span><strong>Experiment with Tone:</strong> Don't be afraid to try "Sarcastic" or "Urgent" to see what grabs attention.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="mt-0">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4"></div>
              <p className="text-gray-500 font-medium">Generating your content...</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your archive...</p>
            </div>
          ) : generatedContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-2xl shadow-sm text-center px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <SparklesIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No content generated yet</h3>
              <p className="text-gray-500 max-w-sm mb-6">Head over to the Studio tab to generate your first piece of high-converting AI marketing copy.</p>
              <Button onClick={() => setActiveTab('create')} className="rounded-xl h-10 px-6">Go to Studio</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {generatedContents.map((item, index) => (
                <div key={item.id || `content-${index}`} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-indigo-200 transition-colors">
                  <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                        {item.type}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                        {new Date(item.createdAt || '').toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyContent(item)}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Copy to clipboard"
                      >
                        {copiedId === item.id ? <CheckCircleIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContent(item.id)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg mb-4 line-clamp-1" title={item.title}>
                      {item.title || 'Untitled Campaign'}
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex-1 relative group overflow-hidden">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {item.body}
                      </p>
                      
                      {/* Copy Overlay */}
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          onClick={() => handleCopyContent(item)}
                          className="rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6"
                        >
                          {copiedId === item.id ? 'Copied!' : 'Copy Text'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-3 flex items-center gap-4 text-xs font-medium text-gray-500">
                    {item.tone && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                        {item.tone}
                      </span>
                    )}
                    {item.length && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        {item.length}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}