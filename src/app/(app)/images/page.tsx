"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { ImageIcon, SparklesIcon, DownloadIcon, TrashIcon, RefreshIcon } from '@/components/icons';
import { useImagesStore } from '@/lib/store/images-store';

export default function ImagesPage() {
  const {
    image,
    updateImage,
    generateImage,
    loading,
    styles,
    sizes,
    aiModels,
    generatedImages,
    clearImage,
  } = useImagesStore();
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);
    try {
      await generateImage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof typeof image, value: string) => {
    updateImage({ ...image, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Image Generation</h1>
          <p className="text-gray-600">Create stunning AI-generated images for your marketing</p>
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
              Generate Image
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Image</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Image Configuration</CardTitle>
                <CardDescription>Configure your image generation parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <textarea
                    id="prompt"
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={image.prompt || ''}
                    onChange={(e) => handleInputChange('prompt', e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="negativePrompt">Negative Prompt</Label>
                  <Input
                    id="negativePrompt"
                    value={image.negativePrompt || ''}
                    onChange={(e) => handleInputChange('negativePrompt', e.target.value)}
                    placeholder="What to avoid in the image..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <select
                    id="style"
                    value={image.style || ''}
                    onChange={(e) => handleInputChange('style', e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {styles.map((style) => (
                      <option key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <select
                    id="size"
                    value={image.size || ''}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiModel">AI Model</Label>
                  <select
                    id="aiModel"
                    value={image.aiModel || ''}
                    onChange={(e) => handleInputChange('aiModel', e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {aiModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
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
                      Generate Image
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Generated image preview</CardDescription>
              </CardHeader>
              <CardContent>
                {image.generatedImageUrl ? (
                  <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
                      <img
                        src={image.generatedImageUrl}
                        alt="Generated"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleGenerate}>
                        <RefreshIcon className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Generated image will appear here
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
              <CardDescription>Your previously generated images</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {generatedImages.map((img, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-lg border bg-gray-100">
                      <div className="aspect-square">
                        <img
                          src={img.generatedImageUrl}
                          alt={img.prompt}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="w-full">
                          <p className="text-xs text-white line-clamp-2">{img.prompt}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <Badge variant="outline" className="text-white border-white/30">
                              {img.style}
                            </Badge>
                            <span className="text-xs text-white/70">
                              {img.generatedAt ? new Date(img.generatedAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No images generated yet</p>
                  <p className="text-sm text-gray-400">Generate your first image to see it here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}